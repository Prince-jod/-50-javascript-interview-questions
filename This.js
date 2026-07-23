//using this in diff context 

//at global scope 
console.log(this);

//using in regular function  --this is at the gobal level

function greet(){
  console.log(this);
}
greet();

//using inside a object   --this will refer to the object 
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

function Person(name){
console.log(name);
}
const p1=new Person("prince");
p1.name();