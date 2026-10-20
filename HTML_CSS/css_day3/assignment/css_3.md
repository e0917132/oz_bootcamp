# 3_CSS 기초Position· Flexbox · 반응형 디자인

## [목차]

---

> 지난 글에서 `margin`, `padding`, `box-sizing`, `inline`/`block`으로 **박스 하나**를 다루는 법을 봤다면, 이번 글의 질문은 이것이다.
> 
> 
> **"여러 개의 박스를 화면에 어떻게 배치할 것인가?"**
> 

이번 글에서 다루는 내용

1. Normal Flow — 아무것도 안 했을 때 브라우저의 기본 배치
2. `position` — 요소를 "어디를 기준으로" 놓을지
3. Flexbox — 박스를 한 방향으로 유연하게 배치
4. 반응형 디자인과 Media Query
5. 실습: 반응형 네비게이션 바 만들기

---

## **1. Normal Flow (기본 흐름)**

CSS에 레이아웃 속성을 **하나도 주지 않았을 때** 브라우저가 요소를 자동으로 배치하는 기본 규칙이다.

| **요소 종류** | **배치 방식** |
| --- | --- |
| **Inline 요소** (`span`, `a`, `strong` …) | 왼쪽 → 오른쪽으로 흐르고, 줄이 차면 다음 줄로 |
| **Block 요소** (`div`, `p`, `h1` …) | 위 → 아래로, 한 줄씩 통째로 차지 |

문제는 Normal Flow만으로는 **가로 정렬, 가운데 정렬, 간격 맞추기가 어렵다**는 것이다. 그래서 이 흐름을 조정하거나 벗어나기 위한 도구가 필요하고, 그게 바로 `position`과 Flexbox다.

---

## **2. position**

> 요소를 **어디에**, **무엇을 기준으로** 배치할지 정하는 속성
> 
- Normal Flow를 조정하거나 아예 벗어나게 할 수 있다.
- 레이아웃, 오버레이, 고정 UI를 만들 때 필수다.
- `top` / `left` / `right` / `bottom` 속성과 함께 사용한다.

### **한눈에 비교**

| **값** | **Normal Flow** | **기준점** | **주 사용처** |
| --- | --- | --- | --- |
| `static` (기본값) | 유지 | — (`top`, `left` 적용 안 됨) | 일반 문서 요소 |
| `relative` | **유지** | 자기 **원래 위치** | 살짝 위치 보정, `absolute`의 기준 만들기 |
| `absolute` | **제거** | 가장 가까운 **position이 있는 조상** | 아이콘, 배지, 모달 내부 요소 |
| `fixed` | **제거** | **viewport**(브라우저 화면) | 고정 헤더, 플로팅 버튼 |

### **실습 준비**

```
code position.html
```

```
<div class="container">
  <div class="box">BOX</div>
</div>
```

```
.container {
  width: 200px;
  height: 200px;
  border: 3px solid#333;
  margin-bottom: 40px;
}
.box {
  width: 100px;
  height: 100px;
  background: #4caf50;
}
```

200×200 테두리 상자 안에 100×100 초록 박스가 들어있는 상태에서 `.box`의 `position`만 바꿔 본다.

### **2-1. `position: relative`**

```
.box {
  position: relative;
  top: 30px;
  left: 30px;
}
```

- Normal Flow는 **유지**된다.
- **자기 원래 위치를 기준으로** 위에서 30px, 왼쪽에서 30px 이동한다.
- `margin`으로 옮기면 주변 요소도 같이 밀리지만, `position`으로 옮기면 **원래 자리는 그대로 차지한 채 보이는 위치만 바뀌기 때문에 다른 요소 배치에 영향이 없다.**

### **2-2. `position: absolute`**

```
.box {
  position: absolute;
  top: 0px;
  left: 0px;
}
```

- Normal Flow에서 **제거**된다. (원래 자리가 비어버림)
- **가장 가까운, position이 지정된 조상 요소**를 기준으로 배치된다.
- 그런 조상이 없으면 페이지(viewport) 기준처럼 동작해서, 위 코드에서는 박스가 컨테이너 밖 **화면 왼쪽 위 구석**으로 날아간다.

**부모를 기준으로 삼고 싶다면? → 부모에 `relative`를 준다.**

```
.container {
  /* … */
  position: relative;
}
```

이제 `.box`는 `.container`의 왼쪽 위에 붙는다. `relative`(부모) + `absolute`(자식) 조합은 실무에서 정말 자주 쓰는 패턴이다.

> 💡 엄밀히는 기준 조상이 없을 때 *초기 컨테이닝 블록*(문서 첫 화면 크기의 영역) 기준이라, `fixed`와 달리 **스크롤하면 같이 올라간다.**
> 

### **2-3. `position: fixed`**

```
.container {
  /* … */
  height: 20000px;   /* 스크롤이 생기도록 일부러 길게 */
}
.box {
  position: fixed;
}
```

- Normal Flow에서 **제거**된다.
- **viewport(화면) 기준**이라 **스크롤해도 위치가 고정**된다.
- 상단 고정 헤더, "맨 위로" 플로팅 버튼 등에 사용한다.

> 💡 교안에는 없지만 `position: sticky`도 알아두면 좋다. 평소엔 `relative`처럼 흐르다가 스크롤이 특정 지점(`top: 0` 등)에 닿으면 `fixed`처럼 붙는다. 테이블 헤더나 사이드 목차에 많이 쓴다.
> 

### **2-4. 활용: 이력서 페이지 우측 상단 링크**

```
<a class="korean-link" href="">한글 이력서</a>
```

```
.korean-link {
  position: absolute;
  top: 10px;
  right: 10px;
  color: darkcyan;
  font-size: small;
}
```

본문 흐름과 상관없이 화면 **오른쪽 위 구석**에 작은 링크를 띄울 수 있다.

---

## **3. Flexbox (Flexible Box Layout)**

> 여러 박스를 **한 방향으로 유연하게** 배치하기 위한 레이아웃 시스템 → Normal Flow를 벗어나 **의도적으로** 배치하자!
> 

### **특징**

- **1차원 레이아웃** — 가로 또는 세로, 한 방향만 다룸 (2차원은 Grid)
- **부모가 자식의 배치와 정렬을 제어**
- 정렬과 간격 설정이 직관적

### **3-1. 기본 사용법**

부모에 `display: flex`를 주면 부모는 **flex container**, 바로 아래 자식들은 **flex item**이 된다.

```
<div class="container">
  <div class="item">A</div>
  <div class="item">B</div>
  <div class="item">C</div>
</div>
```

```
.container {
  display: flex;
  gap: 10px;        /* 아이템 사이 간격 */
}
.item {
  width: 80px;
  height: 80px;
  background: skyblue;
}
```

원래 `div`는 block이라 세로로 쌓이지만, `display: flex` 한 줄로 **A B C가 가로로 나란히** 놓이고 `gap`으로 간격까지 깔끔하게 맞춰진다.

### **3-2. 박스 안 글자를 정가운데에**

```
.item {
  width: 80px;
  height: 80px;
  background: skyblue;
  display: flex;
  justify-content: center;  /* 가로 가운데 */
  align-items: center;      /* 세로 가운데 */
}
```

`.item` 자신도 flex container가 되어, 안에 있는 글자(A, B, C)가 **정중앙**에 온다. "가운데 정렬은 어떻게 하지?"에 대한 가장 확실한 답이다.

### **3-3. 주축(Main axis) vs 교차축(Cross axis)**

Flexbox는 **축**을 기준으로 정렬한다.

|  | **기본 방향** | **정렬 속성** |
| --- | --- | --- |
| **주축** (Main axis) | 가로 → | `justify-content` |
| **교차축** (Cross axis) | 세로 ↓ | `align-items` |

> ⚠️ `flex-direction: column`으로 바꾸면 **주축이 세로**, 교차축이 가로가 된다. 즉 `justify-content`는 "가로 정렬"이 아니라 **"주축 정렬"**이라고 외워야 헷갈리지 않는다.
> 

### **3-4. Flexbox 정렬 3단계 사고법**

1. **주축 방향 결정** — 기본값 `flex-direction: row;`
2. **주축 정렬 결정** — 기본값 `justify-content: flex-start;`
3. **교차축 정렬 결정** — 기본값 `align-items: stretch;`

자주 쓰는 값 정리 💡

| **속성** | **값** | **의미** |
| --- | --- | --- |
| `flex-direction` | `row` / `column` | 가로 / 세로 배치 |
| `justify-content` | `flex-start` / `center` / `flex-end` | 앞 / 가운데 / 끝 |
|  | `space-between` | 양 끝 붙이고 사이를 균등하게 |
|  | `space-around` / `space-evenly` | 바깥 여백까지 균등하게 |
| `align-items` | `stretch` / `center` / `flex-start` / `flex-end` | 늘이기 / 가운데 / 시작 / 끝 |

🐸 **연습 추천:** [Flexbox Froggy](https://flexboxfroggy.com/#ko) — 개구리를 연잎으로 옮기며 flex 속성을 게임처럼 익힐 수 있다.

### **3-5. 활용 ① 이력서 연락처 한 줄로 정렬**

```
<div class="contact-row">
  <span>example@email.com</span>
  <span class="divider">|</span>
  <span>010-0000-0000</span>
  <span class="divider">|</span>
  <a class="github-link" href="https://github.com/your-id">
    <i class="fa-brands fa-github"></i>GitHub
  </a>
</div>
```

```
.contact-row {
  display: flex;
  gap: 4px;
  font-size: 0.9rem;
  justify-content: center;   /* 가운데 모으기 */
  margin: 16px;
}
.contact-row a {
  color: inherit;            /* 부모 글자색 그대로 (파란 링크색 제거) */
  text-decoration: none;     /* 밑줄 제거 */
}
.contact-row a:hover {
  text-decoration: underline; /* 마우스 올리면 밑줄 */
}
```

### **3-6. 활용 ② footer를 항상 화면 맨 아래로**

내용이 짧으면 footer가 화면 중간에 떠 있는 문제를 flex로 해결한다.

```
body {
  min-height: 100vh;       /* 최소 화면 높이만큼 */
  display: flex;
  flex-direction: column;  /* header / main / footer 세로 배치 */
}
main {
  flex: 1;                 /* 남은 공간을 전부 차지 */
}
footer {
  margin-bottom: 2rem;
}
```

> **`flex: 1` = 남은 공간을 다 차지하기** `main`이 늘어나면서 footer를 바닥으로 밀어낸다.
> 

---

## **4. 반응형 디자인 (Responsive Design)**

> 화면 크기와 환경에 따라 레이아웃과 스타일이 **자연스럽게 변하는** 디자인 방식
> 

하나의 화면 크기만으로는 모든 사용자를 만족시킬 수 없다.

- 데스크톱 (큰 화면)
- 태블릿
- 모바일 (작은 화면)
- 가로 / 세로 회전

### **핵심 요소 3가지**

| **요소** | **도구** |
| --- | --- |
| 유연한 **레이아웃** | Flexbox, Grid |
| 유연한 **크기 단위** | `%`, `vw`, `vh`, `rem` |
| **조건부** 스타일 | Media Query |

### **4-1. rem으로 글씨 크기 맞추기**

```
header        { font-size: 2.4rem; }
main          { font-size: 1.2rem; }
.contact-row  { font-size: 0.9rem; }
footer        { font-size: 0.6rem; }
```

> 💡 `rem`은 **루트(`html`) 글자 크기 기준** 배수다. 브라우저 기본값이 16px이므로 `1.2rem ≈ 19.2px`. 루트 크기만 바꾸면 전체 글자가 비율대로 함께 바뀌어서 반응형에 유리하다.
> 

✅ 개발자 도구(`F12` → 기기 툴바 `Ctrl/Cmd + Shift + M`)에서 화면 크기를 바꿔가며 확인해 보자.

### **4-2. Media Query**

> **"화면이 이 조건이면, 이 스타일을 써라"**
> 

#### **실습**

```
<div class="container">
  <div class="box">A</div>
  <div class="box">B</div>
  <div class="box">C</div>
</div>
```

```
.container {
  display: flex;
}
.box {
  background-color: skyblue;
  border: 1px solid black;
  flex: 1;              /* 세 박스가 너비를 똑같이 나눠 가짐 */
}

/* 화면이 300px 이하일 때 */
@media (max-width: 300px) {
  .container {
    flex-direction: column;  /* 세로로 쌓기 */
  }
  .box {
    background: orange;      /* 색도 바꿔서 적용 여부 확인 */
  }
}
```

- 넓은 화면: 하늘색 A B C가 **가로로** 나란히
- 300px 이하: 주황색 A B C가 **세로로** 쌓임

> 💡 `max-width: 300px` = "화면 너비가 **300px 이하**일 때". 반대로 `min-width`는 "~ 이상일 때"로, 모바일 화면을 기본으로 짜고 큰 화면 스타일을 덧붙이는 **모바일 퍼스트** 방식에서 많이 쓴다.
> 

---

## **5. 실습: 반응형 네비게이션 바 만들기**

지금까지 배운 **Flexbox + Media Query**를 모두 써서, 넓은 화면에서는 가로 / 좁은 화면에서는 세로로 바뀌는 메뉴바를 만들어 본다.

```
code navbar.html
code navbar_style.css
```

### **5-1. HTML 구조**

```
<head>
  <!-- 아이콘(Font Awesome) -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
  />
  <!-- 내가 만든 스타일 -->
  <link rel="stylesheet" href="navbar_style.css">
</head>
<body>
  <nav class="navbar">
    <div class="navbar__logo">
      <i class="fa-brands fa-dev"></i>
      <a href="#">my-name</a>
    </div>

    <ul class="navbar__menu">
      <li><a href="">About</a></li>
      <li><a href="resume.html">Resume</a></li>
      <li><a href="">Gallery</a></li>
    </ul>

    <ul class="navbar__icons">
      <li><i class="fa-brands fa-github"></i></li>
      <li><i class="fa-brands fa-x-twitter"></i></li>
    </ul>
  </nav>
</body>
```

`nav` 안이 **로고 / 메뉴 / 아이콘** 세 덩어리로 나뉘어 있다는 점이 핵심이다.

> 💡 `navbar__logo` 같은 이름은 **BEM 표기법**(Block__Element)이다. "navbar 블록 안의 logo 요소"라는 관계가 이름만 봐도 드러난다.
> 

### **5-2. 기본 스타일 초기화**

```
body {
  margin: 0;                 /* 브라우저 기본 여백 제거 */
}
a {
  text-decoration: none;     /* 링크 밑줄 제거 */
  color: black;
}
```

### **5-3. 네비게이션 바 전체**

```
.navbar {
  display: flex;
  justify-content: space-between;  /* 로고는 왼쪽, 아이콘은 오른쪽 끝, 메뉴는 가운데 */
  align-items: center;             /* 세로 가운데 정렬 */
  background-color: beige;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
```

`space-between` 하나로 세 덩어리가 양끝과 가운데로 자연스럽게 퍼진다.

### **5-4. 로고와 메뉴**

```
.navbar__logo {
  font-size: 1.4rem;
}

.navbar__menu {
  display: flex;        /* li를 가로로 */
  list-style: none;     /* 앞의 점(•) 제거 */
  padding: 0;           /* ul 기본 들여쓰기 제거 */
}
.navbar__menu li {
  padding: 8px 12px;    /* 위아래 8px, 좌우 12px */
}
.navbar__menu li:hover {
  background-color: white;   /* 마우스 올리면 하얀 배경 */
  border-radius: 8px;        /* 모서리 둥글게 */
}
```

### **5-5. 아이콘**

```
.navbar__icons {
  list-style: none;
  display: flex;
  padding: 0;
}
.navbar__icons li {
  padding: 8px 4px;
}
```

### **5-6. 구글 폰트 적용**

[Google Fonts](https://fonts.google.com/)에서 원하는 폰트를 골라 `<link>` 코드를 `<head>`에 붙여넣은 뒤:

```
body {
  margin: 0;
  font-family: "BBH Bogle", sans-serif;  /* 폰트를 못 불러오면 sans-serif로 대체 */
}
```

### **5-7. 반응형 적용 (400px 이하)**

```
@media (max-width: 400px) {
  .navbar {
    flex-direction: column;     /* 로고/메뉴/아이콘을 세로로 */
    align-items: flex-start;
    padding: 16px;
  }

  .navbar__menu {
    flex-direction: column;     /* 메뉴 항목도 세로로 */
    width: 100%;
    text-align: center;
  }

  .navbar__icons {
    justify-content: center;    /* 아이콘은 가운데로 */
    width: 100%;
  }
}
```

**결과**

| **화면** | **모습** |
| --- | --- |
| 400px 초과 | `[로고]  About Resume Gallery  [GitHub][X]` 한 줄 |
| 400px 이하 | 로고 → 메뉴(세로, 가운데 정렬) → 아이콘(가운데) 순으로 위에서 아래로 |

> ⚠️ `flex-direction: column`이 되면 **주축이 세로**로 바뀐다. 그래서 `.navbar`에서 `align-items`(이제 가로 방향)를 `flex-start`로 바꿔 왼쪽 정렬하고, 메뉴·아이콘은 `width: 100%`로 가로를 꽉 채운 뒤 각자 가운데 정렬한 것이다.
> 

---

## **마무리 요약**

- **Normal Flow**: inline은 옆으로, block은 아래로. 정렬이 어렵다.
- **position**
    - `relative` → 내 원래 자리 기준, 흐름 유지
    - `absolute` → position 있는 조상 기준, 흐름 제거 (부모에 `relative` 짝꿍!)
    - `fixed` → 화면 기준, 스크롤해도 고정
- **Flexbox**: 부모에 `display: flex`. 주축은 `justify-content`, 교차축은 `align-items`. `flex: 1`은 남은 공간 차지.
- **반응형**: 유연한 레이아웃(Flex) + 유연한 단위(rem, %, vw) + 조건부 스타일(`@media`).