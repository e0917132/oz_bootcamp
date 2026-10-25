// ===== 암호화폐 가격 변동 추적기 =====
//
// 흐름
// 1. fetchTickers : 1초마다 API 요청 → USDT 항목만 골라 coins에 저장
// 2. render       : 현재 탭·검색어·정렬 기준으로 보여줄 목록을 정하고 화면 갱신
//                   (행은 처음 한 번만 만들고, 이후에는 값만 바꾼다)
// 3. 사용자 행동(탭, 검색, ★, 정렬, 더보기) → 상태 변경 → render


// ===== 설정값 =====
const API_URL = "https://api4.binance.com/api/v3/ticker/24hr";
const POLL_INTERVAL = 1000;     // 정상일 때 10초마다 요청
const RETRY_INTERVAL = 3000;    // 실패하면 3초 뒤 재시도
const PAGE_SIZE = 100;          // 한 번에 보여줄 개수 (더보기 단위)
const FLASH_DURATION = 600;     // 가격 변동 깜빡임 시간(ms)

const FAVORITES_KEY = "favorites";
const ALERTS_KEY = "crypto-alerts";


// ===== DOM 요소 =====
const listEl = document.querySelector("#coin-list");
const emptyEl = document.querySelector("#empty");
const moreButton = document.querySelector("#more");
const statusEl = document.querySelector("#status");
const statusText = document.querySelector("#status-text");
const searchInput = document.querySelector("#search");
const tabButtons = document.querySelectorAll(".tab");
const sortButtons = document.querySelectorAll(".sort-btn");
const allCountEl = document.querySelector("#count-all");
const favCountEl = document.querySelector("#count-fav");

const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modal-title");
const modalFav = document.querySelector("#modal-fav");
const modalClose = document.querySelector("#modal-close");
const modalPrice = document.querySelector("#modal-price");
const modalChange = document.querySelector("#modal-change");
const modalHigh = document.querySelector("#modal-high");
const modalLow = document.querySelector("#modal-low");
const modalOpen = document.querySelector("#modal-open");
const modalCount = document.querySelector("#modal-count");
const modalVolume = document.querySelector("#modal-volume");
const modalQuoteVolume = document.querySelector("#modal-quote-volume");
const alertInfo = document.querySelector("#alert-info");
const alertForm = document.querySelector("#alert-form");
const alertInput = document.querySelector("#alert-input");
const alertClear = document.querySelector("#alert-clear");


// ===== 상태(state) =====
const coins = new Map();   // symbol → 코인 데이터   예) "BTCUSDT" → { base: "BTC", price: 67123.45, … }
const rows = new Map();    // symbol → 화면의 행 요소들 (한 번 만들고 재사용)

let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];   // ["BTCUSDT", …]
let alerts = JSON.parse(localStorage.getItem(ALERTS_KEY)) || {};         // { "BTCUSDT": { target, direction } }

let currentTab = "all";         // "all" | "favorites"
let keyword = "";               // 검색어
let sortKey = "quoteVolume";    // 정렬 기준: base | price | changePercent | high | low | quoteVolume
let sortDir = "desc";           // "asc"(오름차순) | "desc"(내림차순)
let visibleLimit = PAGE_SIZE;   // 지금 보여주는 최대 개수
let lastOrder = "";             // 직전에 그린 행 순서 (바뀌었을 때만 다시 배치)
let openSymbol = null;          // 모달에 열려 있는 코인
let isLoaded = false;           // 첫 응답을 받았는지


// =====================================================
// 1. 데이터 가져오기
// =====================================================

// setInterval 대신 "응답 처리가 끝나면 1초 뒤 다음 요청"으로 이어간다.
// → 응답이 1초보다 늦게 와도 요청이 겹쳐 쌓이지 않는다.
function fetchTickers() {
    // 다른 탭을 보고 있을 때는 요청을 쉬어서 API 사용량을 아낀다
    if (document.hidden) {
        setTimeout(fetchTickers, POLL_INTERVAL);
        return;
    }

    fetch(API_URL)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            updateCoins(data);
            isLoaded = true;
            render();
            updateModal();
            checkAlerts();
            setStatus(true);
            setTimeout(fetchTickers, POLL_INTERVAL);
        })
        .catch(error => {
            console.log("요청 실패:", error.message);
            setStatus(false);
            setTimeout(fetchTickers, RETRY_INTERVAL);
        });
}


// API 응답(3,700여 개) → USDT 마켓만 coins에 저장
function updateCoins(data) {
    const received = {};   // 이번 응답에 들어 있던 symbol 표시용

    for (const item of data) {
        if (!item.symbol.endsWith("USDT")) {
            continue;
        }

        const quoteVolume = Number(item.quoteVolume);
        if (quoteVolume === 0) {
            continue;   // 거래대금 0 = 거래 중지·상장폐지 항목
        }

        received[item.symbol] = true;

        // API 값은 전부 문자열이라 Number()로 변환
        coins.set(item.symbol, {
            symbol: item.symbol,
            base: item.symbol.slice(0, -4),   // "BTCUSDT" → "BTC"
            price: Number(item.lastPrice),
            change: Number(item.priceChange),
            changePercent: Number(item.priceChangePercent),
            high: Number(item.highPrice),
            low: Number(item.lowPrice),
            open: Number(item.openPrice),
            volume: Number(item.volume),
            quoteVolume: quoteVolume,
            count: item.count,
        });
    }

    // 이번 응답에서 빠진 코인은 목록과 화면에서 제거
    for (const symbol of coins.keys()) {
        if (!received[symbol]) {
            coins.delete(symbol);
            const entry = rows.get(symbol);
            if (entry) {
                entry.row.remove();
                rows.delete(symbol);
            }
        }
    }
}


// 헤더의 업데이트 상태 표시
function setStatus(isLive) {
    statusEl.classList.toggle("live", isLive);
    statusEl.classList.toggle("error", !isLive);

    if (isLive) {
        const time = new Date().toLocaleTimeString("ko-KR");
        statusText.textContent = `실시간 · ${time} 업데이트`;
    } else {
        statusText.textContent = `연결 끊김 · ${RETRY_INTERVAL / 1000}초 후 재시도`;
    }
}


// =====================================================
// 2. 화면 그리기
// =====================================================

// 현재 탭 + 검색어로 거르고, 정렬 기준으로 정렬한 배열
function getVisibleCoins() {
    const search = keyword.toLowerCase();
    const result = [];

    for (const coin of coins.values()) {
        if (currentTab === "favorites" && !favorites.includes(coin.symbol)) {
            continue;
        }
        if (search !== "" && !coin.base.toLowerCase().includes(search)) {
            continue;
        }
        result.push(coin);
    }

    result.sort(compareCoins);
    return result;
}


// 정렬 비교 함수: 음수면 a가 앞, 양수면 b가 앞
function compareCoins(a, b) {
    let diff;
    if (sortKey === "base") {
        diff = a.base.localeCompare(b.base);   // 문자열 사전순 비교
    } else {
        diff = a[sortKey] - b[sortKey];        // 숫자 비교
    }
    return sortDir === "asc" ? diff : -diff;
}


function render() {
    const list = getVisibleCoins();
    const shown = list.slice(0, visibleLimit);   // 상위 N개만

    // 탭의 개수 표시
    allCountEl.textContent = coins.size;
    let favCount = 0;
    for (const symbol of favorites) {
        if (coins.has(symbol)) {
            favCount++;
        }
    }
    favCountEl.textContent = favCount;

    // 보이는 행만 값 갱신 (없으면 새로 만듦)
    for (const coin of shown) {
        let entry = rows.get(coin.symbol);
        if (!entry) {
            entry = createRow(coin.symbol);
            rows.set(coin.symbol, entry);
        }
        updateRow(entry, coin);
    }

    // 순서가 바뀌었을 때만 행을 다시 배치 (매초 전체를 다시 붙이지 않도록)
    let order = "";
    for (const coin of shown) {
        order += coin.symbol + ",";
    }
    if (order !== lastOrder) {
        listEl.replaceChildren();   // 목록 비우기 (행 요소는 rows에 남아 있어 재사용)
        for (const coin of shown) {
            listEl.appendChild(rows.get(coin.symbol).row);
        }
        lastOrder = order;
    }

    // 더보기 버튼
    moreButton.hidden = list.length <= visibleLimit;
    moreButton.textContent = `더보기 (${shown.length} / ${list.length})`;

    // 빈 목록 안내
    emptyEl.hidden = list.length > 0;
    if (!isLoaded) {
        emptyEl.textContent = "불러오는 중...";
    } else if (keyword !== "") {
        emptyEl.textContent = `'${keyword}' 검색 결과가 없습니다.`;
    } else if (currentTab === "favorites") {
        emptyEl.textContent = "관심 항목이 없습니다. ☆를 눌러 추가해 보세요.";
    }
}


// 행 하나 만들기 (처음 한 번만)
function createRow(symbol) {
    const row = document.createElement("li");
    row.className = "coin-row";

    const star = document.createElement("button");
    star.type = "button";
    star.className = "star";
    star.setAttribute("aria-label", "관심 항목 추가/해제");
    star.addEventListener("click", (event) => {
        event.stopPropagation();   // 행 클릭(모달 열기)까지 전달되지 않게
        toggleFavorite(symbol);
    });

    const name = document.createElement("span");
    name.className = "name";
    const base = document.createElement("span");
    base.className = "base";
    const quote = document.createElement("span");
    quote.className = "quote";
    quote.textContent = "/USDT";
    const bell = document.createElement("span");
    bell.className = "bell";
    bell.textContent = "🔔";
    bell.title = "목표가 알림 설정됨";
    name.appendChild(base);
    name.appendChild(quote);
    name.appendChild(bell);

    const price = document.createElement("span");
    price.className = "price";
    const change = document.createElement("span");
    change.className = "change";
    const high = document.createElement("span");
    high.className = "high";
    const low = document.createElement("span");
    low.className = "low";
    const volume = document.createElement("span");
    volume.className = "volume";

    row.appendChild(star);
    row.appendChild(name);
    row.appendChild(price);
    row.appendChild(change);
    row.appendChild(high);
    row.appendChild(low);
    row.appendChild(volume);

    row.addEventListener("click", () => openModal(symbol));

    return {
        row, star, base, bell, price, change, high, low, volume,
        lastPrice: null,      // 직전에 표시한 가격 (깜빡임 판단용)
        lastKeyword: null,    // 직전에 하이라이트한 검색어
        flashTimer: null,
    };
}


// 행의 값 갱신
function updateRow(entry, coin) {
    const isFavorite = favorites.includes(coin.symbol);
    entry.star.textContent = isFavorite ? "★" : "☆";
    entry.star.classList.toggle("active", isFavorite);

    entry.bell.hidden = alerts[coin.symbol] === undefined;

    // 검색어가 바뀌었을 때만 이름(하이라이트) 다시 그리기
    if (entry.lastKeyword !== keyword) {
        highlightName(entry.base, coin.base);
        entry.lastKeyword = keyword;
    }

    entry.price.textContent = formatPrice(coin.price);
    entry.change.textContent = formatPercent(coin.changePercent);
    entry.change.classList.toggle("up", coin.changePercent > 0);
    entry.change.classList.toggle("down", coin.changePercent < 0);
    entry.high.textContent = formatPrice(coin.high);
    entry.low.textContent = formatPrice(coin.low);
    entry.volume.textContent = formatVolume(coin.quoteVolume);

    // 직전 가격과 비교해서 깜빡임
    if (entry.lastPrice !== null && coin.price !== entry.lastPrice) {
        flash(entry, coin.price > entry.lastPrice ? "flash-up" : "flash-down");
    }
    entry.lastPrice = coin.price;
}


// 가격 변동 깜빡임: 클래스를 붙였다가 잠시 뒤 떼면 CSS transition으로 서서히 사라진다
function flash(entry, className) {
    entry.price.classList.remove("flash-up", "flash-down");
    entry.price.classList.add(className);

    clearTimeout(entry.flashTimer);
    entry.flashTimer = setTimeout(() => {
        entry.price.classList.remove(className);
    }, FLASH_DURATION);
}


// 검색어 하이라이트: "BTC"에서 "bt" 검색 → <mark>BT</mark>C
// 사용자 입력(검색어)을 다루므로 innerHTML 대신 요소를 직접 만든다
function highlightName(el, text) {
    el.textContent = "";
    const index = keyword === "" ? -1 : text.toLowerCase().indexOf(keyword.toLowerCase());

    if (index === -1) {
        el.textContent = text;
        return;
    }

    const mark = document.createElement("mark");
    mark.textContent = text.slice(index, index + keyword.length);
    el.append(text.slice(0, index), mark, text.slice(index + keyword.length));
}


// =====================================================
// 3. 숫자 표시 형식
// =====================================================

// 가격 크기에 따라 소수점 자릿수 조절 (BTC 67,123.45 / 소형 코인 0.00001234)
function formatPrice(price) {
    let digits;
    if (price >= 1000) {
        digits = 2;
    } else if (price >= 1) {
        digits = 4;
    } else if (price >= 0.01) {
        digits = 6;
    } else {
        digits = 8;
    }
    return price.toLocaleString("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}

// 2.3123 → "▲ +2.31%"
function formatPercent(percent) {
    if (percent > 0) {
        return `▲ +${percent.toFixed(2)}%`;
    }
    if (percent < 0) {
        return `▼ ${percent.toFixed(2)}%`;
    }
    return "0.00%";
}

// 1234567890 → "1.23B"
function formatVolume(volume) {
    if (volume >= 1e9) {
        return (volume / 1e9).toFixed(2) + "B";
    }
    if (volume >= 1e6) {
        return (volume / 1e6).toFixed(2) + "M";
    }
    if (volume >= 1e3) {
        return (volume / 1e3).toFixed(2) + "K";
    }
    return volume.toFixed(2);
}

// 1234567.891 → "1,234,567.89"
function formatNumber(number) {
    return number.toLocaleString("en-US", { maximumFractionDigits: 2 });
}


// =====================================================
// 4. 관심 항목 (localStorage)
// =====================================================

function toggleFavorite(symbol) {
    if (favorites.includes(symbol)) {
        favorites = favorites.filter(item => item !== symbol);
    } else {
        favorites.push(symbol);
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    render();
    updateModal();
}


// =====================================================
// 5. 탭 · 검색 · 정렬 · 더보기
// =====================================================

for (const button of tabButtons) {
    button.addEventListener("click", () => {
        currentTab = button.dataset.tab;
        for (const tab of tabButtons) {
            tab.classList.toggle("active", tab === button);
        }
        visibleLimit = PAGE_SIZE;
        render();
    });
}

searchInput.addEventListener("input", () => {
    keyword = searchInput.value.trim();
    visibleLimit = PAGE_SIZE;
    render();
});

for (const button of sortButtons) {
    button.addEventListener("click", () => {
        const key = button.dataset.sort;
        if (sortKey === key) {
            sortDir = sortDir === "asc" ? "desc" : "asc";   // 같은 열 → 방향 뒤집기
        } else {
            sortKey = key;
            sortDir = key === "base" ? "asc" : "desc";       // 이름은 A→Z, 숫자는 큰 값부터
        }
        visibleLimit = PAGE_SIZE;
        updateSortButtons();
        render();
    });
}

// 정렬 중인 열에 ▲▼ 표시
function updateSortButtons() {
    for (const button of sortButtons) {
        const isActive = button.dataset.sort === sortKey;
        button.classList.toggle("active", isActive);
        let arrow = "";
        if (isActive) {
            arrow = sortDir === "asc" ? " ▲" : " ▼";
        }
        button.textContent = button.dataset.label + arrow;
    }
}

moreButton.addEventListener("click", () => {
    visibleLimit += PAGE_SIZE;
    render();
});


// =====================================================
// 6. 상세 모달
// =====================================================

function openModal(symbol) {
    openSymbol = symbol;
    alertInput.value = "";
    modal.hidden = false;
    updateModal();
}

function closeModal() {
    modal.hidden = true;
    openSymbol = null;
}

// 모달이 열려 있으면 최신 값으로 갱신 (1초마다 호출됨)
function updateModal() {
    if (openSymbol === null) {
        return;
    }

    const coin = coins.get(openSymbol);
    if (!coin) {
        closeModal();   // 목록에서 사라진 코인
        return;
    }

    modalTitle.textContent = `${coin.base} / USDT`;

    const isFavorite = favorites.includes(coin.symbol);
    modalFav.textContent = isFavorite ? "★" : "☆";
    modalFav.classList.toggle("active", isFavorite);

    modalPrice.textContent = `${formatPrice(coin.price)} USDT`;

    const sign = coin.change > 0 ? "+" : coin.change < 0 ? "-" : "";
    modalChange.textContent = `${sign}${formatPrice(Math.abs(coin.change))} (${formatPercent(coin.changePercent)})`;
    modalChange.classList.toggle("up", coin.change > 0);
    modalChange.classList.toggle("down", coin.change < 0);

    modalHigh.textContent = formatPrice(coin.high);
    modalLow.textContent = formatPrice(coin.low);
    modalOpen.textContent = formatPrice(coin.open);
    modalCount.textContent = formatNumber(coin.count);
    modalVolume.textContent = `${formatNumber(coin.volume)} ${coin.base}`;
    modalQuoteVolume.textContent = formatNumber(coin.quoteVolume);

    const alertItem = alerts[coin.symbol];
    if (alertItem) {
        const word = alertItem.direction === "above" ? "이상이" : "이하가";
        alertInfo.textContent = `${formatPrice(alertItem.target)} USDT ${word} 되면 알림이 뜹니다.`;
        alertClear.hidden = false;
    } else {
        alertInfo.textContent = "목표가를 설정하면 도달했을 때 알림 창이 뜹니다.";
        alertClear.hidden = true;
    }
}

modalFav.addEventListener("click", () => toggleFavorite(openSymbol));
modalClose.addEventListener("click", closeModal);

// 바깥 어두운 영역 클릭 → 닫기 (모달 상자 안쪽 클릭은 제외)
modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Esc 키 → 닫기
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
        closeModal();
    }
});


// =====================================================
// 7. 목표가 알림
// =====================================================

alertForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const target = Number(alertInput.value);
    if (alertInput.value.trim() === "" || Number.isNaN(target) || target <= 0) {
        alert("올바른 목표 가격을 입력하세요.");
        return;
    }

    const coin = coins.get(openSymbol);
    // 현재가보다 높게 설정하면 "이상", 낮게 설정하면 "이하" 도달 시 알림
    alerts[openSymbol] = {
        target: target,
        direction: target >= coin.price ? "above" : "below",
    };
    saveAlerts();

    alertInput.value = "";
    updateModal();
    render();
});

alertClear.addEventListener("click", () => {
    delete alerts[openSymbol];
    saveAlerts();
    updateModal();
    render();
});

function saveAlerts() {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
}

// 새 가격이 들어올 때마다 목표가 도달 여부 확인
function checkAlerts() {
    const messages = [];

    for (const symbol in alerts) {
        const coin = coins.get(symbol);
        if (!coin) {
            continue;
        }

        const { target, direction } = alerts[symbol];
        const reachedUp = direction === "above" && coin.price >= target;
        const reachedDown = direction === "below" && coin.price <= target;

        if (reachedUp || reachedDown) {
            const word = direction === "above" ? "이상" : "이하";
            messages.push(
                `${coin.base}: 현재가 ${formatPrice(coin.price)} USDT\n` +
                `(목표가 ${formatPrice(target)} USDT ${word} 도달)`
            );
            delete alerts[symbol];   // 한 번 알리면 해제
        }
    }

    if (messages.length > 0) {
        saveAlerts();
        render();
        updateModal();
        // 화면이 먼저 갱신된 뒤 알림 창이 뜨도록 잠깐 미룬다
        setTimeout(() => {
            alert("🔔 목표가 도달!\n\n" + messages.join("\n\n"));
        }, 0);
    }
}


// =====================================================
// 시작
// =====================================================
updateSortButtons();
render();
fetchTickers();
