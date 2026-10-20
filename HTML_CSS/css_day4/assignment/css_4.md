# 4_CSS기초_Grid·Bootstrap

## [목차]

---

> 지난 글에서 position과 Flexbox로 박스를 배치했다면,
이번 글에서는 **페이지 구조 자체를 설계하는 Grid**와, CSS를 직접 짜지 않고도 화면을 만드는 **Bootstrap**을 정리한다.
> 

이번 글에서 다루는 내용

1. Grid — 2차원 레이아웃 시스템
2. 실습: Grid로 사진 갤러리 만들기
3. Bootstrap — 클래스 이름만으로 만드는 UI
4. Bootstrap 실습: 레이아웃 · Navbar · Modal
5. Bootstrap 사용 시 주의점

---

### **1. Grid**

> **행(row)과 열(column)을 동시에** 제어하는 2차원 레이아웃 시스템
화면 전체 구조(layout)를 만들기 위한 도구
> 

#### **왜 Grid가 필요한가**

| **도구** | **잘하는 것** | **한계** |
| --- | --- | --- |
| position | 요소 하나를 원하는 위치에 놓기 | 배치 제어는 되지만 **레이아웃용은 아님** |
| Flexbox | **한 방향(1차원)** 정렬 | 가로·세로를 동시에 맞추기 어려움 |
| **Grid** | **페이지 구조 자체를 설계** | — |

> 💡 실무에서는 둘을 함께 쓴다. **큰 틀(페이지 구조)은 Grid**, **그 안의 작은 정렬(버튼 줄, 메뉴)은 Flexbox**가 일반적이다.
> 

#### **1-1. 기본 개념**

| **용어** | **뜻** |
| --- | --- |
| **Grid Container** | display: grid가 적용된 **부모** |
| **Grid Item** | container의 **직계 자식** 요소 |

Flexbox와 마찬가지로 **배치는 container(부모)가 결정**한다.

#### **1-2. 실습 준비**

```css
code grid.html
```

```css
<div class="container">
  <div class="item">A</div>
  <div class="item">B</div>
  <div class="item">C</div>
  <div class="item">D</div>
  <div class="item">E</div>
  <div class="item">F</div>
</div>
```

```css
.container {
  border: 2px solid black;
  margin-bottom: 40px;
}
.item {
  height: 80px;
  border: 1px solid black;
  display: flex;             /* 글자를 박스 정가운데에 */
  align-items: center;
  justify-content: center;
}
```

아직은 A~F가 세로로 한 줄씩 쌓여 있다. 이제 `.container`에 grid를 적용한다.

#### **1-3. 열(column) 만들기**

```css
.container {
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;   /* 4칸, 각 25% */
}
```

같은 값을 반복할 때는 `repeat()`로 줄일 수 있다.

```css
grid-template-columns: repeat(4, 25%);      /* 위와 동일 */
```

비율로 나누고 싶다면 **`fr`(fraction, 남은 공간의 비율)** 단위를 쓴다.

```css
grid-template-columns: 1fr 2fr 1fr;         /* 1 : 2 : 1 비율로 3칸 */
```

| **값** | **의미** |
| --- | --- |
| 25% 25% 25% 25% | 4칸, 각각 너비의 25% |
| repeat(4, 25%) | 위와 동일 (반복 축약) |
| 1fr 2fr 1fr | 3칸, 가운데 칸이 양옆의 2배 |

> 💡 `%`는 `gap`을 더하면 전체 너비를 넘칠 수 있지만, `fr`은 **gap을 뺀 나머지**를 나누므로 넘치지 않는다. 그래서 보통 `fr`을 더 많이 쓴다.
> 

#### **1-4. 행(row)과 간격**

```css
grid-template-rows: 80px 80px;   /* 1행, 2행 높이를 각각 지정 */
grid-auto-rows: 80px;            /* 행이 몇 개든 자동으로 80px */
gap: 10px;                       /* 칸 사이 간격 (행·열 모두) */
```

| **속성** | **역할** |
| --- | --- |
| grid-template-rows | 지정한 개수만큼 행 높이를 **직접** 정함 |
| grid-auto-rows | 아이템이 늘어나 **자동으로 생기는 행**의 높이 |
| gap | 칸과 칸 사이 간격 |

### **2. 실습: Grid로 사진 갤러리 만들기**

```css
code gallery.html
code gallery_style.css
```

#### **2-1. HTML — Emmet으로 한 번에**

`<head>`에 CSS를 연결하고,

```css
<link rel="stylesheet" href="gallery_style.css">
```

`<body>` 안에서 `Emmet` 약어 두 줄을 입력한 뒤 Tab을 누른다.

```css
.container
.item.img$*6>img[src="" alt="Img$"]
```

결과:

```css
<div class="container">
  <div class="item img1"><img src="" alt="Img1"></div>
  <div class="item img2"><img src="" alt="Img2"></div>
  <div class="item img3"><img src="" alt="Img3"></div>
  <div class="item img4"><img src="" alt="Img4"></div>
  <div class="item img5"><img src="" alt="Img5"></div>
  <div class="item img6"><img src="" alt="Img6"></div>
</div>
```

`src=""`에는 원하는 이미지 주소를 넣는다. (예: [Unsplash](https://unsplash.com/)에서 이미지 주소 복사)

#### **2-2. grid-template-areas — 칸에 이름 붙여 배치하기**

```css
.container {
  padding: 10%;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;     /* 3열 */
  grid-template-rows: repeat(4, 200px);   /* 4행, 각 200px */
  grid-template-areas:
    "img1 img3 img3"
    "img1 img4 img6"
    "img2 img2 img6"
    "img5 img5 img5";
}
```

`grid-template-areas`는 **문자열 한 줄이 한 행**, **단어 하나가 한 칸**이다.
같은 이름을 이어서 쓰면 그 칸들이 **하나로 합쳐진다.** 위 코드를 그림으로 보면 다음과 같다.

```css
┌──────┬─────────────┐
│      │    img3     │
│ img1 ├──────┬──────┤
│      │ img4 │      │
├──────┴──────┤ img6 │
│    img2     │      │
├─────────────┴──────┤
│        img5        │
└────────────────────┘
```

| **이름** | **차지하는 영역** |
| --- | --- |
| img1 | 1열, 1~2행 (세로로 2칸) |
| img2 | 3행, 1~2열 (가로로 2칸) |
| img3 | 1행, 2~3열 (가로로 2칸) |
| img4 | 2행 2열 (1칸) |
| img5 | 4행 전체 (가로로 3칸) |
| img6 | 3열, 2~3행 (세로로 2칸) |

이제 각 아이템에 **어느 이름의 영역에 들어갈지** 알려준다.

```css
.img1 { grid-area: img1; }
.img2 { grid-area: img2; }
.img3 { grid-area: img3; }
.img4 { grid-area: img4; }
.img5 { grid-area: img5; }
.img6 { grid-area: img6; }
```

> ⚠️ 영역은 반드시 **직사각형**이어야 한다. ㄱ자나 ㄴ자 모양으로 이름을 배치하면 해당 선언 전체가 무시된다.
> 

#### **2-3. 이미지를 칸에 꽉 채우기**

```css
.container .item img {
  width: 100%;
  height: 100%;
  object-fit: cover;      /* 비율 유지하며 칸을 꽉 채우고, 넘치는 부분은 잘라냄 */
  transition: 0.5s;       /* 아래 hover 효과가 0.5초 동안 부드럽게 */
  border-radius: 10px;
}
```

> ⚠️ **`width: 100%`를 빼먹으면 Grid가 안 먹는 것처럼 보인다.**
이미지는 기본적으로 **원본 크기**(예: 1690px)로 표시되고, `1fr` 칸은 **안의 내용보다 좁아지지 않는다.** 그래서 칸이 이미지 크기만큼 늘어나 화면을 넘쳐버린다. 이미지에는 꼭 `width: 100%`를 주자.
> 

| **`object-fit` 값** | **결과** |
| --- | --- |
| `fill` (기본값) | 칸에 맞춰 늘림 → 비율이 찌그러짐 |
| `contain` | 비율 유지, 이미지 전체가 보이게 → 빈 공간 생김 |
| **`cover`** | 비율 유지, 칸을 꽉 채움 → 넘치는 부분 잘림 |

#### **2-4. 마우스를 올린 사진만 강조하기**

```css
.container:hover .item img:not(:hover) {
  filter: grayscale(1);   /* 흑백 */
  opacity: 0.5;           /* 반투명 */
}
```

선택자를 읽어보면 다음과 같다.

> **갤러리(`.container`)에 마우스가 올라가 있을 때**,
**마우스가 올라가 있지 않은(`:not(:hover)`) 이미지들**을 흑백 + 반투명으로
> 

결과적으로 **마우스를 올린 사진 하나만 컬러로 선명하게** 남는다. 앞에서 준 `transition: 0.5s` 덕분에 부드럽게 바뀐다.

### **3. Bootstrap (부트스트랩)**

> CSS & JavaScript **UI 프레임워크**
→ **"CSS를 직접 안 만들어도 된다"**
> 

반응형 웹을 빠르게 만들기 위한 도구

미리 정의된 **Grid, Component, Utility class** 제공

**클래스 이름만으로** 레이아웃 구성

일정한 UI 품질 유지

#### **3-1. 설치 (CDN)**

```css
code bootstrap.html
```

[getbootstrap.com](https://getbootstrap.com/)에서 CDN 링크를 복사해 <head>에 넣는다.

```css
<link href="<https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css>"
      rel="stylesheet"
      integrity="(공식 사이트에서 복사)"
      crossorigin="anonymous">
```

> 💡 i`ntegrity`는 **파일이 중간에 바뀌지 않았는지 검사하는 지문 값**이다. 직접 타이핑하지 말고 공식 사이트의 코드를 그대로 복사해야 한다.
> 

#### **3-2. 자주 쓰는 클래스**

1. **Flex** — 지금까지 CSS로 쓰던 Flexbox를 클래스로

```css
<div class="d-flex justify-content-center">
  <div>알림</div>
  <div class="badge bg-danger">5</div>
</div>
```

| **클래스** | **CSS로 쓰면** |
| --- | --- |
| d-flex | display: flex; |
| justify-content-center | justify-content: center; |
| badge bg-danger | 빨간 숫자 배지 |
1. **Card**

```css
<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">제목</h5>
    <p class="card-text">설명 텍스트</p>
    <a href="#" class="btn btn-primary">이동</a>
  </div>
</div>
```

1. **Button** — 색 이름만 바꾸면 된다

```css
<button class="btn btn-primary">확인</button>
<button class="btn btn-danger">취소</button>
<button class="btn btn-info">보류</button>
```

| **클래스** | **색** | **주 용도** |
| --- | --- | --- |
| btn-primary | 파랑 | 주요 동작 |
| btn-secondary | 회색 | 보조 동작 |
| btn-danger | 빨강 | 삭제·위험 |
| btn-info | 하늘색 | 정보 |
| btn-success / btn-warning | 초록 / 노랑 | 성공 / 경고 |

#### **3-3. Bootstrap Grid — 12칸 시스템**

- 한 줄을 **12칸**으로 나눈다.
- **`container` → `row` → `col**` 구조로 쓴다.

```css
<div class="container">
  <div class="row">
    <div class="col-6 bg-primary">왼쪽</div>     <!-- 12칸 중 6칸 -->
    <div class="col-6 bg-secondary">오른쪽</div> <!-- 12칸 중 6칸 -->
  </div>
</div>
```

| **클래스** | **차지하는 너비** |
| --- | --- |
| col-12 | 한 줄 전체 |
| col-6 | 절반 |
| col-4 | 1/3 |
| col-3 | 1/4 |

> 💡 CSS Grid의 `display: grid`와는 별개다. Bootstrap Grid는 **내부적으로 Flexbox**로 만들어져 있다.
> 

### **4. Bootstrap 실습**

#### **실습 1. 카드 3개를 한 줄에 배치**

```css
<div class="container mt-5">
  <div class="row">
    <div class="col-md-4">
      <div class="card p-3">카드 1</div>
    </div>
    <div class="col-md-4">
      <div class="card p-3">카드 2</div>
    </div>
    <div class="col-md-4">
      <div class="card p-3">카드 3</div>
    </div>
  </div>
</div>
```

| **클래스** | **의미** |
| --- | --- |
| mt-5 | margin-top (크기 5단계) |
| p-3 | padding (크기 3단계) |
| col-md-4 | **md(768px) 이상**에서는 4칸(1/3), 그보다 작으면 한 줄 전체 |

col-md-4 하나로 **반응형이 저절로 된다.** 넓은 화면에서는 카드 3개가 한 줄, 모바일에서는 세로로 쌓인다. 직접 `Media Query`를 쓸 필요가 없다.

| **접두어** | **적용 기준** |
| --- | --- |
| col- | 모든 크기 |
| col-sm- | 576px 이상 |
| col-md- | 768px 이상 |
| col-lg- | 992px 이상 |
| col-xl- | 1200px 이상 |

#### **실습 2. 반응형 Navbar 만들기**

Bootstrap은 **JS도 함께 제공**한다. 정해진 마크업과 `data-bs-*` 속성만 쓰면 **JS 코드를 직접 짜지 않아도** 메뉴 열고 닫기 같은 동작이 완성된다.

`</body>` 바로 위에 JS를 추가한다.

```css
<script src="<https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js>"></script>
```

**① 네비게이션 바 틀**

```css
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand text-white" href="#">MySite</a>
    <!-- ② 햄버거 버튼, ③ 메뉴가 여기 들어감 -->
  </div>
</nav>
```

**② 햄버거 버튼**

```css
<button
  class="navbar-toggler"
  data-bs-toggle="collapse"
  data-bs-target="#navMenu"
>
  <span class="navbar-toggler-icon"></span>
</button>
```

**③ 메뉴**

```css
<div class="collapse navbar-collapse" id="navMenu">
  <ul class="navbar-nav">
    <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
    <li class="nav-item"><a class="nav-link" href="#">About</a></li>
    <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
  </ul>
</div>
```

| **클래스 / 속성** | **역할** |
| --- | --- |
| `navbar-expand-lg` | **lg(992px) 이상**에서는 메뉴를 펼쳐 보여주고, 그보다 작으면 햄버거로 접음 |
| `navbar-dark bg-dark` | 어두운 배경 + 밝은 글자 |
| `data-bs-toggle="collapse"` | 클릭하면 접었다 폈다 하는 동작 |
| `data-bs-target="#navMenu"` | 접고 펼 대상 → id="navMenu"인 요소 |
| `nav-link active` | 현재 페이지 표시 |

> 💡 직접 만들려면 Media Query + JS 토글 함수가 필요했던 햄버거 메뉴를 **속성 두 개(data-bs-toggle, data-bs-target)로** 끝낸다. 버튼의 data-bs-target 값과 메뉴의 id가 **반드시 일치**해야 한다.
> 

#### **실습 3. Modal(팝업창) 만들기**

**① 모달 여는 버튼**

```css
<div class="container mt-5 text-center">
  <button
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
  >
    모달 열기
  </button>
</div>
```

**② 모달 본체**

```css
<div class="modal fade" id="exampleModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">

      <!-- 헤더 -->
      <div class="modal-header">
        <h5 class="modal-title">확인</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <!-- 본문 -->
      <div class="modal-body">
        정말로 삭제하시겠습니까?
      </div>

      <!-- 푸터 -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
        <button class="btn btn-danger">삭제</button>
      </div>

    </div>
  </div>
</div>
```

| **클래스 / 속성** | **역할** |
| --- | --- |
| `modal fade` | 모달 + 서서히 나타나는 효과 |
| `modal-dialog-centered` | 화면 세로 가운데에 표시 |
| `modal-header` / `modal-body` / `modal-footer` | 제목 / 내용 / 버튼 영역 |
| `data-bs-toggle="modal"` | 클릭하면 모달 열기 |
| `data-bs-dismiss="modal"` | 클릭하면 모달 닫기 (✕, 취소 버튼) |
| `tabindex="-1"` | 키보드(Esc 등) 접근 처리를 위한 속성 |

구조를 정리하면 다음과 같다.

```css
.modal                  ← 화면 전체를 덮는 배경
└── .modal-dialog       ← 위치·크기
    └── .modal-content  ← 흰 상자
        ├── .modal-header
        ├── .modal-body
        └── .modal-footer
```

### **5. Bootstrap 사용 시 주의점**

| **주의점** | **설명** |
| --- | --- |
| **클래스 남용 → 가독성 저하** | `class="d-flex justify-content-between align-items-center mt-3 mb-2 px-4 ..."`처럼 길어지면 읽기 어렵다 |
| **커스텀 디자인 한계** | 기본 모양이 정해져 있어서 "Bootstrap 티"가 나기 쉽고, 크게 바꾸려면 오히려 CSS를 덮어써야 한다 |
| **실서비스에서는 부분 사용** | 일부 컴포넌트만 쓰거나 **Tailwind CSS**로 전환하는 경우가 많다 |

---

### **마무리 요약**

- **Grid**: 행과 열을 동시에 다루는 2차원 레이아웃
    - grid-template-columns / rows로 칸 만들기, fr로 비율 나누기, gap으로 간격
    - grid-template-areas + grid-area로 **이름을 붙여** 복잡한 배치도 그림처럼
    - 이미지에는 꼭 width: 100% + object-fit: cover
- **Bootstrap**: 클래스 이름만으로 UI 완성
    - Grid는 **12칸**, container → row → col, col-md-4처럼 접두어로 반응형
    - data-bs-toggle / data-bs-target / data-bs-dismiss만으로 Navbar·Modal 동작
    - 편하지만 클래스 남용과 디자인 한계에 주의

---

추가적으로 Emmet(VS Code에 기본으로 들어 있는 HTML/CSS 자동완성 기능)이 궁금해서 정리해보았다.

[emmet](https://app.notion.com/p/emmet-02723efef9e583d5af328171c71fae56?pvs=21)