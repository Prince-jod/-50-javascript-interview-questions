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

//array of object 

const arr2=[
  {name:"pratik",age:212},
  {name:"munnu",age:76},
  {name:"sunnu",age:232}
];
arr2.map((x)=>{
  console.log(x.name);
})