// Fetch 
// 서버에 HTTP 요청을 보낼 수 있도록 도와주는 API

// 비동기 프로그래밍

// let response = fetch()
// let ... = response.json()
// console.log(data)

fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(
                {"title": "Python", "body": "Hello, Python"}
            )
        }
)
    // 응답에서 JSON만 추출
    .then(response => response.json())
    // JSON 데이터를 화면에 출력
    .then(data => console.log(data))

