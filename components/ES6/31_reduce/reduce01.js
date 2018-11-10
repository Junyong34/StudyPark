"use strict";

const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15


// reduce 문법
/*
arr.reduce(callback[, initialValue])

callback
배열의 각 (요소) 값에 대해 실행할 함수. 인수(argument) 4개를 취하며, 각 인수는 다음과 같습니다 :
accumulator
누산기(accumulator)는 콜백의 반환값을 누적합니다. 초기값(initialValue)이 주어진 경우에는
그 값(아래 참조) 또는 콜백의 마지막 호출에서 이전에 반환된 누적값입니다.
currentValue
배열 내 현재 처리되고 있는 요소.
currentIndexOptional
배열 내 현재 처리되고 있는 요소의 인덱스. 초기값(initialValue)이 주어진 경우 0부터,
 그렇지 않으면 1부터 시작합니다.
arrayOptional
reduce()가 호출된 배열.
initialValueOptional
콜백(callback)의 첫 번째 호출에서 첫 번째 인수로 사용되는 값.
 초기값이 주어지지 않은 경우에는 배열의 첫 번째 요소가 사용됩니다.
 빈(empty) 배열에서 초기값 없이 reduce()를 호출하면 에러가 발생합니다.
 */


var maxCallback = (acc, cur) => Math.max(acc.x, cur.x);
var maxCallback2 = (max, cur) => Math.max(max, cur);

// reduce() without initialvalue
[{x: 22}, {x: 42}].reduce(maxCallback);
[{x: 22}].reduce(maxCallback);
// [].reduce(maxCallback2);
[{x: 22}, {x: 42}].map(el => el.x)
    .reduce(maxCallback2, -Infinity);


[0, 1, 2, 3, 4].reduce(function (accumulator, currentValue, currentIndex, array) {
    return accumulator + currentValue;
});
//  0   1         1     []
//

/*

callback	accumulator	currentValue	currentIndex	array	       반환값
1번째 호출	      0	         1	               1	[0, 1, 2, 3, 4]	      1
2번째 호출	      1	         2	               2	[0, 1, 2, 3, 4]	      3
3번째 호출	      3	         3	               3	[0, 1, 2, 3, 4]	      6
4번째 호출	      6	         4	               4	[0, 1, 2, 3, 4]	      10

 */
