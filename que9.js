//explaining the concept of closure in javascript 

//closure is a function that remember is outer function variable evrn though the outer function has stop executing 

function outer(){
  var a=10;
  return function inner(){
    a++;
    console.log(a);
  
  }
}
const res=outer();
console.log(res);//it will return the function
res();
//lexical scope example mean that function can access the variable from anywhere in code it is not where it is called that is done in js using lexical scope 

var lexical=10;
function out(){
  return function iN(){
    console.log(lexical);
  }
}
const lex=out();
lex(); // here what it done it searches the var in its scope then its outer then at global level

