//tempral dead zone in javascript is a behavior that occurs when using let and const variable before they are declared. When a variable is declared using let or const, it is not hoisted to the top of it s scope like var variables. Instead, it is in a "temporal dead zone" from the start of the block until the variable is declared. During this time, if you try to access the variable, you will get a ReferenceError.

console.log(a);
let a=10;
console.log(b);
const b=20;
