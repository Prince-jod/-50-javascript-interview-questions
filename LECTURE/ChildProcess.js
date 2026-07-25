//using fork and spawn child process 

const {fork}=require("child_process");

console.log("executing");
console.log(fib(40));
console.log("Done");