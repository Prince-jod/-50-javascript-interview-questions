// explain the concept of hoisting in javascript 
console.log(a); //undefined this is called hoisting in javascript. Hoisting is a behavior in JavaScript where variable and function declarations are moved to the top of their containing scope during the compilation phase. This means that you can use variables and functions before they are actually declared in the code.
var a=10;
console.log(a); //10

// console.log(b);

let b=20;
console.log(b);

// function hoisting 

greet();

function greet(){
  console.log("hello world");
}