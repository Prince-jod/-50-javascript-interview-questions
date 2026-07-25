//using fork and spawn child process 

const fib=(n)=>(n<=2 ? 1 : fib(n-1) + fib(n-2));

console.log("executing");
console.log(fib(40));
console.log("Done");