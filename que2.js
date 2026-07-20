//difference between == and === in javascript
var x=10;
var y="10";
console.log(x==y); //output will be true because == operator only checks for value equality and performs type coercion if the types are different. In this case, the string "10" is converted to a number before comparison.
console.log(x===y); //output will be false because === operator checks for both value and type equality without performing type coercion.
//but if we change the type of y to number then output will be true for both == and === operators
var x=Number(y);
console.log(x==y);