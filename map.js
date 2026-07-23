//using map on array and def of parameter passed in an array 

const arr=[10,20,30];
arr.map((value,index,arr)=>{
 console.log(value);
 console.log(index);
 console.log(arr);
})

//returning object using map function

const arr1=[1,2,3];
const res=arr1.map((num)=>{
  return {
    value:num,
    square:num*num
  }
});
console.log(res)