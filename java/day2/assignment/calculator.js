// ===== 콘솔창 사칙연산 계산기 =====
// 사용법: 브라우저 콘솔창에 start() 입력
//
// 계산 순서
// 1. tokenize : 계산식 문자열을 숫자와 연산자로 나눈다
//               "12 + 3 * -4"  →  [12, "+", 3, "*", -4]
// 2. calculate: *, / 를 먼저 계산하고, 남은 값들을 더한다
//               [12, "+", 3, "*", -4]  →  [12, -12]  →  0


// 연산자인지 확인하는 함수
function isOperator(char) {
    return char === "+" || char === "-" || char === "*" || char === "/";
}


// 1. 계산식 문자열 → 토큰 배열
//    잘못된 식이면 에러 메시지를 출력하고 null 반환
function tokenize(expression) {
    const tokens = [];
    let numberText = "";   // 지금 읽고 있는 숫자 (한 글자씩 이어 붙임)

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        // 공백은 무시
        if (char === " ") {
            continue;
        }

        // 숫자나 소수점이면 이어 붙이기 ("1", "12", "12.5" …)
        if ((char >= "0" && char <= "9") || char === ".") {
            numberText += char;
            continue;
        }

        // 연산자
        if (isOperator(char)) {
            // 음수 부호(-) 바로 뒤에 또 연산자 (예: --3, 5 * -+2)
            if (numberText === "-") {
                console.log(`⚠️ 연산자 '${char}'의 위치가 올바르지 않습니다.`);
                return null;
            }

            // 아직 숫자를 읽기 전에 나온 연산자 (맨 앞이거나, 연산자 바로 뒤)
            if (numberText === "") {
                if (char === "-") {
                    numberText = "-";   // 음수 부호로 처리 (예: -3, 5 * -2)
                    continue;
                }
                console.log(`⚠️ 연산자 '${char}'의 위치가 올바르지 않습니다.`);
                return null;
            }

            const number = Number(numberText);
            if (Number.isNaN(number)) {
                console.log(`⚠️ '${numberText}'는 올바른 숫자가 아닙니다.`);
                return null;
            }

            tokens.push(number, char);
            numberText = "";
            continue;
        }

        // 숫자, 연산자, 공백이 아닌 글자
        console.log(`⚠️ 사용할 수 없는 문자 '${char}'가 있습니다. (숫자와 + - * / 만 가능)`);
        return null;
    }

    // 마지막 숫자 처리
    if (numberText === "" || numberText === "-") {
        console.log("⚠️ 계산식이 연산자로 끝났습니다.");
        return null;
    }

    const lastNumber = Number(numberText);
    if (Number.isNaN(lastNumber)) {
        console.log(`⚠️ '${numberText}'는 올바른 숫자가 아닙니다.`);
        return null;
    }
    tokens.push(lastNumber);

    return tokens;
}


// 2. 토큰 배열 → 계산 결과
//    *, / 는 바로 앞의 값과 즉시 계산하고
//    +, - 는 나중에 더할 값으로 배열에 쌓아둔다 → 마지막에 모두 더함
function calculate(tokens) {
    const terms = [tokens[0]];   // 마지막에 더할 값들

    // tokens = [숫자, 연산자, 숫자, 연산자, 숫자 …] → 연산자는 홀수 인덱스
    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const number = tokens[i + 1];
        const last = terms.length - 1;

        if (operator === "*") {
            terms[last] = terms[last] * number;
        } else if (operator === "/") {
            if (number === 0) {
                console.log("⚠️ 0으로 나눌 수 없습니다.");
                return null;
            }
            terms[last] = terms[last] / number;
        } else if (operator === "+") {
            terms.push(number);
        } else {
            terms.push(-number);   // 빼기는 "음수를 더하기"로 바꿔서 저장
        }
    }

    let sum = 0;
    for (const term of terms) {
        sum += term;
    }

    // 0.1 + 0.2 = 0.30000000000000004 같은 소수점 오차 정리
    return Math.round(sum * 1e10) / 1e10;
}


// 3. 계산기 실행 (콘솔창에서 start() 입력)
function start() {
    const input = prompt("계산식을 입력하세요.(예: 1 + 1 * 4)");

    // 취소 버튼
    if (input === null) {
        console.log("계산을 취소했습니다.");
        return;
    }

    // 빈 입력
    if (input.trim() === "") {
        console.log("⚠️ 계산식을 입력해주세요.");
        return;
    }

    const tokens = tokenize(input);
    if (tokens === null) {
        return;
    }

    const result = calculate(tokens);
    if (result === null) {
        return;
    }

    console.log(`${input.trim()} = ${result}`);
    console.log("다시 계산하려면 start()를 입력하세요.");
}
