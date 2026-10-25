# JavaScript_day3

> 이번 글에서는 **브라우저에 데이터를 저장**하고(Storage), **서버와 통신**하는 법(Fetch)을 정리한다. 마지막으로 지금까지 배운 것을 모두 모아 **To-do 앱**을 만든다.
> 

이번 글에서 다루는 내용

1. Storage API — localStorage / sessionStorage
2. JSON — 객체를 문자열로, 문자열을 객체로
3. 실습: 새로고침해도 남는 입력값
4. 비동기(Asynchronous)란?
5. Fetch API — GET / POST
6. 실습: 서버 데이터를 화면에 그리기
7. 최종 실습: To-do 앱

---

## **1. Storage API**

> 브라우저가 제공하는 **클라이언트 측 저장소** (Web API) 서버 없이도 데이터를 **브라우저에 저장하고 조회**할 수 있다.
> 

**특징**

- **키(key) / 값(value)** 형태로 저장한다.
- 값은 **문자열(string)로만** 저장된다.
- **페이지를 새로고침해도 유지**된다.

지금까지 만든 페이지는 새로고침하면 입력한 내용이 전부 사라졌다. JS 변수는 **페이지가 살아 있는 동안만** 메모리에 있기 때문이다. Storage에 넣어 두면 새로고침해도 다시 꺼내 쓸 수 있다.

```
           새로고침 전                       새로고침 후
┌─────────────────────────┐      ┌─────────────────────────┐
│ JS 변수 let name="Alex"  │  ──▶ │ JS 변수  → 사라짐 ❌       │
│                         │      │                         │
│ localStorage            │  ──▶ │ localStorage            │
│   name: "Alex"          │      │   name: "Alex"  → 남음 ⭕ │
└─────────────────────────┘      └─────────────────────────┘
```

### **1-1. localStorage — 영구 저장**

- 브라우저를 **껐다 켜도 남아 있다.**
- **만료 시간이 없다.** (직접 지우기 전까지 계속 남음)
- 설정값(다크 모드, 언어), 장바구니, 최근 검색어 등에 사용한다.

```jsx
localStorage.setItem("name", "Alex");   // 저장 (key, value)
localStorage.getItem("name");           // 조회 → "Alex"
localStorage.removeItem("name");        // 하나 삭제
localStorage.clear();                   // 전부 삭제
```

| **메서드** | **하는 일** | **없는 key를 조회하면** |
| --- | --- | --- |
| `setItem(key, value)` | 저장 (같은 key면 덮어씀) | — |
| `getItem(key)` | 조회 | **`null`** |
| `removeItem(key)` | 하나 삭제 | — |
| `clear()` | 전부 삭제 | — |

> 💡 **저장된 값 눈으로 확인하기** 개발자 도구 → **Application 탭**(Safari는 저장 공간 탭) → Storage → Local Storage → 사이트 주소 표 형태로 key/value가 보이고, 직접 수정·삭제도 할 수 있다.
> 

> ⚠️ **교안에 "로그인 정보 저장에 사용"이라고 되어 있지만, 비밀번호 같은 민감한 정보는 절대 넣으면 안 된다.** localStorage는 **암호화되지 않고**, 그 페이지에서 실행되는 **모든 JS가 읽을 수 있다.** 실무에서 로그인 상태는 보통 서버가 관리하는 쿠키 등으로 처리한다.
> 

> 💡 저장 공간은 사이트(도메인)마다 따로이고, 보통 **약 5MB** 정도다. 다른 사이트의 localStorage는 읽을 수 없다.
> 

### **1-2. sessionStorage — 탭 단위 임시 저장**

- **브라우저 탭을 닫으면 삭제**된다. (새로고침은 유지)
- **같은 사이트라도 탭마다 별도**다.
- 작성 중인 글 임시 저장, 한 번만 보여줄 안내 등 임시 데이터에 사용한다.

```jsx
sessionStorage.setItem("name", "Alex");
sessionStorage.getItem("name");
sessionStorage.removeItem("name");
sessionStorage.clear();
```

메서드는 localStorage와 **완전히 같고**, 이름과 유지 기간만 다르다.

### **1-3. localStorage vs sessionStorage**

|  | **localStorage** | **sessionStorage** |
| --- | --- | --- |
| 새로고침 | 유지 | 유지 |
| 탭 닫기 | **유지** | **삭제** |
| 브라우저 껐다 켜기 | **유지** | 삭제 |
| 다른 탭과 공유 | 같은 사이트면 **공유** | 탭마다 **별도** |
| 용도 | 설정값, 장바구니 | 임시 데이터 |

```
            같은 사이트(example.com)를 탭 2개로 열었을 때

     ┌──── 탭 A ────┐           ┌──── 탭 B ────┐
     │ session: {a} │           │ session: {b} │   ← 탭마다 따로
     └──────┬───────┘           └──────┬───────┘
            └────────────┬─────────────┘
                 ┌───────┴────────┐
                 │ local: {공통}   │                ← 같은 사이트면 공유
                 └────────────────┘
```

---

## **2. JSON — 객체를 저장하는 방법**

### **2-1. 문제: Storage는 문자열만 저장한다**

```jsx
const user= { name: "Alex", age: 20 };

localStorage.setItem("user", user);
localStorage.getItem("user");   // "[object Object]"  ← 내용이 다 날아감 ❌

localStorage.setItem("count", 1);
localStorage.getItem("count");  // "1"  ← 숫자가 아니라 문자열
```

객체를 그냥 넣으면 `"[object Object]"`라는 의미 없는 글자로 바뀐다. 숫자도 문자열이 된다.

### **2-2. 해결: JSON으로 변환**

> **JSON**(JavaScript Object Notation) = 객체·배열을 **문자열로 표현하는 약속된 형식** 브라우저와 서버가 데이터를 주고받을 때도 이 형식을 쓴다.
> 

```jsx
const user= { name: "Alex", age: 20 };

// 저장: 객체 → 문자열
localStorage.setItem("user", JSON.stringify(user));

// 조회: 문자열 → 객체
const savedUser= JSON.parse(localStorage.getItem("user"));
console.log(savedUser.name);   // "Alex"
```

```
        JSON.stringify()                         JSON.parse()
객체 ───────────────────▶ 문자열 ── 저장/전송 ──▶ 문자열 ───────────────────▶ 객체
{ name: "Alex" }        '{"name":"Alex"}'   '{"name":"Alex"}'   { name: "Alex" }
 (JS가 다루는 값)          (저장·전송 가능)                         (다시 . 으로 접근 가능)
```

| **메서드** | **방향** | **용도** |
| --- | --- | --- |
| `JSON.stringify(값)` | 객체/배열 → **문자열** | 저장하기 전, 서버에 보내기 전 |
| `JSON.parse(문자열)` | 문자열 → **객체/배열** | 꺼낸 뒤, 서버에서 받은 뒤 |

> 💡 **JSON 문법 규칙** — JS 객체와 비슷하지만 더 엄격하다.
> 
> - key는 반드시 **큰따옴표** `"name"` (작은따옴표 ❌, 따옴표 생략 ❌)
> - 함수, `undefined`는 담을 수 없다.
> - 마지막 항목 뒤에 쉼표 ❌

> 💡 **저장된 값이 없을 때의 기본값** `getItem`은 값이 없으면 `null`을 주고, `JSON.parse(null)`도 `null`이다. 그래서 `||`로 기본값을 정해두면 편하다.
> 
> 
> ```jsx
> const todos= JSON.parse(localStorage.getItem("todos")) || [];   // 없으면 빈 배열
> ```
> 

> 💡 `JSON.stringify(data, null, 2)`의 세 번째 값 `2`는 **들여쓰기 칸 수**다. 사람이 읽기 좋게 줄바꿈과 들여쓰기를 넣어준다. (두 번째 `null`은 "모든 속성 포함"이라는 뜻)
> 

---

## **3. 실습: 새로고침해도 남는 입력값**

> 저장한 값이 새로고침해도 유지되도록 만들기
> 

```jsx
<input id="name" placeholder="이름 입력" />
<button id="save">저장</button>
<p id="result"></p>
```

```jsx
const input= document.querySelector("#name");
const button= document.querySelector("#save");
const result= document.querySelector("#result");

// ① 페이지가 열리면: 저장된 값이 있는지 먼저 확인
const savedName= localStorage.getItem("name");
if (savedName) {                 // 값이 없으면 null(falsy) → 실행 안 함
  result.textContent= savedName;
}

// ② 버튼을 누르면: 저장 + 화면 표시
button.addEventListener("click", function () {
  localStorage.setItem("name", input.value);
  result.textContent= input.value;
});
```

**흐름**

```
[페이지 열림] ──▶ getItem("name") ──┬── 값 있음 → 화면에 표시
                                 └── null    → 아무것도 안 함

[저장 클릭]   ──▶ setItem("name", 입력값) ──▶ 화면에 표시

[새로고침]    ──▶ 다시 [페이지 열림]부터 → 저장해 둔 값이 바로 보임 ✅
```

> 💡 **한 단계 더:** 빈 칸으로 저장하는 것을 막고, 저장 후 입력창을 비우면 더 자연스럽다.
> 
> 
> ```jsx
> button.addEventListener("click", function () {
>   const name= input.value.trim();
>   if (name=== "") {
>     alert("이름을 입력하세요");
>     return;
>   }
>   localStorage.setItem("name", name);
>   result.textContent= name;
>   input.value= "";
> });
> ```
> 

---

## **4. 비동기(Asynchronous)**

### **4-1. 동기 vs 비동기**

> **비동기** = 오래 걸리는 작업을 **기다리지 않고, 다음 코드를 먼저 실행**하는 방식
> 

> ⚠️ 비동기는 일시정지하지 **않는다.** 기다리는 동안 멈추는 쪽이 **동기**다.
> 

|  | **동기 (Synchronous)** | **비동기 (Asynchronous)** |
| --- | --- | --- |
| 방식 | 한 작업이 **끝나야** 다음 작업 | 작업을 **맡겨 두고** 바로 다음 작업 |
| 기다리는 동안 | **멈춤** (화면도 굳음) | 다른 일 계속 (화면 정상) |
| 비유 | 전화 주문 — 통화 끝날 때까지 아무것도 못 함 | 진동벨 — 주문하고 자리에서 다른 일, 벨 울리면 받으러 감 |
| 예 | `console.log`, 계산, `for`문 | `setTimeout`, **`fetch`**, 이벤트 |

```
동기: 서버 요청이 끝날 때까지 전부 멈춤
──[요청 보냄]━━━━━━━━━ 기다림 (멈춤) ━━━━━━━━━[응답 처리]──[다음 코드]──▶

비동기: 요청은 맡겨 두고 다음 코드 먼저
──[요청 보냄]──[다음 코드]──[다른 코드]── … ──[응답 처리]──▶
        └────────── 서버가 일하는 중 ──────────┘  ↑ 응답 오면 그때 실행
```

서버 요청은 네트워크를 거쳐서 **몇백 ms ~ 몇 초**가 걸린다. 그동안 화면이 멈추면 안 되므로, `fetch`는 **요청만 보내 두고 다른 작업을 계속 진행**하다가 **응답이 오면 그때 결과를 처리**한다.

> 💡 지난 글에서 본 `setTimeout(fn, 0)`이 `1 → 3 → 2` 순서로 실행된 것과 같은 원리다.
> 

---

## **5. Fetch API**

> 브라우저가 제공하는 **서버 통신용** Web API HTTP **요청(Request)** 을 보내고 **응답(Response)** 을 받는다. **비동기로 동작**한다.
> 

```
  브라우저 (클라이언트)                                서버
 ┌──────────────────┐   ① 요청 (Request)          ┌──────────┐
 │ fetch(url)       │ ──────────────────────────▶ │          │
 │                  │   GET /posts                │  데이터    │
 │                  │                             │  처리      │
 │ .then(...)       │ ◀────────────────────────── │          │
 └──────────────────┘   ② 응답 (Response)          └──────────┘
                         상태 코드 200 + JSON 데이터
```

### **5-1. 💡 HTTP 기초 복기: 메서드와 상태 코드**

**메서드** — 요청의 목적

| **메서드** | **의미** | **예** |
| --- | --- | --- |
| **GET** | 조회 | 게시글 목록 가져오기 |
| **POST** | 생성 | 새 게시글 쓰기, 회원가입 |
| PUT / PATCH | 수정 (전체 / 일부) | 게시글 수정 |
| DELETE | 삭제 | 게시글 삭제 |

**상태 코드** — 응답 결과

| **코드** | **의미** |
| --- | --- |
| **200** OK / **201** Created | 성공 / 생성 성공 |
| **400** Bad Request | 요청이 잘못됨 |
| **401** / **403** | 로그인 필요 / 권한 없음 |
| **404** Not Found | 주소에 해당하는 데이터 없음 |
| **500** Server Error | 서버 내부 오류 |

> 💡 실습에 쓰는 **JSONPlaceholder**(`jsonplaceholder.typicode.com`)는 연습용 가짜 API 서버다. 게시글(posts), 할 일(todos) 등 샘플 데이터를 JSON으로 돌려준다.
> 

### **5-2. 기본 사용법 (GET)**

```jsx
fetch("https://jsonplaceholder.typicode.com/posts")
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
```

| **단계** | **코드** | **의미** |
| --- | --- | --- |
| 1 | `fetch(url)` | 요청 보냄 |
| 2 | `response` | 서버의 응답 (아직 "포장된 상자" 상태) |
| 3 | `response.json()` | 응답 본문을 JSON으로 해석 (**이것도 비동기**) |
| 4 | `data` | 실제 데이터 (배열·객체) |

```
fetch(url) ──▶ (기다림) ──▶ response ──▶ .json() ──▶ (기다림) ──▶ data
                              📦 상자                              📄 내용물
           .then(response => response.json())    .then(data => { ... })
```

`.then()`은 **"앞 작업이 끝나면 그 결과로 이걸 실행해"** 라는 뜻이다. 결과가 다음 `.then`으로 차례로 넘어간다.

> 💡 **Promise** — `fetch()`는 데이터를 바로 주지 않고 **"나중에 결과를 주겠다는 약속(Promise)"** 을 돌려준다. `.then()`은 약속이 지켜졌을 때(성공) 실행할 함수를 등록하는 것이다.
> 
> 
> ```
> Promise 상태:  대기(pending) ──┬──▶ 성공(fulfilled) → .then() 실행
>                               └──▶ 실패(rejected)  → .catch() 실행
> ```
> 

### **5-3. 💡 에러 처리 — .catch()와 response.ok**

교안 코드에는 에러 처리가 없다. 인터넷이 끊기거나 주소가 틀리면 아무 반응 없이 끝나버린다.

```jsx
fetch("https://jsonplaceholder.typicode.com/posts")
  .then(response => {
    if (!response.ok) {                        // 200번대가 아니면
      throw new Error(`HTTP${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {                            // 위 어디서든 문제가 생기면 여기로
    console.log("요청 실패:", error.message);
  });
```

> ⚠️ **fetch는 404, 500 같은 에러 응답에도 `.catch()`로 가지 않는다.** 서버가 "응답"은 했기 때문이다. `.catch()`는 **네트워크 자체가 실패**했을 때만 실행된다. 그래서 `response.ok`(상태 코드 200~299면 `true`)를 직접 확인해야 한다.
> 

### **5-4. 💡 async / await — 더 읽기 쉬운 방식**

`.then()`을 이어 쓰는 대신 **위에서 아래로 읽히는** 문법이다. 실무에서는 이쪽을 더 많이 쓴다.

```jsx
async function loadPosts() {
  try {
    const response= await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw new Error(`HTTP${response.status}`);
    const data= await response.json();
    console.log(data);
  } catch (error) {
    console.log("요청 실패:", error.message);
  }
}

loadPosts();
```

| **`.then()` 방식** | **`async/await` 방식** |
| --- | --- |
| `fetch(url).then(res => ...)` | `const res = await fetch(url);` |
| `.then(data => ...)` | `const data = await res.json();` |
| `.catch(err => ...)` | `try { ... } catch (err) { ... }` |
- `await` = "이 비동기 작업이 끝날 때까지 **이 함수 안에서만** 기다려라" (페이지 전체가 멈추는 건 아님)
- `await`는 **`async`가 붙은 함수 안에서만** 쓸 수 있다.

---

## **6. 실습: 서버 데이터를 화면에 그리기 (GET + DOM)**

> 버튼을 누르면 posts 5개의 title을 목록으로 보여주기
> 

```jsx
<button id="load">불러오기</button>
<ul id="list"></ul>
```

```jsx
const button= document.querySelector("#load");
const list= document.querySelector("#list");

button.addEventListener("click", function () {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(res => res.json())
    .then(posts => {
      list.innerHTML= "";                      // 이전 목록 비우기

      for (const postof posts.slice(0, 5)) {   // 100개 중 앞에서 5개만
        const li= document.createElement("li");
        li.textContent= post.title;
        list.appendChild(li);
      }
    });
});
```

**받아오는 데이터 모양**

```jsx
[
  { userId: 1, id: 1, title: "sunt aut facere ...", body: "quia et suscipit ..." },
  { userId: 1, id: 2, title: "qui est esse", body: "est rerum tempore ..." },
  …(총100개)
]
```

`posts`는 **객체들의 배열**이다. 그래서 지난 글에서 배운 `slice(0, 5)`로 앞 5개를 자르고, `for...of`로 하나씩 꺼내 `post.title`에 접근한다.

```
[클릭] → fetch(posts) → res.json() → posts(100개 배열)
                                         │ slice(0, 5)
                                         ▼
                                   5개 → for...of → createElement("li")
                                                  → li.textContent = title
                                                  → list.appendChild(li) → 화면
```

> 💡 **로딩 표시 추가하기** — 응답이 오기 전까지 빈 화면이면 사용자가 버튼이 고장난 줄 안다.
> 
> 
> ```jsx
> button.addEventListener("click", function () {
>   list.innerHTML= "<li>불러오는 중...</li>";
>   button.disabled= true;
> 
>   fetch("https://jsonplaceholder.typicode.com/posts")
>     .then(res => res.json())
>     .then(posts => {
>       list.innerHTML= "";
>       for (const postof posts.slice(0, 5)) {
>         const li= document.createElement("li");
>         li.textContent= post.title;
>         list.appendChild(li);
>       }
>     })
>     .catch(() => {
>       list.innerHTML= "<li>불러오기에 실패했습니다.</li>";
>     })
>     .finally(() => {
>       button.disabled= false;   // 성공이든 실패든 버튼 다시 활성화
>     });
> });
> ```
> 

> 💡 처음부터 5개만 받고 싶다면 서버에 요청할 때 `?_limit=5`를 붙인다: `fetch(".../posts?_limit=5")` (JSONPlaceholder가 지원하는 기능)
> 

---

## **7. POST 요청 — 서버로 데이터 보내기**

```jsx
<input type="email" id="email">
<button id="send">전송</button>
<pre id="result"></pre>
```

```jsx
const input= document.querySelector("#email");
const button= document.querySelector("#send");
const result= document.querySelector("#result");

button.addEventListener("click", function () {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",                                     // ① 요청 종류
    headers: { "Content-Type": "application/json" },    // ② 보내는 데이터 형식
    body: JSON.stringify({ email: input.value}),       // ③ 보낼 데이터 (문자열로!)
  })
    .then(res => res.json())
    .then(data => {
      result.textContent= JSON.stringify(data, null, 2);   // 2 → 들여쓰기 (가독성)
    });
});
```

**GET과 무엇이 다른가**

|  | **GET** | **POST** |
| --- | --- | --- |
| 두 번째 인자 | 생략 (기본값 GET) | `{ method, headers, body }` 객체 |
| 데이터 위치 | 주소(URL)에 붙음 | **body**에 담김 |
| body | 없음 | `JSON.stringify()`로 **문자열 변환 필수** |

```
요청 (Request)                                       응답 (Response, 201 Created)
┌──────────────────────────────────────┐            ┌──────────────────────┐
│ POST /posts                          │            │ {                    │
│ Content-Type: application/json  ← 헤더 │  ───────▶  │   "email": "a@b.com",│
│                                      │            │   "id": 101          │
│ {"email":"a@b.com"}             ← 바디 │            │ }                    │
└──────────────────────────────────────┘            └──────────────────────┘
```

- `headers`의 `Content-Type`은 서버에 **"보내는 내용이 JSON이에요"** 라고 알려주는 이름표다.
- `<pre>` 태그는 줄바꿈과 공백을 그대로 보여줘서 `JSON.stringify(data, null, 2)`로 정리한 결과가 보기 좋게 표시된다.

> 💡 JSONPlaceholder는 연습용이라 POST를 보내면 `id: 101`을 붙여 **저장된 것처럼 응답만** 해주고, 실제로 저장하지는 않는다. 다시 GET해 봐도 101번 글은 없다.
> 

---

## **8. 최종 실습: To-do 앱 만들기**

> 지금까지 배운 내용을 모두 써서 직접 완성해 본다.
> 

**기능**

1. 할 일 입력 후 **추가** (버튼 클릭 또는 Enter)
2. 체크박스로 **완료 표시** (취소선)
3. **삭제** 버튼
4. 남은 할 일 개수 표시
5. **새로고침해도 목록 유지** (localStorage)
6. (응용) **샘플 할 일 불러오기** (fetch)

### **8-1. 설계: 데이터와 화면을 분리한다**

To-do 앱의 핵심 아이디어는 **"데이터(배열)가 진짜고, 화면은 데이터를 그린 결과일 뿐"** 이라는 것이다.

```
               ┌──────────────── 사용자 행동 ────────────────┐
               │  추가(submit)   완료 체크(change)   삭제(click) │
               └──────────────────────┬──────────────────────┘
                                      ▼
                     ① 데이터 변경: todos 배열 수정
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
              ② saveTodos()                 ③ render()
              localStorage에 저장            배열을 보고 화면을 처음부터 다시 그림
              (JSON.stringify)

  [페이지 열림] → localStorage에서 불러오기(JSON.parse) → render()
```

화면(DOM)을 직접 이리저리 고치지 않고, **항상 ① 배열 수정 → ② 저장 → ③ 다시 그리기** 순서만 지키면 버그가 훨씬 적다.

**할 일 하나의 데이터 모양**

```
{ id: 1729840000000, text: "장보기", done: false }
//  고유 번호(삭제·체크할 때 구분용)   내용        완료 여부
```

`id`는 `Date.now()`(현재 시각을 밀리초 숫자로)로 만든다. 같은 내용의 할 일이 두 개 있어도 구분할 수 있다.

### **8-2. HTML**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>To-do</title>
  <style>
    body { font-family: sans-serif; max-width: 480px; margin: 40px auto; padding: 0 16px; }
    #todo-form { display: flex; gap: 8px; }
    #todo-input { flex: 1; padding: 8px; }
    #todo-list { list-style: none; padding: 0; }
    #todo-list li { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid#eee; }
    #todo-list li span { flex: 1; }
    #todo-list li.done span { text-decoration: line-through; color: #aaa; }
  </style>
</head>
<body>
  <h1>To-do</h1>

  <form id="todo-form">
    <input id="todo-input" placeholder="할 일을 입력하세요" autocomplete="off">
    <button type="submit">추가</button>
  </form>

  <ul id="todo-list"></ul>
  <p id="todo-count"></p>
  <button id="load-sample">샘플 할 일 불러오기</button>

  <script src="todo.js"></script>
</body>
</html>
```

> 💡 입력창과 버튼을 `<form>`으로 감싸면 **Enter를 눌러도 제출(submit)** 된다. `keydown`으로 Enter를 따로 검사할 필요가 없다.
> 

### **8-3. JavaScript (todo.js)**

```jsx
const form= document.querySelector("#todo-form");
const input= document.querySelector("#todo-input");
const list= document.querySelector("#todo-list");
const count= document.querySelector("#todo-count");
const sampleButton= document.querySelector("#load-sample");

const STORAGE_KEY= "todos";

// ① 저장된 목록 불러오기 (없으면 빈 배열)
let todos= JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ② localStorage에 저장
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// ③ todos 배열을 보고 화면을 처음부터 다시 그리기
function render() {
  list.innerHTML= "";

  for (const todoof todos) {
    const li= document.createElement("li");
    if (todo.done) {
      li.classList.add("done");
    }

    const checkbox= document.createElement("input");
    checkbox.type= "checkbox";
    checkbox.checked= todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const span= document.createElement("span");
    span.textContent= todo.text;   // 사용자 입력 → 반드시 textContent

    const deleteButton= document.createElement("button");
    deleteButton.textContent= "삭제";
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);
    list.appendChild(li);
  }

  // 남은 개수 세기
  let left= 0;
  for (const todoof todos) {
    if (!todo.done) {
      left++;
    }
  }
  count.textContent= `남은 할 일${left}개 / 전체${todos.length}개`;
}

// 추가
function addTodo(text) {
  todos.push({ id: Date.now(), text: text, done: false });
  saveTodos();
  render();
}

// 완료 ↔ 미완료
function toggleTodo(id) {
  for (const todoof todos) {
    if (todo.id=== id) {
      todo.done= !todo.done;
    }
  }
  saveTodos();
  render();
}

// 삭제: 해당 id만 빼고 새 배열로
function deleteTodo(id) {
  todos= todos.filter(todo => todo.id!== id);
  saveTodos();
  render();
}

// 입력 → 추가 (버튼 클릭 또는 Enter)
form.addEventListener("submit", (event) => {
  event.preventDefault();          // form 제출 시 페이지 새로고침 막기

  const text= input.value.trim();
  if (text=== "") {
    return;
  }

  addTodo(text);
  input.value= "";
  input.focus();                   // 연속 입력하기 편하게
});

// (응용) 서버에서 샘플 할 일 5개 받아와서 추가
sampleButton.addEventListener("click", () => {
  sampleButton.disabled= true;

  fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
    .then(res => {
      if (!res.ok) throw new Error(`HTTP${res.status}`);
      return res.json();
    })
    .then(samples => {
      for (const sampleof samples) {
        todos.push({
          id: Date.now() + sample.id,   // 서버 id와 겹치지 않게
          text: sample.title,
          done: sample.completed,
        });
      }
      saveTodos();
      render();
    })
    .catch(error => {
      alert("불러오기 실패: " + error.message);
    })
    .finally(() => {
      sampleButton.disabled= false;
    });
});

// 페이지가 열리면 저장된 목록 그리기
render();
```

### **8-4. 코드 포인트**

| **코드** | **이유** |
| --- | --- |
| `JSON.parse(...) || []` | 처음 방문해서 저장된 값이 없으면(`null`) 빈 배열로 시작 |
| `event.preventDefault()` | `<form>`은 제출하면 페이지를 새로고침하는 게 기본 동작이라 막아야 함 |
| `span.textContent = todo.text` | 사용자 입력은 `innerHTML`이 아니라 `textContent`로 (XSS 방지) |
| `() => toggleTodo(todo.id)` | 인자(id)를 넘겨야 하니 화살표 함수로 감쌈 (괄호 바로 쓰면 즉시 실행됨) |
| `todos.filter(todo => todo.id !== id)` | 💡 `filter` = 조건이 `true`인 요소만 모아 **새 배열**을 만드는 배열 메서드. "이 id가 아닌 것만 남기기" = 삭제 |
| `saveTodos(); render();` | 데이터를 바꿀 때마다 항상 **저장 → 다시 그리기** 짝으로 호출 |

**지금까지 배운 것이 어디에 쓰였나**

| **배운 것** | **To-do 앱에서** |
| --- | --- |
| 변수 `const` / `let`, 배열, 객체 | `todos` 배열, 할 일 객체 `{id, text, done}` |
| `if`, `for...of`, `!` | 완료 여부 확인, 남은 개수 세기, 체크 뒤집기 |
| 함수, 화살표 함수 | `addTodo`, `toggleTodo`, `deleteTodo`, `render` |
| DOM 선택·생성·변경 | `querySelector`, `createElement`, `appendChild`, `classList` |
| 이벤트 | `submit`, `change`, `click`, `preventDefault` |
| Storage + JSON | `localStorage` + `stringify` / `parse` |
| Fetch + 비동기 | 샘플 할 일 불러오기, `.then` / `.catch` / `.finally` |

> 💡 **더 해볼 만한 기능**: 할 일 수정(더블클릭), "완료 항목 모두 삭제" 버튼, 전체 / 진행 중 / 완료 필터 탭
> 

---

## **마무리 요약**

| **주제** | **핵심** |
| --- | --- |
| localStorage | 영구 저장, 탭·브라우저를 닫아도 유지. `setItem` / `getItem` / `removeItem` / `clear` |
| sessionStorage | 탭을 닫으면 삭제, 탭마다 별도. 메서드는 동일 |
| JSON | Storage·서버는 문자열만 → 저장/전송 전 `JSON.stringify`, 꺼낸 뒤 `JSON.parse` |
| 비동기 | 기다리지 않고 다음 코드 먼저 실행 (일시정지 ❌). 응답이 오면 그때 처리 |
| fetch (GET) | `fetch(url).then(res => res.json()).then(data => ...)` |
| fetch (POST) | `{ method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(...) }` |
| 에러 처리 | `.catch()` + `response.ok` 확인 (404·500은 catch로 안 감) |
| async/await | `.then` 체인을 위에서 아래로 읽히게 쓰는 문법, `try/catch`로 에러 처리 |
| To-do 앱 | **배열 수정 → 저장 → 다시 그리기** 패턴 |

이것으로 JavaScript 기초 정리를 마친다. HTML로 구조를, CSS로 디자인을, JavaScript로 동작과 데이터를 다룰 수 있게 되었다.