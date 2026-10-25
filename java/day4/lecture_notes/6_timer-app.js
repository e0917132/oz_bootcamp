const timeInput = document.querySelector("#time-input")
const startBtn = document.querySelector("#start-timer")
const stopBTn = document.querySelector("#stop-timer")
const display = document.querySelector("#timer-display")

let intervalId = null;

// 97초 -> 01:37
function updateDisplay() {
    const min = Math.floor(remainingSeconds / 60)
    const sec = remainingSeconds % 60;

    display.className = "fs-3";
    display.textContent = 
    String(min).padStart(2,"0") + ":" +
    String(sec).padStart(2,"0")
}

// 시작 버튼이 눌리면, 타이머 시작
startBtn.addEventListener("click", () => {
    const minutes = Number(timeInput.value)
    timeInput.value = "";
    if (minutes <= 0) {
        alert("1 이상의 시간(분)을 입력하세요.");
        timeInput.value = "";
        return
    }

    startBtn.textContent = "재시작";
    // 10:00 의 형식으로 나오게 하는 코드
    remainingSeconds = minutes * 60;
    updateDisplay();

    intervalId = setInterval(
        () => {
            remainingSeconds--;
            updateDisplay()
        },
        1000
    )
})

// 중지 버튼이 눌렸을 때, 타이머 멈추기
stopBTn.addEventListener("click", () => {
    clearInterval(intervalId);
})