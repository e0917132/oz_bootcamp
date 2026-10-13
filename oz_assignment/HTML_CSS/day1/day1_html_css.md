# HTML / CSS 기본 개념 정리 (1)

---

## 한눈에 보기

| **기술** | **역할** | **비유** |
| --- | --- | --- |
| **HTML** | 웹 페이지의 **구조**(제목, 문단, 이미지, 링크) | 건물의 뼈대 |
| **CSS** | 요소의 **모양과 배치**(색, 크기, 여백, 레이아웃) | 인테리어 |
| **JavaScript** | **동작**(클릭, 데이터 변경) | 전기·수도 설비 |
| **Bootstrap** | 미리 만들어진 CSS(+JS) 모음 | 조립식 가구 |

---

## **1. HTML 기초**

### **1-1. HTML이란?**

**HyperText Markup Language** — 웹 페이지의 **구조를 정의하는 언어**이다. 프로그래밍 언어가 아니라 "이건 제목, 이건 문단"이라고 **표시(markup)** 하는 언어.

웹에서 HTML이 쓰이는 흐름: **서버가 HTML 문서를 만들어 전달 → 브라우저가 읽고 화면 구조를 그림**

---
### **1-2. 태그와 중첩 구조**

```
<h1>제목</h1>        <!-- 여는 태그 + 내용 + 닫는 태그 -->
<p>문단 내용</p>
```

- 태그는 `<태그이름>` 형태이며, 각 태그는 고유한 **의미와 역할**을 가진다.
- 대부분 여는 태그/닫는 태그 쌍이지만, `<br>`, `<hr>`, `<img>`, `<input>`처럼 **내용이 없어 닫는 태그가 없는 태그(빈 요소)** 도 있다.
- 태그 안에 태그를 넣는 **중첩(nesting)** 으로 문서의 계층(부모-자식 관계)이 생긴다.

```
<body>          <!-- 부모 -->
  <h1>제목</h1>  <!-- 자식 -->
  <p>내용</p>    <!-- 자식 (h1과는 형제) -->
</body>
```

> 💡 중첩할 때는 **먼저 연 태그를 나중에 닫는다.** `<p><strong>굵게</p></strong>` ✕ → `<p><strong>굵게</strong></p>` ○
> 

---
### **1-3. 실습 환경**

```
mkdir html && cd html
python3.13 -m http.server   # 현재 폴더를 웹 서버로 실행 → http://localhost:8000
code hello.html
```

- `python -m http.server`는 현재 폴더의 파일을 브라우저에서 열 수 있게 해 주는 **간이 웹 서버**. (종료: `Ctrl + C`)
- 또는 VS Code **Live Preview** 확장 설치 → `Ctrl(Cmd) + Shift + P` → `Live Preview: Show Preview` 로 저장할 때마다 자동 새로고침되는 미리보기를 쓸 수 있다.

---
### **1-4. HTML 문서 기본 구조**

```
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    Hello, HTML
  </body>
</html>
```

| **코드** | **의미** |
| --- | --- |
| `<!DOCTYPE html>` | "이 문서는 **HTML5** 문서"라고 브라우저에 알리는 선언 (태그 아님) |
| `<html>` | 최상위 태그. 모든 요소가 이 안에 들어감 |
| `<head>` | **화면에 보이지 않는 설정 영역** (제목, 문자 인코딩, CSS 연결, 메타 정보) |
| `<title>` | 브라우저 탭 제목 + 검색 결과에 표시되는 제목 |
| `<body>` | **화면에 실제로 보이는 내용** (텍스트, 이미지, 버튼 등) |

> 💡 **실무에서 쓰는 기본 틀** — `!` + `enter` 로 자동 완성
> 
> 
> ```
> <!DOCTYPE html>
> <html lang="ko">
>   <head>
>     <meta charset="UTF-8">
>     <meta name="viewport" content="width=device-width, initial-scale=1.0">
>     <title>My Page</title>
>   </head>
>   <body>
>   </body>
> </html>
> ```
> 
> | **추가 항목** | **이유** |
> | --- | --- |
> | `lang="ko"` | 문서 언어 명시 → 스크린 리더 발음, 번역기, 검색엔진에 도움 |
> | `<meta charset="UTF-8">` | **한글 깨짐 방지**. 문자 인코딩 지정 |
> | `<meta name="viewport" ...>` | **이게 없으면 모바일에서 반응형(Media Query)이 제대로 동작하지 않는다.** 모바일 브라우저가 페이지를 PC 화면 크기로 그린 뒤 축소해 버리기 때문 |

---
### **1-5. HTML이 화면에 표시되는 과정과 DOM**

```
flowchart LR
    A["1. 브라우저가<br/>HTML 요청"] --> B["2. 서버가<br/>HTML 응답"]
    B --> C["3. HTML 해석<br/>(parsing)"]
    C --> D["4. DOM 트리<br/>생성"]
    D --> E["5. CSS 적용<br/>→ 화면 표시"]
```

**DOM(Document Object Model)** = 브라우저가 HTML을 해석해서 메모리 안에 만든 **트리 구조의 객체**

- 각 태그와 텍스트가 하나의 **노드(node)** 가 된다.
- **HTML = 설계도, DOM = 브라우저 안에 지어진 실제 구조**
- JavaScript가 화면을 바꿀 때 건드리는 대상이 바로 DOM이다. (HTML 파일 자체는 바뀌지 않음)

```
document
 └─ html
    ├─ head
    │  └─ title
    │     └─ "My Page"
    └─ body
       └─ "Hello, HTML"
```

> 💡 개발자 도구(`F12` 또는 `Cmd + Option + I`)의 **Elements 탭**에 보이는 것이 HTML 원본이 아니라 **DOM이**다. JS로 바뀐 내용까지 반영되어 있어 "페이지 소스 보기"와 다를 수 있다.
> 

---
### **1-6. 텍스트 관련 태그**

**`<p>` — 문단(paragraph)**

HTML은 코드상의 **줄바꿈과 연속 공백을 무시**한다. 그래서 아래 왼쪽은 한 줄로 이어져 보이고, `<p>`로 감싸야 문단이 나뉜다.

```
<body>                          <body>
    Hello, World!                   <p>Hello, World!</p>
    Hello, World!       →           <p>Hello, World!</p>
</body>                         </body>
```

**`<h1>` ~ `<h6>` — 제목(heading)**

- 숫자가 작을수록 상위 제목. `<h1>`은 보통 **페이지당 하나**(페이지의 주제).
- 글씨 크기 때문에 고르는 것이 아니라 **문서의 목차 단계**에 맞춰 사용한다. 크기는 CSS로 조절한다. (h1 다음에 h3로 건너뛰지 않기)

**`<hr>` — 주제 구분선** (닫는 태그 없음)

> 💡 그 밖에 자주 쓰는 텍스트 태그: `<br>`(줄바꿈), `<strong>`(중요해서 굵게), `<em>`(강조해서 기울임), `<span>`(의미 없는 인라인 묶음, 스타일 적용용)
> 

---
### **1-7. 목록 `<ul>` / `<ol>` / `<li>`**

```
<ul>              <!-- unordered list: 순서 없는 목록 (●) -->
    <li>foo</li>
    <li>bar</li>
</ul>

<ol>              <!-- ordered list: 순서 있는 목록 (1. 2. 3.) -->
    <li>foo</li>
    <li>bar</li>
</ol>
```

`<li>`(list item)는 반드시 `<ul>` 또는 `<ol>`의 **직계 자식**이어야 한다.

---
### **1-8. 표 `<table>`**

```
<table border="1">
    <thead>              <!-- 표의 머리 -->
        <tr>             <!-- table row: 행 -->
            <th>이름</th> <!-- table header: 제목 칸 (굵게, 가운데) -->
            <th>나이</th>
        </tr>
    </thead>
    <tbody>              <!-- 표의 본문 -->
        <tr>
            <td>alex</td> <!-- table data: 일반 칸 -->
            <td>20</td>
        </tr>
        <tr>
            <td>bob</td>
            <td>30</td>
        </tr>
    </tbody>
</table>
```

> 
> 
> 
> 💡 `border="1"` 속성은 옛날 방식이다. 실무에서는 CSS로 `table, th, td { border: 1px solid black; border-collapse: collapse; }` 처럼 지정한다. 칸 합치기는 `colspan="2"`(가로), `rowspan="2"`(세로).
> 

---
### **1-9. 속성(Attribute)**

태그에 **추가 정보나 동작**을 지정합니다.

```
<태그이름 속성="값" 속성2="값2">
<a href="https://example.com">링크</a>
<img src="image.png" alt="이미지 설명">
<p class="text">문단</p>
```

- **여는 태그에만** 작성
- 태그마다 사용 가능한 속성이 다름 (`href`는 `<a>`용, `src`는 `<img>`용)
- 하나의 태그에 여러 속성 사용 가능 (순서 무관)
- `autofocus`, `required`처럼 **값 없이 이름만 써도 되는 속성(boolean 속성)** 도 다.

---
### **1-10. 이미지 `<img>`와 링크 `<a>`**

```
<img src="pizza.jpeg" alt="pizza">
Visit<a href="https://google.com">Google</a>
```

| **속성** | **의미** |
| --- | --- |
| `src` | 이미지 경로 (상대경로 `pizza.jpeg`, 절대경로 `https://...`) |
| `alt` | 이미지가 안 뜰 때 대신 표시되는 글 + **시각장애인용 스크린 리더가 읽는 설명** → 반드시 작성 |
| `href` | 이동할 주소 (hypertext reference) |

> 💡 `<a>` 활용
> 
> - 새 탭에서 열기: `<a href="..." target="_blank" rel="noopener">`
> - 같은 페이지 안 이동: `<a href="#contact">` → `id="contact"`인 요소로 스크롤
> - 메일/전화: `href="mailto:me@email.com"`, `href="tel:01012345678"`

---
### **1-11. 폼 `<form>` — GET vs POST**

사용자 입력을 서버로 보내는 태그입니다.

```
<!-- GET: 구글 검색 -->
<form action="https://google.com/search">    <!-- method 속성 안쓰면 get 기본값 -->
    <input type="search" placeholder="Search..." name="q" autofocus autocomplete="off">
    <button>입력</button>
</form>

<!-- POST: 데이터 전송 테스트 -->
<form action="https://httpbin.org/post" method="post">
    <input type="text" placeholder="Username" name="username">
    <button>전송</button>
</form>
```

| **속성** | **의미** |
| --- | --- |
| `action` | 데이터를 보낼 서버 주소 |
| `method` | 전송 방식 (`get` / `post`) |
| `name` | **서버로 보낼 때의 키 이름**. 없으면 값이 전송되지 않음 |
| `placeholder` | 입력 전 흐릿하게 보이는 안내 문구 |
| `autofocus` | 페이지 로드 시 자동으로 커서 위치 |
| `autocomplete="off"` | 브라우저 자동완성 끄기 |

**GET vs POST**

|  | **GET** | **POST** |
| --- | --- | --- |
| 데이터 위치 | **URL 뒤에 붙음** `?q=검색어` | 요청 **본문(body)** 에 담김 |
| 주 용도 | 조회, 검색 | 생성, 로그인, 회원가입 |
| 북마크/공유 | 가능 | 불가 |
| 민감 정보 | ❌ 절대 금지 (URL·기록에 남음) | 상대적으로 적합 (단, HTTPS 필수) |

GET 실습에서 "hello"를 검색하면 주소창이 `https://google.com/search?q=hello`가 되는 것을 확인할 수 있다. → `name="q"`가 키, 입력값이 값.

> 💡 `<form>` 안의 `<button>`은 `type`을 안 쓰면 기본값이 **`type="submit"`** 이라 누르면 폼이 전송된다. 전송이 아닌 버튼이면 `type="button"`을 명시할 것.
> 

---
### **1-12. id 속성**

**한 페이지에서 유일한 식별자** — 특정 요소 하나를 정확히 지정할 때 사용한다.

```
<div id="header"></div>   ✅
<div id="header"></div>
<p id="header"></p>       ❌ 같은 id 중복
```

중복해도 화면은 보통 멀쩡히 나오지만, JS(`getElementById`)나 `<label for>`, `#링크`가 엉뚱한 요소를 가리키게 된다.

---
### **1-13. 회원가입 화면 + `<label>` + 정규식**

```
<form>
    <label for="email">Email</label>
    <input id="email" type="email" required placeholder="example@email.com">
    <br>

    <label for="phone">Phone</label>
    <input
        id="phone" type="text" required
        placeholder="010-1234-5678"
        pattern="010-[0-9]{4}-[0-9]{4}"
        title="010-1234-5678 형식으로 입력하세요"
    >
    <br>
    <button type="submit">Submit</button>
</form>
```

- **`<label for="email">`** 과 **`<input id="email">`** 이 연결된다 → 라벨 글자를 클릭해도 입력창에 커서가 가고, 스크린 리더가 입력창 이름을 읽어 준다.
- **`type="email"`** : `@`가 없으면 제출 시 브라우저가 경고. 모바일에서는 `@` 키가 있는 키보드가 뜸
- **`required`** : 비어 있으면 제출 불가
- **`pattern`** : 입력값이 정규식과 맞지 않으면 제출 불가. `title`의 문구가 경고 메시지로 표시됨

**정규식(Regular Expression) 기초**

| **기호** | **의미** | **기호** | **의미** |
| --- | --- | --- | --- |
| `.` | 아무 문자 1개 | `[]` | 문자 집합 (`[abc]` = a, b, c 중 하나) |
| `*` | 0번 이상 | `[0-9]` | 0부터 9까지 숫자 하나 |
| `+` | 1번 이상 | `\d` | 숫자 하나 (`[0-9]`와 같음) |
| `?` | 0 또는 1번 | `^` | 문자열 시작 |
| `{n}` | n번 반복 | `$` | 문자열 끝 |

`010-[0-9]{4}-[0-9]{4}` 해석: "010-" + 숫자 4개 + "-" + 숫자 4개 (HTML의 `pattern`은 자동으로 전체 일치를 검사하므로 `^`, `$`를 붙이지 않아도 된다.)

> 💡 **브라우저 검증은 편의 기능일 뿐 보안이 아니다.** 사용자는 개발자 도구로 `required`나 `pattern`을 지우고 제출할 수 있으므로, **서버에서도 반드시 다시 검증**해야 한다.
> 
> 
> 그 밖의 유용한 `type`: `password`(입력값 가림), `number`, `date`, `checkbox`, `radio`, `file`, `tel`(모바일 숫자 키패드)
> 

---
### **1-14. class 속성**

**공통된 특징을 가진 요소들을 묶는 이름표** — 여러 요소에 같은 이름을 반복 사용할 수 있습니다.

```
<p class="text">Hello</p>
<p class="text">World</p>
<p class="text highlight">한 요소에 여러 class (공백으로 구분)</p>
```

|  | **id** | **class** |
| --- | --- | --- |
| 중복 | 페이지에 **하나만** | **여러 번** 사용 가능 |
| 한 요소에 여러 개 | 불가 | 가능 (`class="a b c"`) |
| CSS 선택자 | `#header` | `.text` |
| 주 용도 | JS로 특정 요소 선택, 페이지 내 링크 | **CSS 스타일 적용** |

→ 스타일은 거의 항상 **class 기준**으로 적용한다.

---
### **1-15. `<div>`와 시맨틱 태그**

```
<div class="intro">
    <h1>What is HTML?</h1>
    <p>HTML is Hypertext Markup Language</p>
</div>
```

`<div>`는 **의미 없는 묶음 상자**다. 레이아웃과 스타일링을 위해 요소를 그룹으로 묶을 때 쓴다.

**시맨틱(Semantic) HTML** = 태그 자체에 **의미**를 담는 방식

| **태그** | **의미** |
| --- | --- |
| `<header>` | 상단 영역 (로고, 제목, 내비게이션) |
| `<nav>` | 내비게이션 메뉴 |
| `<main>` | 페이지의 핵심 콘텐츠 (페이지당 하나) |
| `<section>` | 주제별 구역 |
| `<article>` | 독립적인 글 (블로그 글, 뉴스 기사) |
| `<aside>` | 부가 정보 (사이드바) |
| `<footer>` | 하단 정보 (저작권, 연락처) |

```
div 남용 (div soup)              시맨틱 HTML
<div class="header">            <header>
<div class="nav">               <nav>
<div class="content">           <main>
<div class="footer">            <footer>
```

**왜 시맨틱하게 써야 하나?**

1. **접근성**: 스크린 리더가 "내비게이션", "본문"으로 바로 이동 가능
2. **검색엔진 최적화(SEO)**: 검색엔진이 페이지 구조를 더 잘 이해
3. **가독성/유지보수**: 코드만 봐도 각 영역의 역할이 보임

> 화면 모양은 `<div>`와 똑같다. 차이는 **의미**뿐이며, 그 의미가 사람과 기계 모두에게 정보가 된다.
> 

---

## **2. CSS 기초**

### **2-1. CSS란?**

**Cascading Style Sheets** — HTML 요소의 **모양과 배치**를 정하는 언어

- 글자: 색, 크기, 폰트
- 여백, 정렬, 위치
- 레이아웃: Flex, Grid (요소를 화면에 어떻게 배치할지)
- 반응형 디자인 (화면 크기에 따라 레이아웃 자동 변경)

> "Cascading(폭포처럼 흐르는)" — 여러 규칙이 겹칠 때 **우선순위와 순서에 따라 위에서 아래로 덮어쓰며 적용**된다는 뜻.
> 

---
### **2-2. CSS를 적용하는 3가지 방법**

**① 인라인 스타일 — 태그에 직접 한 줄로**

```
<p style="font-size: x-large; font-weight: bold; text-align: center;">Dong-hyeon Shin</p>
```

**② 내부 스타일 시트 — `<head>` 안 `<style>`**

```
<head>
  <style>
    p { color: red; }
  </style>
</head>
```

**③ 외부 스타일 시트 — 별도 `.css` 파일** ⭐ 실무 표준

```
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

| **방법** | **장점** | **단점** |
| --- | --- | --- |
| 인라인 | 빠른 테스트 | 재사용 불가, 우선순위가 너무 높아 덮어쓰기 어려움 |
| 내부 | 한 파일에서 관리 | 여러 페이지에서 공유 불가 |
| **외부** | **여러 페이지가 한 파일 공유**, HTML(구조)와 CSS(디자인) 분리, 브라우저 캐시 | 파일이 하나 더 생김 |
