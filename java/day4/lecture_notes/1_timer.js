// setTimeout
// 일정 시간이 지난 후에 다른 함수를 실행하는 함수.
// 예) 15분 뒤 자동 로그아웃

// setTimeout(
//     () => console.log("3초 경과"),
//     3000    // 3000ms = 3s
// )


// setInterval
// 일정 시간마다 반복적으로 다른 함수를 실행
setInterval(
    () => console.log("3초 경과"),
    3000
)