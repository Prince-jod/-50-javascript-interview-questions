// diff between function declaration and function expression 

//function declaration is when we declare the function normally in js and function expression is when a function is assigned to a let or const variable function declaration is fully hoisted but function expression isnot 

//function declaration 
function  greet(){
  console.log("hello world");
}

//function expression

const a =function(){
  console.log("annonyyy");
}

//another 
const b=(a,b)=>{
  console.log("annony",a+b);
};
b(2,3);
// diff between arrow and func declaration

const obj={
  name:"riya",

   regular(){
    setTimeout(function(){
      console.log(this.name);
    },2000);
  },
  arrow(){
    setTimeout(()=>{
      console.log(this.name);
    },2000);
  }

}
obj.regular();
obj.arrow();
//one diff is that function declaration has its own this but arrow function take this from its surrounding 