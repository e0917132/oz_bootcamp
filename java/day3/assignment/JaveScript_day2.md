# JaveScript_day2

> 지난 글에서 변수·조건문·반복문·함수를 콘솔에서 연습했다면, 이번 글에서는 드디어 **JavaScript로 웹 페이지 화면을 바꾸고, 사용자 행동에 반응**하게 만든다.
> 

이번 글에서 다루는 내용

1. DOM — JavaScript가 보는 HTML
2. DOM 선택 · 내용 · 스타일 · 속성 변경
3. 이벤트와 이벤트 리스너
4. 입력값 처리와 요소 만들기
5. 화살표 함수와 호이스팅
6. 실습 6가지
7. Web API와 Timer API (setTimeout · setInterval)
8. 실습: 카운트다운 타이머

---

## **1. DOM이란?**

> **D**ocument **O**bject **M**odel - HTML 문서를 **JavaScript가 다룰 수 있게 만든 객체 구조**
> 

브라우저는 HTML 파일을 읽으면 그대로 화면에 그리는 게 아니라, 먼저 **태그 하나하나를 객체로 바꿔 나무(트리) 모양으로 연결**한다. 이것이 DOM이다.

### **1-1. 웹 페이지 = 트리 구조**

```
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1 id="text">Hello</h1>
    <ul>
      <li class="item">사과</li>
      <li class="item">바나나</li>
    </ul>
  </body>
</html>
```

위 HTML을 브라우저는 이렇게 이해한다.

```
document                     ← DOM 트리의 시작점 (JS에서 document로 접근)
└── html
    ├── head
    │   └── title
    │       └── "My Page"     ← 텍스트도 하나의 노드
    └── body
        ├── h1#text
        │   └── "Hello"
        └── ul
            ├── li.item
            │   └── "사과"
            └── li.item
                └── "바나나"
```

| **용어** | **뜻** |
| --- | --- |
| **노드(Node)** | 트리를 이루는 하나하나의 칸 (요소, 텍스트 등) |
| **요소(Element)** | 태그로 만들어진 노드 (`h1`, `ul`, `li` …) |
| **부모 / 자식 / 형제** | HTML 중첩 관계 그대로 (`ul`은 `li`의 부모, 두 `li`는 형제) |

### **1-2. JavaScript는 어떻게 화면을 바꾸나?**

- **HTML 파일을 직접 수정하는 것이 아니다.**
- 브라우저 메모리에 있는 **DOM 객체를 조작**하면, 브라우저가 그 변화를 화면에 다시 그린다.

```
┌───────────┐  읽기   ┌──────────────┐  그리기  ┌──────────┐
│ HTML 파일  │ ─────▶ │  DOM (객체)   │ ──────▶ │   화면    │
└───────────┘        └──────────────┘         └──────────┘
   (그대로)                ▲   │
                    조작   │   │ 변화 감지 → 다시 그림
                   ┌──────┴───┘
                   │ JavaScript │
                   └────────────┘
```

> 💡 그래서 JS로 글자를 바꾼 뒤 **새로고침하면 원래대로 돌아온다.** HTML 파일은 한 번도 바뀌지 않았기 때문이다. 개발자 도구 **Elements 탭**에 보이는 것은 HTML 파일이 아니라 **현재 DOM**이다. JS로 바꾸면 Elements 탭도 바로 바뀐다.
> 

---

## **2. DOM 다루기**

### **2-1. 요소 선택하기**

| **메서드** | **선택 기준** | **반환** | **없으면** |
| --- | --- | --- | --- |
| `document.getElementById("id")` | id (# 없이) | 요소 **1개** | `null` |
| `document.querySelector("선택자")` | **CSS 선택자** | 첫 번째로 매칭된 요소 **1개** | `null` |
| `document.querySelectorAll("선택자")` | **CSS 선택자** | 매칭된 요소 **전부** (NodeList) | 빈 NodeList |

**getElementById**

```
<h1 id="text">Hello</h1>
```

```
const el= document.getElementById("text");   // # 붙이지 않음!
console.log(el.textContent);          // "Hello"
console.log(el.textContent.trim());   // 앞뒤 공백 제거
```

**querySelector** — CSS에서 쓰던 선택자를 그대로 쓴다.

```
document.querySelector("#text");   // id
document.querySelector(".item");   // class → 여러 개여도 첫 번째만
document.querySelector("p");       // 태그
document.querySelector("ul > li"); // 💡 복합 선택자도 가능
```

**querySelectorAll** — 여러 개를 모두 선택한다.

```
const items= document.querySelectorAll(".item");

items.forEach(el => {
  console.log(el.textContent);   // "사과", "바나나"
});
```

> ⚠️ 가장 흔한 실수
> 
> - `getElementById("#text")` ❌ → `getElementById("text")` ⭕ (getElementById는 `#` 없음)
> - `querySelector("text")` ❌ → `querySelector("#text")` ⭕ (querySelector는 CSS처럼 `#`, `.` 필요)

> 💡 **NodeList는 배열처럼 생겼지만 배열이 아니다.** `forEach`와 `length`, `[0]`은 되지만 `map`, `filter`는 안 된다. 필요하면 `Array.from(items)`로 바꿔 쓴다.
> 

> 💡 실무에서는 선택 방법을 하나로 통일하기 좋아서 **`querySelector` / `querySelectorAll`을 주로 쓴다.**
> 

### **2-2. 내용 변경 — textContent vs innerHTML**

```
el.textContent= "Hello JavaScript";
```

| **속성** | **하는 일** | **`"<b>안녕</b>"`을 넣으면** |
| --- | --- | --- |
| `textContent` | **텍스트만** 넣음 | 화면에 `<b>안녕</b>` 글자 그대로 보임 |
| `innerHTML` | **HTML로 해석**해서 넣음 | 화면에 **굵은** "안녕"이 보임 |

> ⚠️ **사용자가 입력한 값을 `innerHTML`에 넣으면 위험하다.** 누군가 입력창에 `<img src=x onerror="악성코드">`를 넣으면 그 코드가 실행된다(XSS 공격). **사용자 입력은 항상 `textContent`로** 넣고, `innerHTML`은 내가 직접 쓴 HTML에만 쓴다. (내용을 비울 때 `innerHTML = ""`은 괜찮다.)
> 

### **2-3. 스타일 변경**

```
el.textContent= "Hello, DOM";
el.style.color= "red";
el.style.fontSize= "20px";
```

CSS 속성 이름의 `-`는 JS에서 쓸 수 없어서 **카멜 표기법(camelCase)** 으로 바꾼다.

| **CSS** | **JavaScript** |
| --- | --- |
| `color` | `style.color` |
| `font-size` | `style.fontSize` |
| `background-color` | `style.backgroundColor` |
| `border-radius` | `style.borderRadius` |

> 💡 **스타일을 여러 개 바꿀 때는 `classList`가 더 깔끔하다.** CSS에 클래스를 미리 만들어 두고 JS는 클래스만 붙였다 뗀다.
> 
> 
> ```
> .highlight { color: orange; font-size: 20px; border: 1px solid orange; }
> ```
> 
> ```
> el.classList.add("highlight");      // 붙이기
> el.classList.remove("highlight");   // 떼기
> el.classList.toggle("highlight");   // 있으면 떼고, 없으면 붙이기
> ```
> 
> 디자인은 CSS에, 동작은 JS에 두는 역할 분리가 된다. 지난번 햄버거 메뉴의 `sidebar.classList.toggle('open')`이 바로 이 방식이다.
> 

### **2-4. 속성 변경**

```
const link= document.querySelector("a");
link.href= "https://google.com";
```

| **예시** | **의미** |
| --- | --- |
| `img.src = "cat.jpg"` | 이미지 바꾸기 |
| `input.value = ""` | 입력창 비우기 |
| `input.placeholder = "이름"` | 안내 문구 |
| `button.disabled = true` | 버튼 비활성화 |

> 💡 `getAttribute("이름")` / `setAttribute("이름", "값")`으로도 읽고 쓸 수 있다.
> 

---

## **3. 이벤트(Event)**

> 웹 페이지에서 발생하는 **모든 동작이나 상태 변화** 주로 사용자의 행동으로 발생하지만, 브라우저 자체 동작도 포함한다.
> 

| **구분** | **이벤트** | **언제** |
| --- | --- | --- |
| **마우스** | `click` | 클릭 |
|  | `mouseover` / `mouseout` | 마우스를 올림 / 내림 |
|  | 💡 `dblclick` | 더블클릭 |
| **입력** | `input` | 입력값이 **바뀔 때마다** (한 글자마다) |
|  | 💡 `change` | 입력을 **마치고** 포커스가 빠질 때 |
|  | 💡 `submit` | form 제출 |
| **키보드** | `keydown` / `keyup` | 키를 누름 / 뗌 |
| **화면** | `scroll` | 스크롤 |
|  | `resize` | 창 크기 변경 |
| **문서** | `DOMContentLoaded` | HTML을 다 읽고 DOM 완성 |
|  | `load` | 이미지 등 모든 리소스까지 로드 완료 |

### **3-1. 이벤트 리스너로 처리하기**

> **이벤트 리스너(event listener)** = 이벤트를 "듣고 있다가" 발생하면 지정한 함수를 실행하는 장치
> 

```
const btn= document.querySelector("button");

btn.addEventListener("click", function () {
  console.log("클릭됨");
});
```

```
요소.addEventListener( "이벤트 이름",  실행할 함수 );
     ─────────────     ───────────    ─────────────
       누구에게?          무슨 일이?       그러면 뭘 할까?
```

**동작 흐름**

```
① 등록 (페이지 열릴 때 한 번)
   btn.addEventListener("click", 함수)
                │
                ▼
② 대기 ─ 브라우저가 btn의 click을 지켜봄
                │
         사용자가 클릭!
                ▼
③ 실행 ─ 등록해 둔 함수 실행
                │
                ▼
④ DOM 변경 → 브라우저가 화면 다시 그림
                │
                └──▶ 다시 ② 대기 (클릭할 때마다 반복)
```

### **3-2. 왜 이벤트 리스너를 쓰나?**

- 사용자의 행동을 감지해서 **상호작용(interaction)** 을 구현한다.
- **정적인 페이지 → 동적인 웹 애플리케이션**으로 바꾼다.
- 화면(UI)과 로직을 동적으로 제어한다.

### **3-3. ⚠️ 함수 전달 vs 함수 실행 (지난 글 복습)**

```
function sayHi() { console.log("hi"); }

btn.addEventListener("click", sayHi);     // ⭕ 클릭할 때 실행
btn.addEventListener("click", sayHi());   // ❌ 등록하는 순간 바로 실행되고, 클릭해도 아무 일 없음
```

지난 글 7-3에서 본 `run(sayHi)` vs `run(sayHi())`와 똑같다. **`addEventListener`에는 괄호 없이 함수 자체를 넘긴다.** 인자를 넘겨야 할 때는 화살표 함수로 한 번 감싼다 

### **3-4. 💡 이벤트 객체 (event)**

리스너 함수는 **이벤트 정보가 담긴 객체**를 첫 번째 인자로 받는다.

```
btn.addEventListener("click", function (event) {
  console.log(event.type);     // "click"
  console.log(event.target);   // 실제로 클릭된 요소
});

input.addEventListener("keydown", function (event) {
  if (event.key=== "Enter") {
    console.log("엔터 입력!");   // 엔터로 제출하기 등에 활용
  }
});
```

| **자주 쓰는 것** | **의미** |
| --- | --- |
| `event.target` | 이벤트가 발생한 요소 |
| `event.key` | 누른 키 (`"Enter"`, `"a"` …) |
| `event.preventDefault()` | 기본 동작 막기 (form 제출 시 새로고침, 링크 이동 등) |

---

## **4. 입력값 처리**

### **4-1. 입력값 읽어서 화면에 추가하기**

```
<input id="name-input" />
<button>확인</button>
```

```
const input= document.querySelector("#name-input");
const button= document.querySelector("button");

button.addEventListener("click", function () {
  const p= document.createElement("p");   // ① <p></p> 만들기 (아직 화면에 없음)
  p.textContent= input.value;             // ② <p>입력값</p>
  document.body.appendChild(p);            // ③ body 맨 끝에 붙이기 → 화면에 나타남
});
```

| **메서드** | **하는 일** |
| --- | --- |
| `input.value` | 입력창에 적힌 값 (항상 **문자열**) |
| `document.createElement("태그")` | 새 요소 만들기 (메모리에만 존재) |
| `부모.appendChild(요소)` | 부모의 **마지막 자식**으로 붙이기 → 이때 화면에 보임 |

```
createElement("p")        textContent = ...           appendChild(p)
     <p></p>       ──▶     <p>Alex</p>       ──▶      body
  (화면에 없음)            (아직 화면에 없음)           ├── input
                                                    ├── button
                                                    └── <p>Alex</p>  ← 화면에 나타남
```

> 💡 요소를 지울 때는 `요소.remove()`
> 

### **4-2. 결과 영역을 비우고 새로 쓰기**

위 코드는 클릭할 때마다 `<p>`가 계속 쌓인다. 결과를 한 줄만 보여주려면 **먼저 비우고** 추가한다.

```
<input id="name-input" />
<button>확인</button>
<div id="result"></div>
```

```
const input= document.querySelector("#name-input");
const button= document.querySelector("button");
const result= document.querySelector("#result");

function printName() {
  result.innerHTML= "";                                   // 이전 결과 지우기
  const welcomeText= "환영합니다, " + input.value+ " 님";
  const p= document.createElement("p");                   // <p></p>
  p.textContent= welcomeText;                             // <p>환영합니다, Alex 님</p>
  result.appendChild(p);
}

button.addEventListener("click", printName);
```

> 💡 교안 코드에는 `result`를 `querySelector`로 선택하는 줄이 없는데도 동작한다. 브라우저가 **id가 있는 요소를 같은 이름의 전역 변수로 자동 등록**해 주기 때문이다. 하지만 다른 변수와 이름이 겹치면 꼬이기 쉬우므로, **항상 직접 선택해서 쓰는 것이 안전하다.**
> 

### **4-3. DOM + 조건문 — 빈 입력 막기**

```
function printName() {
  if (input.value.trim() === "") {   // 공백만 입력한 경우도 걸러냄
    alert("이름을 입력하세요");
    return;                          // 함수 즉시 종료 → 아래 코드 실행 안 함
  }

  result.innerHTML= "";
  const p= document.createElement("p");
  p.textContent= "환영합니다, " + input.value.trim() + " 님";
  result.appendChild(p);
}
```

사용자 입력에 따라 **화면과 동작을 다르게** 처리한다. 지난 글의 계산기에서 쓴 **조기 종료(`return`)** 패턴과 같다.

---

## **5. 화살표 함수와 호이스팅**

### **5-1. 화살표 함수**

> 짧고 간결하게 함수를 정의하는 문법. `function` 대신 `=>`를 쓴다.
> 

```
// 일반 함수
function add(a, b) {
  return a+ b;
}

// 화살표 함수
const add = (a, b) => {
  return a+ b;
};

// 한 줄이면 { }와 return 생략 가능
const add = (a, b) => a+ b;
```

| **형태** | **예시** |
| --- | --- |
| 매개변수 없음 | `() => console.log("hi")` |
| 매개변수 1개 | `x => x * 2` (괄호 생략 가능) |
| 매개변수 여러 개 | `(a, b) => a + b` |
| 여러 줄 | `(a, b) => { const s = a + b; return s; }` |

**이벤트 리스너(콜백 함수)에 주로 쓴다.**

```
button.addEventListener("click", function () {
  console.log("클릭됨");
});

button.addEventListener("click", () => {
  console.log("클릭됨");
});

button.addEventListener("click", () => console.log("클릭됨"));
```

**인자가 필요한 함수를 리스너로 쓸 때** — 화살표 함수로 감싼다.

```
function changeBackgroundColor(color) {
  box.style.backgroundColor= color;
}

box.addEventListener("mouseover", changeBackgroundColor("skyblue"));          // ❌ 바로 실행됨
box.addEventListener("mouseover", () => changeBackgroundColor("skyblue"));    // ⭕ 마우스를 올릴 때 실행
```

> 💡 **콜백 함수(callback)** = 다른 함수에 **인자로 넘겨서, 나중에 대신 실행되게 하는 함수**. `addEventListener`, `forEach`, `setTimeout`에 넘기는 함수가 모두 콜백이다.
> 

### **5-2. 호이스팅(Hoisting)**

> 코드를 실행하기 전에 **전체를 한 번 훑어서 선언(변수·함수)을 먼저 처리**하는 동작 방식
> 

그래서 아래처럼 함수를 **아래에 선언해도 위에서 쓸 수 있다.**

```
box.addEventListener("mouseover", () => changeBackgroundColor("skyblue"));

function changeBackgroundColor(color) {   // 아래에 있어도 OK
  box.style.backgroundColor= color;
}
```

```
[실행 전 준비 단계]                     [실제 실행 단계]
코드 전체 훑기                          1줄부터 차례로 실행
 └ function changeBackgroundColor  →    addEventListener(...)  ← 이미 함수가 준비돼 있음
   를 미리 등록해 둠
```

> ⚠️ **하지만 모든 선언이 똑같이 끌어올려지는 건 아니다.**
> 
> 
> 
> | **선언 방식** | **선언 전에 사용하면** |
> | --- | --- |
> | `function 이름() {}` (함수 선언문) | ⭕ **정상 실행** |
> | `const 이름 = () => {}` (화살표 함수) | ❌ `ReferenceError` |
> | `const` / `let` 변수 | ❌ `ReferenceError` |
> | 💡 `var` 변수 | 에러는 없지만 `undefined` (그래서 `var`를 안 쓴다) |
> 
> ```
> sayHello();   // ⭕ "hello"
> function sayHello() { console.log("hello"); }
> 
> greet();      // ❌ ReferenceError: Cannot access 'greet' before initialization
> const greet = () => console.log("hi");
> ```
> 
> `const`/`let`도 내부적으로는 끌어올려지지만, **선언 줄에 도달하기 전까지는 접근이 금지**된다(TDZ, 일시적 사각지대). **결론: 화살표 함수와 변수는 항상 쓰기 전에(위에) 선언하자.**
> 

---

## **6. 실습**

> 아래 실습은 HTML의 `<body>` 끝에 `<script>`를 넣거나, `<script src="app.js" defer></script>`로 연결해서 실행한다.
> 

### **실습 1. 버튼 클릭 이벤트**

> 버튼을 클릭하면 콘솔에 "버튼 클릭됨" 출력
> 

```
<button id="btn">클릭</button>
```

```
const btn= document.querySelector("#btn");

btn.addEventListener("click", function () {
  console.log("버튼 클릭됨");
});
```

### **실습 2. 텍스트 변경하기**

> 버튼을 클릭하면 텍스트를 "Hello JavaScript"로, 색상은 빨간색으로 변경
> 

```
<h1 class="text">Hello</h1>
<button id="change">변경</button>
```

```
const h1= document.querySelector(".text");
const button= document.querySelector("#change");

button.addEventListener("click", function () {
  h1.textContent= "Hello JavaScript";
  h1.style.color= "red";
});
```

### **실습 3. 실시간 입력 감지**

> 비밀번호를 **입력할 때마다** 4자리 이상인지 검사해서 안내
> 

```
<input type="password" placeholder="비밀번호 입력">
<p id="result"></p>
```

```
const input= document.querySelector("input");
const result= document.querySelector("#result");

function validatePassword() {
  if (input.value.length< 4) {
    result.textContent= "4자리 이상 입력하세요.";
    result.style.color= "red";
  } else {
    result.textContent= "사용 가능한 비밀번호입니다.";
    result.style.color= "blue";
  }
}

input.addEventListener("input", validatePassword);   // 한 글자 입력할 때마다 실행
```

> 💡 `"input"` 대신 `"change"`를 쓰면 입력을 **다 마치고 입력창 밖을 클릭했을 때** 한 번만 검사한다. "실시간"이 필요하면 `input` 이벤트다.
> 

### **실습 4. 마우스 감지**

> 마우스를 올리면 텍스트가 오렌지색, 내리면 검정색이 되게 만들기
> 

```
<p id="box">마우스를 올려보세요</p>
```

**방법 ① 함수 두 개**

```
const box= document.querySelector("#box");

function highlightText() {
  box.style.color= "orange";
  box.style.border= "1px solid orange";
}

function resetText() {
  box.style.color= "black";
  box.style.border= "none";
}

box.addEventListener("mouseover", highlightText);
box.addEventListener("mouseout", resetText);
```

**방법 ② 인자를 받는 함수 하나 + 화살표 함수**

```
const box= document.querySelector("#box");

box.addEventListener("mouseover", () => changeColor("orange"));
box.addEventListener("mouseout", () => changeColor("black"));

function changeColor(color) {   // 호이스팅 덕분에 아래에 있어도 동작
  box.style.color= color;
}
```

> 💡 교안의 화살표 함수 예시는 **배경색**(`backgroundColor`)을 skyblue / orange로 바꾸는 코드라 과제 설명(글자색 오렌지 / 검정)과 다르다. 위 방법 ②는 과제 설명에 맞춰 **글자색**을 바꾸도록 고친 것이다. 배경색을 바꾸고 싶다면 `style.color`를 `style.backgroundColor`로 바꾸면 된다.
> 

> 💡 `mouseover`/`mouseout`은 자식 요소를 드나들 때도 발생한다. 자식 요소가 있는 박스라면 `mouseenter`/`mouseleave`가 더 안정적이다. 그리고 단순히 hover 때 색만 바꾸는 거라면 사실 **CSS `:hover`로 충분하다.** JS는 hover 때 "다른 요소를 바꾸거나 데이터를 처리"해야 할 때 쓴다.
> 

### **실습 5. 스타일 변경**

> 버튼을 클릭하면 텍스트 색상은 오렌지, 크기는 20px로 변경
> 

```
<p id="box">색상 변경</p>
<button id="color">변경</button>
```

```
const box= document.querySelector("#box");
const btn= document.querySelector("#color");

btn.addEventListener("click", function () {
  box.style.color= "orange";
  box.style.fontSize= "20px";
});
```

### **실습 6. 종합 — 합격 판정**

> 점수를 입력하고 버튼을 클릭하면 합격(60점 이상) / 불합격 출력
> 

```
<input id="score" placeholder="점수 입력" />
<button id="check">확인</button>
<p id="result"></p>
```

```
const scoreInput= document.querySelector("#score");
const button= document.querySelector("#check");
const result= document.querySelector("#result");

button.addEventListener("click", function () {
  const score= Number(scoreInput.value);   // 입력값은 문자열 → 숫자로 변환

  if (score>= 60) {
    result.textContent= "합격";
  } else {
    result.textContent= "불합격";
  }
});
```

**💡 한 단계 더: 잘못된 입력 처리**

교안 코드는 입력창이 **비어 있으면** `Number("")` = `0`이 되어 "불합격"이 나오고, `"abc"`를 넣으면 `NaN`이 되어 역시 "불합격"이 나온다. 입력 검사를 추가하면 더 친절해진다.

```
button.addEventListener("click", function () {
  const text= scoreInput.value.trim();
  const score= Number(text);

  if (text=== "" || Number.isNaN(score)) {
    result.textContent= "숫자를 입력하세요.";
    result.style.color= "gray";
    return;
  }

  if (score>= 60) {
    result.textContent= "합격";
    result.style.color= "blue";
  } else {
    result.textContent= "불합격";
    result.style.color= "red";
  }
});
```

> 💡 HTML에서 `<input type="number" min="0" max="100">`으로 바꾸면 숫자 키패드가 뜨고 글자 입력도 막아준다.
> 

### **💡 `<script>` 위치와 DOMContentLoaded**

`<head>`에 `<script>`를 넣으면 **HTML 요소가 만들어지기 전에** JS가 실행되어 `querySelector`가 `null`을 돌려준다.

```
HTML을 위에서부터 읽음
 ├── <head>
 │    └── <script> 실행  ← 이 시점엔 <button>이 아직 없음 → null → 에러!
 └── <body>
      └── <button> 생성
```

해결 방법 3가지:

| **방법** | **코드** |
| --- | --- |
| ① `</body>` 바로 위에 두기 | `<script src="app.js"></script></body>` |
| ② **`defer` 속성** (추천) | `<head>`에 `<script src="app.js" defer></script>` |
| ③ DOMContentLoaded 이벤트 | `document.addEventListener("DOMContentLoaded", () => { ... })` |

`Cannot read properties of null (reading 'addEventListener')` 에러가 나면 **가장 먼저 의심할 것**이 이 문제다(또는 선택자 오타).

---

## **7. Web API**

> **브라우저가 JavaScript에 제공하는 기능 모음**
> 
- JavaScript **언어 자체가 아니라 브라우저 환경의 API**다.
- 웹 페이지가 브라우저 기능과 상호작용하도록 도와준다.
- 사용자 이벤트, 화면 제어, 네트워크 통신 등을 가능하게 한다.

```
┌──────────────────── 브라우저 ────────────────────┐
│                                                  │
│   ┌─────────────────┐      ┌──────────────────┐  │
│   │  JavaScript 엔진 │ ───▶ │     Web API      │  │
│   │                 │ 요청  │                  │  │
│   │ 변수, if, for,   │      │ DOM   (화면)      │  │
│   │ 함수, 배열 …     │ ◀─── │ Event (클릭 등)   │  │
│   │                 │ 결과  │ Timer (시간)      │  │
│   │ = 언어 자체       │      │ Storage (저장)   │  │
│   └─────────────────┘      │ Fetch (서버 통신)  │  │
│                            └──────────────────┘  │
└──────────────────────────────────────────────────┘
```

> 💡 그래서 **Node.js에는 `document`가 없다.** 지난 글에서 `node app.js`로 실행하던 코드에 `document.querySelector`를 쓰면 `document is not defined` 에러가 난다. DOM은 브라우저가 주는 기능이기 때문이다. (반대로 `console.log`, `setTimeout`은 Node.js도 따로 제공한다.)
> 

### **7-1. Web API 종류**

| **API** | **하는 일** | **예시** |
| --- | --- | --- |
| **DOM API** | 화면 요소 선택·변경 | `document.querySelector`, `element.textContent` |
| **Event API** | 사용자 행동 감지 | `addEventListener` |
| **Timer API** | 시간 지연·반복 실행 | `setTimeout`, `setInterval` |
| **Storage API** | 브라우저에 데이터 저장 | `localStorage`, `sessionStorage` |
| **Fetch API** | 서버와 통신 | `fetch` |

> 💡 지난 글 계산기에서 쓴 `prompt()`, 그리고 `alert()`, `confirm()`도 브라우저가 주는 Web API다.
> 

---

## **8. Timer API**

### **8-1. setTimeout — 일정 시간 뒤 한 번 실행**

```
setTimeout(function () {
  console.log("3초 후 실행");
}, 3000);   // 밀리초(ms) 단위 → 3000ms = 3초
```

### **8-2. setInterval — 일정 시간마다 반복 실행**

```
setInterval(function () {
  console.log("1초마다 실행");
}, 1000);
```

```
시간 ─────0s──────1s──────2s──────3s──────4s──────▶

setTimeout(fn, 3000)
                           ●  fn 실행 (1번으로 끝)

setInterval(fn, 1000)
                  ●        ●        ●        ●  …  (멈출 때까지 계속)
```

|  | **setTimeout** | **setInterval** |
| --- | --- | --- |
| 실행 횟수 | **한 번** | **반복** |
| 멈추기 | `clearTimeout(id)` | `clearInterval(id)` |
| 예 | 알림 3초 뒤 닫기 | 시계, 카운트다운, 슬라이드 자동 넘김 |

### **8-3. timerId — 타이머 번호**

`setTimeout` / `setInterval`은 실행하면 **타이머를 구분하는 번호**를 돌려준다. 이 번호로 타이머를 멈춘다.

```
const timerId= setInterval(function () {
  console.log("실행");
}, 1000);

clearInterval(timerId);   // 이 번호의 타이머 정지
```

timerId가 필요한 이유:

1. **타이머를 멈추기 위해** — 번호가 없으면 멈출 방법이 없다.
2. **버튼을 여러 번 눌러도 타이머가 하나만** 돌게 하기 위해 — 이미 돌고 있는지 timerId로 확인한다.

> ⚠️ 버튼을 누를 때마다 `setInterval`을 새로 만들면 타이머가 **겹겹이 쌓여서** 숫자가 2배, 3배 속도로 줄어든다. 아래 실습의 `if (timerId !== null) return;`이 이걸 막는 장치다.
> 

### **8-4. 💡 타이머는 "기다리는 동안" 다른 코드를 막지 않는다**

```
console.log("1");
setTimeout(() => console.log("2"), 0);   // 0초 뒤인데도…
console.log("3");

// 출력: 1 → 3 → 2
```

`setTimeout`은 함수를 **브라우저(Web API)에 맡겨 두고** 바로 다음 줄로 넘어간다. 시간이 다 되면 함수가 대기열에 들어가고, **지금 실행 중인 코드가 모두 끝난 뒤에** 실행된다.

```
JavaScript 엔진                 Web API (브라우저)            대기열
──────────────                  ──────────────────           ──────
console.log("1")  → 출력 1
setTimeout(fn, 0) ──── fn 맡김 ──▶  0ms 타이머
console.log("3")  → 출력 3          시간 됨 ──── fn ────────▶  [fn]
(할 일 끝, 비었음)  ◀──────────────────────── fn 꺼내서 실행 ─┘
fn()              → 출력 2
```

이 구조 덕분에 타이머를 기다리는 동안에도 **화면이 멈추지 않고** 클릭 등 다른 동작이 가능하다. (이 흐름을 **이벤트 루프**라고 한다.)

---

## **9. 실습: 5초 카운트다운 타이머**

> 버튼을 누르면 5 → 4 → 3 → 2 → 1 → "끝"을 1초 간격으로 출력
> 

```
<button id="start">카운트다운 시작</button>
<p id="result"></p>
```

**교안 코드**

```
const startBtn= document.querySelector("#start");
const timeEl= document.querySelector("#result");

let time= 5;
let timerId= null;   // null = 타이머가 안 돌고 있음

startBtn.addEventListener("click", function () {
  if (timerId!== null) return;   // 이미 돌고 있으면 무시 (중복 방지)

  timeEl.textContent= time;      // 시작하자마자 5 표시

  timerId= setInterval(function () {
    time--;                       // 1초마다 1씩 감소

    if (time=== 0) {
      timeEl.textContent= "끝";
      clearInterval(timerId);     // 타이머 정지
      timerId= null;             // "안 돌고 있음"으로 되돌림
    } else {
      timeEl.textContent= time;
    }
  }, 1000);
});
```

**상태 변화 흐름**

```
          클릭                 1초마다 time--               time === 0
 [대기] ─────────▶ [실행 중] ───────────────▶ (5→4→3→2→1) ──────────▶ [끝]
timerId = null     timerId = 번호                                    clearInterval
                    │                                                timerId = null
                    │ 실행 중에 또 클릭?
                    └──▶ if (timerId !== null) return;  → 무시
```

| **시간** | **time** | **화면** |
| --- | --- | --- |
| 클릭 직후 | 5 | 5 |
| 1초 | 4 | 4 |
| 2초 | 3 | 3 |
| 3초 | 2 | 2 |
| 4초 | 1 | 1 |
| 5초 | 0 | **끝** (타이머 정지) |

### **💡 버그 찾기: "끝" 다음에 다시 누르면?**

교안 코드는 **한 번 끝난 뒤 버튼을 다시 누르면** 이상하게 동작한다.

- 끝났을 때 `time`은 `0`에 머물러 있다.
- 다시 누르면 화면에 `0`이 뜨고, 1초 뒤 `time--` → `1`, `2`, `3` …
- `time === 0`인 순간이 다시 오지 않아서 **영원히 음수로 내려간다.**

**해결: 시작할 때 `time`을 5로 되돌린다.**

```
startBtn.addEventListener("click", function () {
  if (timerId!== null) return;

  time= 5;                       // ✅ 추가: 시작할 때마다 초기화
  timeEl.textContent= time;

  timerId= setInterval(function () {
    time--;

    if (time=== 0) {
      timeEl.textContent= "끝";
      clearInterval(timerId);
      timerId= null;
    } else {
      timeEl.textContent= time;
    }
  }, 1000);
});
```

> 💡 비교 조건을 `time === 0` 대신 `time <= 0`으로 쓰는 것도 방어적인 습관이다. 값이 어떤 이유로 0을 건너뛰어도 멈춘다.
> 

**💡 응용: 실행 중에는 버튼 비활성화**

```
startBtn.disabled= true;    // 시작할 때 → 버튼이 회색으로 눌리지 않음
startBtn.disabled= false;   // 끝날 때
```

`timerId` 검사와 함께 쓰면 사용자도 "지금 실행 중"임을 눈으로 알 수 있다.

---

## **마무리 요약**

| **주제** | **핵심** |
| --- | --- |
| DOM | HTML을 객체 트리로 만든 것. JS는 **DOM을 바꾸고**, 브라우저가 화면을 다시 그린다 |
| 선택 | `querySelector`(1개) / `querySelectorAll`(전부) — CSS 선택자 그대로 |
| 변경 | 글자 `textContent` (사용자 입력은 꼭 이것), 스타일 `style.카멜표기`, 여러 스타일은 `classList` |
| 요소 추가 | `createElement` → 내용 채우기 → `appendChild` |
| 이벤트 | `요소.addEventListener("이벤트", 함수)` — **함수는 괄호 없이 전달** |
| 화살표 함수 | `() => {}`, 인자가 필요한 리스너는 화살표 함수로 감싸기 |
| 호이스팅 | `function` 선언문만 위에서 미리 사용 가능, `const`/화살표 함수는 선언 후 사용 |
| Web API | 브라우저가 주는 기능 (DOM·Event·Timer·Storage·Fetch). JS 언어 자체가 아님 |
| Timer | `setTimeout`(한 번) / `setInterval`(반복), **timerId**로 정지·중복 방지 |