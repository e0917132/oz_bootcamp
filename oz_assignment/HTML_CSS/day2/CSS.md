# HTML / CSS 기본 개념 정리 (2)

## **1. CSS 기초 복습**

### **1-1. CSS란?**

**Cascading Style Sheets** — HTML 요소의 **모양과 배치**를 정하는 언어

- 글자: 색, 크기, 폰트
- 여백, 정렬, 위치
- 레이아웃: Flex, Grid (요소를 화면에 어떻게 배치할지)
- 반응형 디자인 (화면 크기에 따라 레이아웃 자동 변경)

> "Cascading(폭포처럼 흐르는)" — 여러 규칙이 겹칠 때 **우선순위와 순서에 따라 위에서 아래로 덮어쓰며 적용**된다는 뜻.
> 

---

### **1-2. CSS를 적용하는 3가지 방법**

**① 인라인 스타일 — 태그에 직접**

```css
<p style="font-size: x-large; font-weight: bold; text-align: center;">Dong-hyeon Shin</p>
```

**② 내부 스타일 시트 — `<head>` 안 `<style>`**

```css
<head>
  <style>
    p { color: red; }
  </style>
</head>
```

**③ 외부 스타일 시트 — 별도 `.css` 파일** ⭐ 실무 표준

```css
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

| **방법** | **장점** | **단점** |
| --- | --- | --- |
| 인라인 | 빠른 테스트 | 재사용 불가, 우선순위가 너무 높아 덮어쓰기 어려움 |
| 내부 | 한 파일에서 관리 | 여러 페이지에서 공유 불가 |
| **외부** | **여러 페이지가 한 파일 공유**, HTML(구조)와 CSS(디자인) 분리, 브라우저 캐시 | 파일이 하나 더 생김 |

**CSS 기본 문법**

```css
selector{ property: value; property2: value2; }
/* 선택자  { 속성: 값; } */

header {
    font-size: x-large;   /* 세미콜론으로 구분 */
    font-weight: bold;
}
```

---

## 2. CSS 기본 개념

### **2-1. 선택자(Selector)**

**어떤 HTML 요소에 스타일을 적용할지** 지정하는 규칙이다.

**기본 선택자**

| **선택자** | **예** | **의미** |
| --- | --- | --- |
| 전체 | `*` | 모든 요소 |
| 태그 | `div` | 모든 `<div>` |
| 클래스 | `.text` | `class="text"`인 요소 |
| ID | `#header` | `id="header"`인 요소 |
| 그룹 | `h1, h2` | h1과 h2 모두 |

**결합자(관계) 선택자**

| **선택자** | **이름** | **의미** |
| --- | --- | --- |
| `div p` | 자손 | div 안의 모든 p (깊이 무관) |
| `div > p` | 자식 | div **바로 아래** p만 |
| `div + p` | 인접 형제 | div **바로 다음** p 하나 |
| `div ~ p` | 일반 형제 | div 뒤에 오는 모든 형제 p |

```css
<div>
  <p>A</p>           ← div > p ✅, div p ✅
  <section>
    <p>B</p>         ← div p ✅ (손자도 포함), div > p ❌
  </section>
</div>
<p>C</p>             ← div + p ✅ (바로 다음 형제), div ~ p ✅
<p>D</p>             ← div ~ p ✅ (뒤의 모든 형제)
```

**속성 선택자**

| **선택자** | **의미** |
| --- | --- |
| `a[href]` | href 속성을 **가진** a |
| `input[type="text"]` | type이 정확히 "text"인 input |
| `a[href^="https"]` | href가 "https"로 **시작** |
| `img[src$=".png"]` | src가 ".png"로 **끝남** |

**가상 클래스(pseudo-class)** — 요소의 **상태**로 선택

| **선택자** | **의미** |
| --- | --- |
| `:hover` | 마우스를 올렸을 때 |
| `:focus` | 포커스를 가졌을 때 (입력창 클릭, Tab 이동) |
| `:active` | 클릭하고 있는 순간 |
| `:nth-child(2)` | 부모 기준 2번째 자식 (`odd`, `even`, `2n+1`도 가능) |
| `:first-child`, `:last-child` | 첫/마지막 자식 (보충) |
| `:not(선택자)` | 해당 조건이 **아닌** 요소 (갤러리 실습에서 사용) |

---

### **2-2. 선택자 우선순위(Specificity)**

같은 요소에 여러 규칙이 겹치면 **더 구체적인 선택자**가 이긴다.

```
!important  >  인라인 style  >  #id  >  .class / [속성] / :가상클래스  >  태그 / ::가상요소  >  *
```

**규칙 요약: id > class > tag, 점수가 같으면 나중에 작성한 코드가 승리**

<aside>
💡

**점수로 계산하기** — 선택자를 (id 개수, class·속성·가상클래스 개수, 태그·가상요소 개수)로 세서 **왼쪽 자리부터 비교**한다.

| **선택자** | **점수** |
| --- | --- |
| `p` | (0, 0, 1) |
| `.text` | (0, 1, 0) |
| `div p.text` | (0, 1, 2) |
| `.container .item img` | (0, 2, 1) |
| `#header` | (1, 0, 0) |
| `#header .nav a:hover` | (1, 2, 1) |

class가 10개여도 id 1개를 이길 수 없다(자리 올림이 없음).

</aside>

<aside>
💡

 **!important** 

!important는 값 뒤에 붙여 **그 선언을 최우선으로 올리는** 키워드다.

```css
p {
  color: red!important;
}

#title {
  color: blue;        /* p 규칙보다 구체적이지만, !important 가 이김 → 빨간색 */
}
```

⚠️ !important는 모든 우선순위를 무시하므로 디버깅을 어렵게 만든다. 최후의 수단으로만 사용할 것. 스타일이 적용되지 않을 때는 개발자 도구 Elements → **Styles 패널**에서 줄이 그어진(덮어써진) 규칙을 확인하면 원인을 바로 찾을 수 있다.

</aside>

---

### **2-3. 박스 모델(Box Model)**

**모든 HTML 요소는 사각형 박스**이며, 안쪽부터 네 겹으로 구성된다.

```
┌──────────────── margin (바깥 여백, 투명) ────────────────┐
│  ┌─────────────── border (테두리) ───────────────┐      │
│  │  ┌──────────── padding (안쪽 여백) ─────────┐  │      │
│  │  │                                         │  │      │
│  │  │          content (width × height)       │  │      │
│  │  │                                         │  │      │
│  │  └─────────────────────────────────────────┘  │      │
│  └───────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

1. **박스 모델의 영역**
    
    
    | **영역** | **역할** | **배경색 적용** |
    | --- | --- | --- |
    | content | 실제 내용 | O |
    | padding | 내용과 테두리 사이 | O (배경색이 칠해짐) |
    | border | 테두리 | 테두리 색 |
    | margin | 다른 요소와의 간격 | X (투명) |
2. **박스 모델에서 사용할 수 있는 속성 한 눈에 보기**
    
    
    | **분류** | **속성** | **역할** |
    | --- | --- | --- |
    | 크기 | `width`, `height` | 가로·세로 크기 |
    |  | `min-width`, `max-width`, `min-height`, `max-height` | 크기의 최소·최대 제한 |
    | 크기 계산 | `box-sizing` | `width`에 테두리·패딩을 포함할지 결정 (`content-box`, `border-box`) |
    | 안쪽 여백 | `padding` (`padding-top`, `padding-right`, `padding-bottom`, `padding-left`) | 내용과 테두리 사이 간격 |
    | 바깥 여백 | `margin` (`margin-top`, `margin-right`, `margin-bottom`, `margin-left`) | 박스 바깥 간격, `margin: 0 auto`로 가운데 정렬 |
    | 테두리 | `border` (축약형) | 두께·스타일·색을 한 번에 지정 |
    |  | `border-width`, `border-style`, `border-color` | 테두리를 각각 지정 |
    |  | `border-radius` | 모서리 둥글게 |
    | 배경 | `background-color`, `background-image` | 박스 배경색, 배경 이미지 |
    | 그림자 | `box-shadow` | 박스 그림자 |
    | 넘침 | `overflow` (`visible`, `hidden`, `scroll`, `auto`) | 내용이 박스를 넘칠 때 처리 |
    | 표시 방식 | `display` (`block`, `inline`, `inline-block`, `flex`, `grid`, `none`) | 박스가 한 줄을 차지할지, 옆에 붙을지 결정 |
    | 위치 | `position`과 `top`, `right`, `bottom`, `left`, `z-index` | 박스를 어디에 놓을지 결정 |
3. **width와 height — 박스의 가로·세로 크기**

```
.box {
  width: 200px;     /* 가로 크기 */
  height: 100px;    /* 세로 크기 */
}
```

- **기본 특징**
    - `width`는 가로, `height`는 세로 크기를 정한다.
    - 값은 `px`, `%`, `rem`, `vw`, `vh` 등으로 줄 수 있다. `%`는 **부모 요소** 크기 기준, `vw`/`vh`는 **화면(viewport)** 크기 기준.
    - 블록 요소(`<div>`, `<p>` 등)는 `width`를 따로 주지 않으면 부모 가로폭을 가득 채우고, `height`를 주지 않으면 내용만큼 자동으로 늘어난다.

```
.parent { width: 400px; }
.child  { width: 50%; }   /* 부모 400px의 50% = 200px */
```

```
.full { width: 100%; }     /* 부모 너비 전체 */
.hero { height: 100vh; }   /* 화면 높이 전체 (브라우저 창 크기) */
```

- **최소·최대 값**
    - `min-width`, `max-width`, `min-height`, `max-height`로 범위를 지정할 수 있다. 반응형 디자인에서 자주 쓴다.
        
        ```
        .card {
          width: 100%;         /* 기본은 부모 너비 */
          max-width: 600px;    /* 화면이 넓어도 600px을 넘지 않음 */
          min-height: 120px;   /* 내용이 적어도 최소 120px 확보 */
        }
        ```
        
        > 💡 **`max-width: 100%`는 이미지의 기본 패턴이다.** `img { max-width: 100%; height: auto; }`로 주면 이미지가 부모보다 커지지 않고, 세로 비율도 유지된다.
        > 

- **height는 내용이 결정하는 경우가 많다**
    - `width`는 보통 직접 지정하지만, `height`는 대부분 **내용(글자, 이미지)** 높이만큼 자동으로 정해지게 두는 게 편하다. `height: 100px`처럼 고정하면 내용이 넘칠 수 있다.
    - `overflow`는 내용이 박스를 넘칠 때의 처리 방식이다. `visible`(기본, 그대로 보임), `hidden`(잘림), `scroll`(스크롤), `auto`(필요할 때만 스크롤)를 쓴다.
        
        ```
        .note {
          height: 100px;      /* 고정 높이 */
          overflow: auto;     /* 넘치는 내용은 스크롤로 보여 줌 */
        }
        ```
        
    
    > ⚠️ **인라인 요소에는 적용 안 됨**: `<span>`, `<a>` 같은 인라인 요소는 `width`, `height`를 줘도 무시된다. `display: inline-block`이나 `block`으로 바꿔야 적용됨.
    > 
    
1. **크기 계산** 

- 기본값 `box-sizing: content-box`에서는 **`width`가 content만의 크기**다.

```css
.box {
	box-sizing: content-box;   /* 기본값이라 생략해도 동일 */
  margin: 20px;
  border: 5px solid black;
  padding: 50px;
  width: 100px;
}
```

```css
실제 가로 = width 100 + padding 50×2 + border 5×2 = 210px  (margin 제외)
```

width를 100px로 줬는데 210px가 되는 문제 → 레이아웃 계산이 매우 불편하다.

- **해결: `box-sizing: border-box`**

```css
.box {
  box-sizing: border-box;  /* width 안에 padding, border 포함 */
  margin: 20px;
  border: 5px solid black;
  padding: 50px;
  width: 100px;
}
```

`border-box`에서는 **width = content + padding + border**. 
즉 `width: 100px`이면 화면에서도 정확히 100px이고, padding과 border가 그 안에서 차지한다. 거의 모든 프로젝트가 CSS 첫 줄에 이 코드를 넣는다. (Bootstrap도 기본 적용)

- **실무에서 자주 쓰는 전역 설정**
    
    ```css
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    ```
    
    - 방법 1. Inline CSS (`<head>` 안의 `<style>`)
        
        ```css
        <!DOCTYPE html>
        <html>
          <head>
            <title>My Page</title>
            <style>
              *,
              *::before,
              *::after {
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>
            ...
          </body>
        </html>
        ```
        
    - 방법 2. External CSS (실무에서 더 많이 씀)
        
        `style.css` 파일에 위 CSS를 넣고, `<head>`에서 불러온다.
        
        ```css
        <head>
        <link rel="stylesheet" href="style.css">
        </head>
        ```
        
    - 이 규칙이 `*`로 모든 요소를 선택하기 때문에, 특정 요소에만 쓰는 게 아니라 페이지 전체에 한 번만 두면 된다. 보통 CSS 파일의 맨 위에 둔다. `*::before`, `*::after`는 `::before`, `::after`로 만든 가상 요소에도 같은 규칙을 적용하라는 뜻.

<aside>
💡

**<참고> 여백 축약 표기** (시계 방향: 위 → 오른쪽 → 아래 → 왼쪽)

```css
margin: 10px;/* 네 방향 모두 */
margin: 10px 20px;/* 위아래 10, 좌우 20 */
margin: 10px 20px 30px;/* 위 10, 좌우 20, 아래 30 */
margin: 10px 20px 30px 40px;/* 위, 오른쪽, 아래, 왼쪽 */
margin: 0 auto;/* 블록 요소 가로 가운데 정렬 (width 필요) */
```

⚠️ **마진 상쇄(margin collapsing)**: 위아래로 붙은 두 블록의 세로 margin은 더해지지 않고 **큰 쪽 하나만** 적용된다. (위 요소 margin-bottom 20 + 아래 요소 margin-top 30 → 간격 30)

</aside>

---

### **2-4. 자주 쓰는 스타일 속성**

```css
header {
    font-family: 'Times New Roman', Times, serif;  /* 글꼴 (대체 글꼴 목록) */
    font-size: x-large;            /* 글자 크기 */
    font-weight: bold;             /* 글자 두께 */
    text-align: center;            /* 가로 정렬 (블록 안의 글자) */
    background-color: red;
}
main {
    box-sizing: border-box;        /* width 안에 padding, border 포함 */
    width: 300px;
    padding: 50px;
    border: 2px solid blue;        /* 두께 스타일 색 (solid, dotted, dashed) */
}
```

- **`font-family` — 대체 글꼴 목록**

`'Times New Roman', Times, serif` → 첫 번째 글꼴이 없으면 두 번째, 그것도 없으면 마지막의 **일반 글꼴 계열**(`serif`, `sans-serif`, `monospace`)을 사용한다. 마지막은 항상 일반 계열로 끝낼 것. 공백이 있는 글꼴 이름은 따옴표로 감싼다.

`font-size`와 `font-family`는 **반드시 포함**해야 하고, `family`는 맨 뒤에 와야 한다. 생략한 속성은 기본값으로 초기화.

- **`font-weight` — 글자 두께**

```
p.title   { font-weight: bold; }    /* 굵게 (700과 같음) */
p.body    { font-weight: normal; }  /* 보통 (400과 같음, 기본값) */
p.caption { font-weight: 300; }     /* 숫자 값: 100(가장 얇음) ~ 900(가장 두꺼움) */
p.strong  { font-weight: bolder; }  /* 부모보다 한 단계 더 굵게 */
```

| **값** | **의미** |
| --- | --- |
| `normal` | 400, 기본값 |
| `bold` | 700 |
| `100` ~ `900` | 100 단위 숫자, 글꼴이 해당 굵기를 지원해야 실제로 달라짐 |
| `lighter` / `bolder` | 부모 굵기 기준으로 한 단계 가볍게 / 무겁게 |

> 💡 **주의**: 숫자 굵기는 **글꼴 파일에 그 굵기가 있을 때만** 차이가 난다. 예를 들어 `font-weight: 300`을 줘도 글꼴에 Light 버전이 없으면 보통 굵기와 똑같이 보인다. 구글 폰트를 쓸 때는 필요한 굵기(`family=Noto+Sans:wght@300;700`처럼)를 같이 불러와야 한다.
> 

- **`text-align` — 텍스트 가로 정렬**

```
.left    { text-align: left; }     /* 왼쪽 정렬 (기본값) */
.center  { text-align: center; }   /* 가운데 정렬 */
.right   { text-align: right; }    /* 오른쪽 정렬 */
.justify { text-align: justify; }  /* 양쪽 정렬 (줄 끝을 맞춤) */
```

```
<div style="text-align: center;">
  <p>이 문단과</p>
  <p>이 문단이 모두 가운데 정렬됩니다.</p>
</div>
```

**핵심 특징**

- `text-align`은 **블록 요소 안의 줄(line)** 을 정렬한다. 그래서 `<div>`, `<p>`, `<h1>` 같은 블록 요소에 주거나 그 부모에 줘야 한다. 이미지나 `<div>` 자체를 가운데 두려면 `text-align`이 아니라 `margin: 0 auto`나 Flexbox를 쓴다.
- `font-weight`, `text-align`은 **상속된다**. 부모에 주면 자식 텍스트에도 적용된다.
- 반대로 `margin`, `padding`, `border`는 상속되지 않는다.

> 💡 **자주 하는 실수**: `<img>`나 `<button>` 같은 인라인 요소를 `text-align`으로 가운데 두려고 하면 부모 쪽에 줘야 함. 대상(자식)이 아니라 **감싸는 블록 요소**에 줘야 동작한다.
> 

<aside>
💡

**한 번에 쓰기 (`font` 축약)**

```
header { font: bold2rem/1.4 'Noto Sans KR', sans-serif; }
/*      weight size/line-height family */
```

굵기와 정렬을 같이 묶어 보면 실제 역할은 이렇게 된다. `font`는 글꼴 관련, `text-align`은 배치 관련이라 서로 다른 역할이라는 점!

</aside>

---

### **2-5. 링크 꾸미기와 아이콘**

```
.github-link {
    font-size: small;
    color: gray;
    text-decoration: none;     /* 기본 밑줄 제거 */
}
.github-link:hover {
    text-decoration: underline; /* 마우스 올리면 밑줄 */
}
```

**Font Awesome** — 아이콘을 **글꼴처럼** 쓰는 라이브러리

```
<-- <head>의 <style> 안에 작성 -->
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" />

<-- <body>안 아이콘을 넣고 싶은 부분에 작성>
<a class="github-link" href="https://github.com/...">
    <i class="fa-brands fa-github"></i>GitHub
</a>
```

- 글꼴이므로 `color`, `font-size`로 색과 크기를 바꿀 수 있다.
- `fa-brands`(브랜드 로고), `fa-solid`(채워진 아이콘), `fa-regular`(선 아이콘) 계열이 있고, 아이콘 이름은 [fontawesome.com](https://fontawesome.com/)에서 검색한다.

> 💡 **CDN**(Content Delivery Network): 라이브러리 파일을 직접 다운로드하지 않고 전 세계에 분산된 서버의 주소를 `<link>`로 연결해 쓰는 방식이다. Bootstrap, Google Fonts도 같은 방식.
>