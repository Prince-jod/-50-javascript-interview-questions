function addSum1(a,b){
  return a+b+1;
}

function addSum2(a,b){
  return a+b+2;
}

function sum(a,b){
  const result=addSum1(a,b)+addSum2(a,b);
  return result;
}

sum(4,5);