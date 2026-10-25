// 버튼 + 키보드 사칙연산 계산기
//
// 버튼을 누를 때마다 숫자와 연산자가 하나씩 나뉘어 들어오므로
// 문자열을 다시 쪼갤 필요 없이 토큰 배열에 바로 쌓는다
//   예: 12 → + → 3 → * → -4 → Enter
//   tokens = [12, "+", 3, "*", -4]
//
// 계산 순서 (day2의 calculate 방식)
// *, / 를 먼저 계산하고, 남은 값들을 더한다
//   [12, "+", 3, "*", -4]  →  [12, -12]  →  0


// 계산기 상태 
let isOn = false;          // 전원 상태
let tokens = [];           // 확정된 숫자와 연산자 (예: [12, "+", 3, "*"])
let current = '';          // 지금 입력 중인 숫자 (예: "-4", "3.5"), 없으면 ""
let justEvaluated = false; // Enter 직후인지 (true면 숫자를 누를 때 새로 시작)
let hasError = false;      // 오류 상태인지
let hasDot = false;        // 지금 입력 중인 숫자에 소수점이 있는지
let errorMessage = '';     // 마지막 오류 내용
let errorTimer = null;     // 오류 화면을 자동으로 지우는 타이머

const MAX_DIGITS = 15;     // 숫자 하나에 입력할 수 있는 최대 자릿수 (소수점 제외)

const screen = document.getElementById('display');
const onOffButton = document.querySelector('.on-off');
const buttons = document.querySelectorAll('button');

const isOperator = (char) => char === '+' || char === '-' || char === '*' || char === '/';



// 화면과 상태 관리

// 화면에 보일 계산식 만들기
function expressionText() {
    if (hasError) return 'Error';

    let text = tokens.join(' ');
    if (current !== '') {
        text = text === '' ? current : text + ' ' + current;
    }
    return text;
}

// 화면 갱신: 전원이 꺼져 있으면 빈 화면, 식이 길면 끝부분이 보이도록 스크롤
function render() {
    screen.value = isOn ? (expressionText() || '0') : '';
    screen.scrollLeft = screen.scrollWidth;
}

// 계산기를 처음 상태로 되돌리기
function resetAll() {
    tokens = [];
    current = '';
    justEvaluated = false;
    hasError = false;
    hasDot = false;
    errorMessage = '';
    clearTimeout(errorTimer);
    errorTimer = null;
}

// 오류 표시: "Error"를 1.5초 동안 보여준 뒤 자동으로 지운다
function showError(message) {
    errorMessage = message;
    console.log('⚠️ ' + message);
    hasError = true;
    render();

    clearTimeout(errorTimer);
    errorTimer = setTimeout(() => {
        if (hasError) {
            resetAll();
            render();
        }
    }, 1500);
}



// 계산 로직 (day2)

// 토큰 배열 → 계산 결과 (잘못되면 null, 오류 내용은 errorMessage에 저장)
function calculate(parts) {
    const terms = [parts[0]];   // 마지막에 더할 값들

    for (let i = 1; i < parts.length; i += 2) {
        const operator = parts[i];
        const number = parts[i + 1];
        const last = terms.length - 1;

        if (operator === '*') {
            terms[last] = terms[last] * number;
        } else if (operator === '/') {
            if (number === 0) {
                errorMessage = '0으로 나눌 수 없습니다.';
                return null;
            }
            terms[last] = terms[last] / number;
        } else if (operator === '+') {
            terms.push(number);
        } else {
            terms.push(-number);   // 빼기는 "음수를 더하기"로 저장
        }
    }

    let sum = 0;
    for (const term of terms) {
        sum += term;
    }

    // 0.1 + 0.2 = 0.30000000000000004 같은 소수점 오차 정리
    const rounded = Math.round(sum * 1e10) / 1e10;

    // 너무 큰 수는 Infinity, 계산이 안 되면 NaN이 된다
    if (!Number.isFinite(rounded)) {
        errorMessage = '계산 범위를 넘었습니다.';
        return null;
    }
    return rounded;
}

// 숫자 글자 수 세기 (소수점과 음수 부호는 제외)
function countDigits(text) {
    let count = 0;
    for (const char of text) {
        if (char >= '0' && char <= '9') count++;
    }
    return count;
}




// 버튼으로 들어오는 입력 처리

function togglePower() {
    isOn = !isOn;
    onOffButton.className = isOn ? 'on-off on' : 'on-off';
    resetAll();
    render();
}

function clearDisplay() {
    if (!isOn) return;
    resetAll();
    render();
}

function appendNumber(digit) {
    if (!isOn) return;
    if (hasError || justEvaluated) resetAll();   // 오류 뒤나 계산 직후의 숫자는 새로 시작

    if (digit !== '.' && countDigits(current) >= MAX_DIGITS) {
        console.log(`⚠️ 숫자는 최대 ${MAX_DIGITS}자리까지 입력할 수 있습니다.`);
        return;
    }

    if (digit === '.') {
        if (hasDot) return;                      // 소수점은 한 숫자에 한 번만
        hasDot = true;
        if (current === '' || current === '-') {
            current += '0';                     
        }
        current += '.';
    } else if (current === '0') {
        current = digit;                         // 0 다음 숫자는 0을 지운다 (05 → 5)
    } else if (current === '-0') {
        current = '-' + digit;
    } else {
        current += digit;
    }
    render();
}

function appendOperator(op) {
    if (!isOn) return;
    if (hasError) resetAll();
    justEvaluated = false;                       // 계산 결과에 이어서 계산한다

    // 음수 부호 '-'만 입력된 상태에서는 연산자를 받지 않는다
    if (current === '-') return;

    if (current !== '') {
        // 입력 중인 숫자를 확정하고 연산자를 붙인다
        tokens.push(Number(current));
        tokens.push(op);
        current = '';
        hasDot = false;
    } else if (tokens.length === 0) {
        // 식의 맨 앞에는 음수 부호 '-'만 올 수 있다
        if (op === '-') current = '-';
    } else if (isOperator(tokens[tokens.length - 1])) {
        // 연산자 연속 입력: 마지막 연산자를 교체하고, '-'는 음수 부호로 쓴다
        if (op === '-') {
            current = '-';
        } else {
            tokens[tokens.length - 1] = op;
        }
    } else {
        tokens.push(op);                         // 숫자 뒤에 연산자
    }
    render();
}

function performCalculate() {
    if (!isOn || hasError || justEvaluated) return;

    // 아직 확정되지 않은 숫자까지 포함해서 계산
    if (current === '-') return;                 // 음수 부호만 있으면 무시
    const parts = tokens.slice();
    if (current !== '') {
        parts.push(Number(current));
    }
    if (parts.length === 0) return;              // 아무것도 입력하지 않았으면 무시

    if (isOperator(parts[parts.length - 1])) {
        showError('계산식이 연산자로 끝났습니다.');
        return;
    }

    const result = calculate(parts);
    if (result === null) {
        showError(errorMessage);
        return;
    }

    // 결과를 새 토큰으로 두면, 다음 연산자는 이 결과에 이어서 계산된다
    tokens = [result];
    current = '';
    hasDot = false;
    justEvaluated = true;
    render();
}

// 버튼 글자 또는 키보드 키를 받아서 알맞은 함수 실행
function handleInput(label) {
    if (label === 'ON/OFF') {
        togglePower();
    } else if (label === 'C') {
        clearDisplay();
    } else if (label === 'Enter' || label === '=') {
        performCalculate();
    } else if (isOperator(label)) {
        appendOperator(label);
    } else {
        appendNumber(label);
    }
}

// 버튼 클릭
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        handleInput(btn.textContent.trim());
    });
});

// 키보드 입력: 숫자, 소수점, 사칙연산 기호, Enter, Esc(C)
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key === 'Enter' || key === '=') {
        event.preventDefault();                  // 포커스된 버튼이 다시 눌리는 것 방지
        performCalculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '/') {
        event.preventDefault();                  // 브라우저의 빠른 찾기 방지
        appendOperator(key);
    } else if (isOperator(key)) {
        appendOperator(key);
    } else if (key.length === 1 && ((key >= '0' && key <= '9') || key === '.')) {
        appendNumber(key);
    }
});

render();
