// 조건문 (conditional statement)

// let age = 20;

// if (age >= 19) {
//     console.log("성인입니다.");
// } else if (age >= 8){
//     console.log("학생입니다.")
// }else {
//     console.log("어린이입니다.")
// }



// truthy: true로 취급되는 값들
// falsy: false로 취급되는 값들 (6개)
// -> false, 0, "", null, undefined, NaN

let selectedUser = null;

if (selectedUser) {
    console.log("축하합니다. 당첩입니다.");
} else {
    console.log("아쉽네요. 다음 기회에");
}