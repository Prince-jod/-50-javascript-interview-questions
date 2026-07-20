//using this in deiff contexts

console.log(this);

function greet(){
  console.log(this);
}
greet();

//--------------//
"use-strict"
function another(){
  console.log(this);
}