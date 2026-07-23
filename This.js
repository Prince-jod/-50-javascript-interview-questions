//using this in diff context 

//at global scope 
console.log(this);

//using in regular function 

function greet(){
  console.log(this);
}
greet();

//using inside a object   
const obj={
  name:"prince",
  greet(){
    console.log(this.name);
  }
}
// greet();
obj.greet();
// using inside a object method --------it will give undefined becasue did not get called by the object in which the methdo is

const nav=obj.greet;
nav();