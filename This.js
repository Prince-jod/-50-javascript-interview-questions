//using this in diff context 

//at global scope 
console.log(this);

//using in regular function 

function greet(){
  console.log(this);
}

//using inside a object 
const obj={
  name:"prince",
  greet(){
    console.log(this.name);
  }
}