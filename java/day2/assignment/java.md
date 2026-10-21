# 5_JavaScript 기초

> 이번 글에서는 JavaScript 기본 문법을 처음부터 정리한다.
> 

이번 글에서 다루는 내용

1. JavaScript란? / 실행 방법 4가지
2. 변수와 자료형
3. 연산자
4. 조건문과 truthy / falsy
5. 반복문
6. 배열 · 객체 · Map
7. 함수

---

## **1. JavaScript란?**

> **웹 브라우저에서 동작하는 프로그래밍 언어**
> 

버튼 클릭, 입력 처리, 화면 변경을 담당한다.

| **기술** | **역할** |
| --- | --- |
| HTML | **구조** |
| CSS | **디자인** |
| JavaScript | **동작** |

### **1-1. 실행 방법 4가지**

| **방법** | **특징** | **주 용도** |
| --- | --- | --- |
| ① 브라우저 개발자 도구 (Console) | 입력 즉시 실행·결과 확인 | 문법 연습, 값 확인, 에러 확인 |
| ② `<script>` 태그 | HTML 안에 JS 작성 | 간단한 페이지 |
| ③ `.js` 파일 분리 | HTML과 JS를 따로 관리 | 실제 프로젝트 |
| ④ Node.js | 브라우저 없이 터미널에서 실행 | 문법 학습, 서버 개발 |

**① Console** — 브라우저에서 `F12`(Mac: `Cmd + Option + I`) → Console 탭

```
console.log(1 + 2);   // 3
```

**② `<script>` 태그** — 브라우저가 HTML을 읽다가 `<script>`를 만나면 그 자리에서 JS를 실행한다.

```
<script>
  console.log("Hello");
</script>
```

**③ 파일 분리**

```
<script src="app.js"></script>
```

```
// app.js
console.log("분리된 JS 파일");
```

> 💡 `<script>`는 보통 `</body>` 바로 위에 둔다. `<head>`에 두면 HTML 요소가 만들어지기 전에 JS가 실행되어, 요소를 찾지 못하는 문제가 생길 수 있다. (`<head>`에 두고 싶다면 `<script src="app.js" defer>`)
> 

**④ Node.js**

```
node app.js
```

### **1-2. Node.js 설치**

| **OS** | **방법** |
| --- | --- |
| macOS | `brew install node` |
| Windows | [nodejs.org](https://nodejs.org/ko/download/current)에서 설치 파일 다운로드 |

설치 확인:

```
node -v   # Node.js 버전
npm -v    # npm(Node.js용 패키지 관리자) 버전
```

### **1-3. 왜 Node.js로 연습하는가**

| **장점** | **설명** |
| --- | --- |
| 환경이 단순 | HTML·CSS 없이 JavaScript만 실행 |
| 실행이 간단 | `node app.js` 한 줄 |
| 에러 메시지가 명확 | 스택 트레이스가 직관적이라 원인 추적이 쉬움 |
| 초보자에게 친절 | 문법 오류를 바로 확인 가능 |

---

## **2. 변수와 자료형**

### **2-1. 변수**

> **값을 저장하는 공간.** 한 번 저장한 값을 재사용할 수 있다.
> 

```
let age= 20;
const username= "Alex";

console.log(age);        // 20
console.log(username);   // Alex
```

### **2-2. let vs const**

| **키워드** | **값 변경** | **권장** |
| --- | --- | --- |
| `let` | 가능 | 값이 바뀌어야 할 때만 |
| `const` | **불가** | **기본으로 사용** |

```
let count= 1;
count= 2;        // ⭕

const pi= 3.14;
// pi = 3.15;     // ❌ TypeError
```

> 💡 **일단 `const`로 쓰고, 바꿔야 할 때만 `let`으로** 바꾸는 습관이 좋다. 실수로 값을 덮어쓰는 버그를 막아준다. 옛날 코드에 보이는 `var`는 쓰지 않는다.
> 

### **2-3. 기본 자료형**

| **자료형** | **의미** | **예시** | **`typeof` 결과** |
| --- | --- | --- | --- |
| **number** | 숫자 (정수·실수 구분 없음) | `10`, `3.14` | `"number"` |
| **string** | 문자열 (`" "` 또는 `' '`) | `"Alex"`, `'Hello'` | `"string"` |
| **boolean** | 참 / 거짓 | `true`, `false` | `"boolean"` |
| **null** | **의도적으로** 비어 있음 | `null` | `"object"` ⚠️ |
| **undefined** | 값이 **아직 할당되지 않음** | 선언만 한 변수 | `"undefined"` |

```
let a= 10;
let b= 3.14;
console.log(a+ b);          // 13.14
console.log(typeof a);       // "number"

let isStudent= true;
console.log(typeof isStudent);   // "boolean"

let selectedUser= null;
console.log(typeof selectedUser); // "object" ← JS의 오래된 버그, 그대로 외워둔다

let score;
console.log(score);          // undefined
console.log(typeof score);   // "undefined"
```

> 💡 `typeof`는 값의 자료형을 문자열로 알려준다. 원래 교안 예시의 `typeof isAdult`는 선언되지 않은 변수라 `"undefined"`가 나온다. `boolean`을 확인하려면 `typeof isStudent`로 써야 한다. 문자열 안에 변수를 넣을 때는 **템플릿 리터럴**(백틱)이 편하다: ``안녕, ${username}!``
> 

### **2-4. null vs undefined**

|  | **누가 넣나** | **의미** |
| --- | --- | --- |
| `null` | **개발자가 직접** | "비어 있다"고 명시 |
| `undefined` | **자동으로** | "아직 정해지지 않음" |

```
let a= null;
let b;
console.log(a== b);    // true  (값만 비교하면 둘 다 "없음")
console.log(a=== b);   // false (타입이 다름)
```

---

## **3. 연산자**

> 값을 계산하거나 비교할 때 쓰는 기호
> 

### **3-1. 산술 연산자**

```
let a= 10;
let b= 3;
console.log(a+ b);   // 13  더하기
console.log(a- b);   // 7   빼기
console.log(a* b);   // 30  곱하기
console.log(a/ b);   // 3.333...  나누기
console.log(a% b);   // 1   나머지 (짝수·홀수 판별에 자주 씀)
```

### **3-2. 비교 연산자 — 결과는 항상 boolean**

```
console.log(10 > 5);    // true
console.log(10 < 5);    // false
console.log(10 >= 10);  // true
console.log(10 <= 9);   // false
```

### **3-3. 동등(`==`) vs 일치(`===`)**

| **연산자** | **비교 대상** | **권장** |
| --- | --- | --- |
| `==` | **값만** (타입을 자동 변환 후 비교) | ❌ |
| `===` | **값 + 타입** | ⭕ **항상 이것** |

```
console.log(10 == "10");    // true  ← 문자열 "10"을 숫자로 바꿔서 비교
console.log(10 === "10");   // false ← number와 string은 다름
```

> 같지 않음도 마찬가지로 `!=` 대신 **`!==`** 를 쓴다.
> 

### **3-4. 논리 연산자**

| **연산자** | **이름** | **뜻** |
| --- | --- | --- |
| `&&` | AND | 둘 다 true여야 true |
| `||` | OR | 하나만 true여도 true |
| `!` | NOT | true ↔ false 뒤집기 |

```
let age= 20;
let hasId= true;

console.log(age>= 19 && hasId);  // true
console.log(age< 19 || hasId);   // true
console.log(!hasId);              // false
```

### **3-5. 문자열 연산자**

```
let firstName= "Alex";
let lastName= "Kim";
console.log(firstName+ " " + lastName);   // "Alex Kim"
```

### **3-6. ⚠️ JavaScript vs Python — 자동 타입 변환**

```
"10" + 1   // "101"
```

| **언어** | **`"10" + 1` 결과** |
| --- | --- |
| JavaScript | `"101"` (숫자를 문자열로 **자동 변환**해서 이어붙임) |
| Python | **에러** (`TypeError`) |

JS는 타입 변환이 자동으로 일어나기 때문에, Python보다 **비교·연산에서 더 주의**가 필요하다. 그래서 `===`를 쓰는 것이다.

> 💡 반대로 `"10" - 1`은 `9`가 된다. `-`는 문자열에 쓸 수 없어서 숫자로 바꿔 계산하기 때문이다. 이런 혼란 때문에 숫자로 바꿀 땐 `Number("10")`처럼 **명시적으로** 변환하는 게 안전하다.
> 

---

## **4. 조건문 (if / else)**

> 조건이 `true`일 때만 코드를 실행하기 위한 문법
> 

```
if (조건식) {
  // 조건이 true일 때 실행
} else {
  // 조건이 false일 때 실행
}
```

```
let age= 20;

if (age>= 19) {
  console.log("성인");
} else {
  console.log("미성년자");
}
```

### **4-1. else if — 조건이 여러 개일 때**

```
if (조건1) {
  // 조건1이 true일 때
} else if (조건2) {
  // 조건1은 false, 조건2가 true일 때
} else {
  // 위 조건이 모두 false일 때
}
```

**예시: 점수로 학점 매기기**

```
let score= 85;

if (score>= 90) {
  console.log("A");
} else if (score>= 80) {
  console.log("B");   // ← 85점은 여기서 실행되고 끝
} else if (score>= 70) {
  console.log("C");
} else {
  console.log("F");
}
```

- **위에서부터 차례로** 검사하고, **처음으로 true인 블록 하나만** 실행한 뒤 나머지는 건너뛴다.
- 85점은 `score >= 70`도 true지만, 이미 `score >= 80`에서 실행이 끝났으므로 `"C"`는 출력되지 않는다.

> ⚠️ **조건 순서가 중요하다.** 아래처럼 작은 기준을 먼저 쓰면 90점도 `"C"`가 나온다.
> 
> 
> ```
> if (score>= 70) {
>   console.log("C");   // 90점도 여기서 걸려버림
> } else if (score>= 80) {
>   console.log("B");
> } else if (score>= 90) {
>   console.log("A");
> }
> ```
> 
> 범위를 나눌 때는 **가장 좁은(엄격한) 조건부터** 위에 쓴다.
> 

| **`if`를 여러 번 쓸 때** | **`else if`로 이을 때** |
| --- | --- |
| 조건마다 **각각** 검사 → 여러 블록이 실행될 수 있음 | **하나만** 실행되면 끝 |
| 서로 관계없는 조건들 | 서로 **겹치지 않는 선택지** 중 하나 고르기 |

### **4-2. 조건문의 특징**

- 조건식의 결과는 **boolean으로 평가**된다.
- `{ }` 블록 단위로 실행 범위가 결정된다.
- `else`는 생략 가능하다.
- **값 자체도 조건식으로 쓸 수 있다** → truthy / falsy

### **4-3. truthy / falsy**

| **구분** | **값** |
| --- | --- |
| **falsy** (6개 고정) | `false`, `0`, `""`(빈 문자열), `null`, `undefined`, `NaN` |
| **truthy** | falsy를 **제외한 모든 값** |

헷갈리기 쉬운 truthy:

| **값** | **결과** | **이유** |
| --- | --- | --- |
| `[]` (빈 배열) | **truthy** | 비어 있어도 배열이라는 "객체"는 존재 |
| `{}` (빈 객체) | **truthy** | 위와 같음 |
| `"0"` | **truthy** | 숫자 0이 아니라 **글자가 하나 있는 문자열** |
| `"false"` | **truthy** | 마찬가지로 빈 문자열이 아님 |

```
let username= "";
if (username) {
  console.log(`안녕,${username}`);
} else {
  console.log("이름을 입력하세요");   // ← 빈 문자열은 falsy라 여기 실행
}
```

> 💡 배열이 비었는지 확인하려면 `if (arr)`이 아니라 **`if (arr.length === 0)`** 으로 써야 한다.
> 

---

## **5. 반복문**

> 반복 작업을 한 번에 처리
> 

```
// 반복문 없이
console.log(1);
console.log(2);
console.log(3);

// 반복문으로
for (let i= 1; i<= 3; i++) {
  console.log(i);
}
```

### **5-1. for**

```
for (초기값; 조건식; 증가식) {
  // 반복 실행
}
```

```
for (let i= 0; i< 5; i++) {
  console.log(i);   // 0 1 2 3 4
}
```

| **부분** | **예시** | **의미** |
| --- | --- | --- |
| 초기값 | `let i = 0` | 처음 한 번만 실행 |
| 조건식 | `i < 5` | true인 동안 반복 |
| 증가식 | `i++` | 한 바퀴 돌 때마다 실행 (`i = i + 1`) |

### **5-2. while**

```
let i= 0;
while (i< 3) {
  console.log(i);   // 0 1 2
  i++;
}
```

### **5-3. 반복문 핵심 포인트**

- 조건이 `false`가 되면 종료된다.
- **무한 루프 주의** — `while`에서 `i++`를 빼먹으면 영원히 끝나지 않는다.
- **반복 횟수가 정해져 있으면 `for`**, 횟수를 모르고 조건만 있으면 `while`.

> 💡 `break`는 반복을 즉시 **종료**, `continue`는 이번 바퀴만 **건너뛰기**.
> 

---

## **6. 배열 · 객체 · Map**

### **6-1. 배열 (Array)**

- 여러 값을 **하나로 묶은** 자료형
- **순서(index)** 가 있다 — 0부터 시작
- 서로 다른 타입을 함께 담을 수 있다

```
let numbers= [10, 20, 30];

console.log(numbers[0]);       // 10  (첫 번째)
console.log(numbers.at(-1));   // 30  (뒤에서 첫 번째)
console.log(numbers[3]);       // undefined (없는 인덱스 → 에러가 아니라 undefined)
console.log(numbers.length);   // 3
```

> 💡 자주 쓰는 메서드: `push()`(끝에 추가), `pop()`(끝에서 제거), `includes()`(포함 여부)
> 

### **6-2. 배열 슬라이싱 — slice()**

> 배열의 **일부를 잘라 새 배열로** 만든다.
> 

```
배열.slice(시작, 끝)   // 시작 인덱스부터 끝 인덱스 "직전"까지
```

```
const fruits= ["apple", "banana", "cherry", "grape", "melon"];
//                 0         1         2        3        4
//                -5        -4        -3       -2       -1

console.log(fruits.slice(1, 3));    // ["banana", "cherry"]   ← 1, 2번 (3은 미포함)
console.log(fruits.slice(2));       // ["cherry", "grape", "melon"]   ← 2번부터 끝까지
console.log(fruits.slice(-2));      // ["grape", "melon"]   ← 뒤에서 2개
console.log(fruits.slice(1, -1));   // ["banana", "cherry", "grape"]   ← 처음·마지막 빼고
console.log(fruits.slice());        // 전체 복사

console.log(fruits);                // 원본은 그대로 (5개)
```

| **코드** | **의미** | **결과** |
| --- | --- | --- |
| `slice(1, 3)` | 1번부터 3번 **직전**까지 | `["banana", "cherry"]` |
| `slice(2)` | 2번부터 **끝까지** | `["cherry", "grape", "melon"]` |
| `slice(0, 2)` | **앞에서 2개** | `["apple", "banana"]` |
| `slice(-2)` | **뒤에서 2개** | `["grape", "melon"]` |
| `slice(1, -1)` | 처음과 마지막 **제외** | `["banana", "cherry", "grape"]` |
| `slice()` | **전체 복사** | 원본과 같은 내용의 새 배열 |

**핵심 포인트**

- **끝 인덱스는 포함하지 않는다.** `slice(1, 3)`은 1, 2번만 → 잘라낸 개수 = `끝 - 시작`
- **음수 인덱스**는 뒤에서부터 센다. (`1` = 마지막)
- **원본 배열은 바뀌지 않는다.** 결과는 항상 새 배열이다.
- 문자열에도 똑같이 쓸 수 있다: `"JavaScript".slice(0, 4)` → `"Java"`

**Python 슬라이싱과 비교**

JS에는 Python의 `[1:3]` 같은 **슬라이싱 문법이 없고**, `slice()` 메서드를 쓴다. 규칙(끝 미포함, 음수 인덱스)은 같다.

| **Python** | **JavaScript** |
| --- | --- |
| `fruits[1:3]` | `fruits.slice(1, 3)` |
| `fruits[2:]` | `fruits.slice(2)` |
| `fruits[:2]` | `fruits.slice(0, 2)` |
| `fruits[-2:]` | `fruits.slice(-2)` |
| `fruits[:]` | `fruits.slice()` 또는 `[...fruits]` |
| `fruits[::2]` (간격) | ❌ 없음 → `filter` 등으로 처리 |

> ⚠️ 이름이 비슷한 **`splice()`는 전혀 다르다.** `splice()`는 **원본 배열에서 요소를 직접 잘라내거나 끼워 넣는다.**
> 
> 
> ```
> const nums= [1, 2, 3, 4, 5];
> const removed= nums.splice(1, 2);   // 1번부터 "2개"를 잘라냄 (두 번째 값이 개수!)
> console.log(removed);   // [2, 3]
> console.log(nums);      // [1, 4, 5]  ← 원본이 바뀜
> ```
> 
> |  | **`slice(시작, 끝)`** | **`splice(시작, 개수)`** |
> | --- | --- | --- |
> | 원본 | **그대로** | **바뀜** |
> | 두 번째 값 | 끝 인덱스 | 잘라낼 **개수** |
> | 용도 | 일부 꺼내 보기 / 복사 | 요소 삭제·삽입 |

### **6-3. 배열 순회 4가지**

```
let scores= [80, 90, 70];
```

| **방법** | **코드** | **언제** |
| --- | --- | --- |
| **for...of** | `for (const score of scores)` | **값만** 필요할 때 (가장 간단) |
| **entries()** | `for (const [i, score] of scores.entries())` | **인덱스 + 값** 둘 다 필요할 때 |
| **for + index** | `for (let i = 0; i < scores.length; i++)` | 인덱스로 세밀하게 제어할 때 |
| **forEach** | `scores.forEach(score => { ... })` | 간결하게 쓸 때 (단, **break / continue 불가**) |

```
// for...of
for (const scoreof scores) {
  console.log(score);
}

// entries — 인덱스 + 값
for (const [i, score] of scores.entries()) {
  console.log(i, score);   // 0 80 / 1 90 / 2 70
}

// for + index
for (let i= 0; i< scores.length; i++) {
  console.log(scores[i]);
}

// forEach
scores.forEach(score => {
  console.log(score);
});
```

### **6-4. 객체 (Object)**

> 여러 값을 **이름(key)** 으로 묶는다.
> 

```
let user= {
  name: "Alex",
  age: 20,
};

console.log(user.name);      // "Alex"  ← 점 표기법
console.log(user["age"]);    // 20      ← 대괄호 표기법
```

> 💡 key가 변수에 들어 있으면 대괄호 표기법을 써야 한다. `const k = "age"; user[k]`
> 

**객체 순회 — for...in**

```
for (const keyin user) {
  console.log(key, user[key]);   // name Alex / age 20
}
```

> ⚠️ 헷갈리기 쉬움: **배열은 `for...of`**(값), **객체는 `for...in`**(key)
> 

### **6-5. 배열(Array) vs 객체(Object)**

|  | **배열(Array)** | **객체(Object)** |
| --- | --- | --- |
| 묶는 기준 | **순서** (0, 1, 2…) | **이름** (key) |
| 적합한 데이터 | 순서가 중요한 목록 (점수들, 과일 목록) | 의미 있는 이름이 중요한 정보 (사용자 정보) |
| 예 | `["apple", "banana"]` | `{ name: "Alex", age: 20 }` |

### **6-6. Map**

> key–value 형태의 데이터 구조. 객체(`{}`)보다 **용도가 명확**하다.
> 

```
const map= new Map();
map.set("name", "Alex");
map.set("age", 20);

console.log(map.get("name"));   // "Alex"
console.log(map.size);          // 2
```

```
const map= new Map([["a", 1], ["b", 2]]);
for (const [key, value] of map) {
  console.log(key, value);   // a 1 / b 2
}
```

|  | **객체** | **Map** |
| --- | --- | --- |
| key 타입 | **문자열** 중심 | **모든 타입** 가능 (숫자, 객체 등) |
| 개수 확인 | `Object.keys(obj).length` | `map.size` |
| 반복 | `for...in` | `for...of` 바로 가능 |
| 주 용도 | 고정된 구조의 데이터 | 자주 추가·삭제·반복하는 데이터 |

---

## **7. 함수 (Function)**

> 코드를 **묶어서 재사용**한다. **입력 → 처리 → 출력**
> 

```
function add(a, b) {   // a, b: 매개변수(입력)
  return a+ b;        // 출력
}

console.log(add(3, 5));   // 8
```

### **7-1. 함수 핵심 포인트**

- 함수는 **호출해야** 실행된다. (`add` 만 쓰면 실행 안 됨, `add()`로 호출)
- `return`은 **결과 반환 + 함수 종료**. `return` 아래 코드는 실행되지 않는다.
- 매개변수는 **함수 내부에서만** 사용할 수 있다.

> 💡 `return`이 없는 함수를 호출하면 결과는 `undefined`다.
> 

### **7-2. 함수를 값처럼 다루기**

JS에서 함수는 숫자·문자열처럼 **값**으로 다룰 수 있다.

**① 변수에 할당**

```
function sayHello() {
  console.log("hello");
}

const f= sayHello;   // 괄호 없음 → 함수 자체를 담음
f();                  // hello
```

**② 다른 함수의 인자로 전달**

```
function run(fn) {
  fn();               // 받은 함수를 여기서 실행
}

run(sayHello);        // hello
```

- (기본) 함수를 선언한 곳에서 직접 호출
- (응용) **선언한 곳과 호출하는 곳이 달라질 수 있다** → 나중에 배울 **이벤트 처리**(`addEventListener`)가 바로 이 방식이다.

### **7-3. ⚠️ 함수 전달 vs 실행 결과 전달**

```
function sayHi() {
  console.log("hi");
}

run(sayHi);     // ⭕ 함수를 전달 → run 안에서 실행 → "hi"
run(sayHi());   // ❌ sayHi를 먼저 실행("hi" 출력) → 결과 undefined를 전달 → fn()에서 에러
```

| **코드** | **전달되는 것** |
| --- | --- |
| `sayHi` | **함수 자체** |
| `sayHi()` | 함수를 **실행한 결과값** (여기서는 `undefined`) |

괄호 `()` 하나 차이지만 의미가 완전히 다르다.

> 💡 화살표 함수: `const add = (a, b) => a + b;` — `forEach(score => ...)`에서 쓴 문법이 이것이다.
> 

---

## **8. 실습 모음**

### **실습 1. 콘솔 계산기**

> 숫자 두 개와 연산자를 변수로 정하고, 연산자에 따라 결과를 출력한다. (입력은 받지 않는다)
> 

```
let a= 10;
let b= 5;
let operator= "+"; // "+", "-", "*", "/"

if (operator=== "+") {
  console.log(a+ b);
} else if (operator=== "-") {
  console.log(a- b);
} else if (operator=== "*") {
  console.log(a* b);
} else if (operator=== "/") {
  console.log(a/ b);
} else {
  console.log("지원하지 않는 연산자입니다");
}
```

### **실습 2. 최종 합격 판정**

| **조건** | **기준** |
| --- | --- |
| 점수 `score` | 70 이상 |
| 출석률 `attendance` | 80 이상 |
| 과제 제출 `submitted` | `true` |
| **예외** | 점수 90 이상이면 출석률 무시하고 합격 |

```
let score= 88;
let attendance= 75;
let submitted= true;

if (submitted&& ((score>= 70 && attendance>= 80) || score>= 90)) {
  console.log("최종 합격");
} else {
  console.log("불합격");   // ← 출석률 75라서 불합격
}
```

조건을 풀어 읽으면: **과제 제출은 필수** 그리고 (**점수 70↑ & 출석 80↑** 또는 **점수 90↑**)

### **실습 3. 반복문 기초**

**1부터 10까지 출력**

```
for (let i= 1; i<= 10; i++) {
  console.log(i);
}
```

**1~20 중 짝수만 출력**

```
for (let i= 1; i<= 20; i++) {
  if (i% 2 === 0) {      // 2로 나눈 나머지가 0 → 짝수
    console.log(i);
  }
}
```

### **실습 4. 배열 + 반복문**

**배열의 모든 값 출력**

```
let fruits= ["apple", "banana", "orange"];

// 방법 1: for...of
for (const fruitof fruits) {
  console.log(fruit);
}

// 방법 2: for + index
for (let i= 0; i< fruits.length; i++) {
  console.log(fruits[i]);
}
```

**배열의 합계**

```
let numbers= [10, 20, 30, 40];
let sum= 0;

for (const numof numbers) {
  sum+= num;           // sum = sum + num
}
console.log(sum);       // 100
```

### **실습 5. 객체 다루기**

```
let user= {
  name: "Alex",
  age: 25,
  email: "alex@test.com",
};

console.log(user.name);
console.log(user.age);
console.log(user.email);
```

### **실습 6. 함수 기초**

**두 숫자를 더하는 함수**

```
function add(a, b) {
  return a+ b;
}
console.log(add(3, 7));   // 10
```

**점수를 받아 합격 여부 반환 (60점 이상 합격)**

```
function checkPass(score) {
  if (score>= 60) {
    return "합격";
  } else {
    return "불합격";
  }
}

console.log(checkPass(75));   // 합격
console.log(checkPass(50));   // 불합격
```

> 💡 `return`이 함수를 끝내므로 `else` 없이도 같다: `if (score >= 60) return "합격"; return "불합격";`
> 

### **실습 7. 종합 — 점수 배열의 평균**

```
function getAverage(scores) {
  if (scores.length=== 0) {   // 빈 배열이면 0으로 나누는 걸 막기
    return 0;
  }
  let sum= 0;
  for (const scoreof scores) {
    sum+= score;
  }
  return sum/ scores.length;
}

console.log(getAverage([80, 85, 92, 97]));   // 88.5
```

> 💡 빈 배열을 먼저 처리하지 않으면 `0 / 0` = **`NaN`** 이 반환된다. 이렇게 예외 상황을 먼저 걸러내는 습관이 중요하다.
> 

---

## **마무리 요약**

| **주제** | **핵심** |
| --- | --- |
| 실행 | Console / `<script>` / `.js` 분리 / `node app.js` |
| 변수 | **기본 `const`**, 바뀔 때만 `let` |
| 자료형 | number, string, boolean, null(의도적 빈 값), undefined(미할당) |
| 비교 | **항상 `===`** — JS는 타입을 자동 변환한다 |
| 조건 | falsy 6개만 외우고 나머지는 전부 truthy (`[]`, `{}`, `"0"`도 truthy) |
| 반복 | 횟수 정해짐 → `for`, 조건만 → `while`, 무한 루프 주의 |
| 배열 | 순서 중심, `for...of`로 순회 |
| 객체 | 이름(key) 중심, `for...in`으로 순회 |
| 함수 | 호출해야 실행, `return` = 반환 + 종료, **`fn` vs `fn()`** 구분 |

다음 글에서는 **DOM과 이벤트**로 실제 웹 페이지를 움직여볼 예정이다.