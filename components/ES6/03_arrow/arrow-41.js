"use strict";
debugger;

let sports = (a,b) => {
  try {
      console.log(a,b);
    let args = arguments;
  } catch (error) {
    console.log("사용 불가");
  }
}
sports(1, 2);


let dummy;
