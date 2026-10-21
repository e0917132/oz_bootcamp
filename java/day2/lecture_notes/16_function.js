// 함수 (funtion)
// [1]구조: 입력 -> 처리 -> 출력
// [2]기능: 재사용성


// 입력: n1, n2
// 처리: n1 + n2
// 출력: N

// 함수정의
function add(n1, n2) {
    const N = n1 + n2
    return N
}

// 함수 호출(Call) -> 실행
// let result = add(10, 3);
// console.log(result);

console.log(add(10, 3));

// 함수 자체를 변수 할당할 수도 있다.
console.log(add);

let foo = add;

console.log(foo(4, 2));


// 좀 기괴한 ..

function runFunction(f, arg1, arg2) {
    return f(arg1, arg2)    // -> add(4,2)
}

let result = runFunction(add, 4, 2)
console.log(result);