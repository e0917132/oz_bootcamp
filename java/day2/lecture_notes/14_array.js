// 배열 (Array)
// 파이썬 list와 비슷한 자료형.

let numbers = [1, 2, 3, 4];

console.log(numbers[1]);
console.log(numbers.at(-1)); // 마지막 인덱스


for (const num of numbers){
    console.log(num);
};

// 슬라이싱
console.log(numbers.slice(1, 3));