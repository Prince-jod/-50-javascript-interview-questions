const onSubmitHandler=(e)=>{
e.preventDefault();
console.log("form submited ");
const product=e.target.productName.value;

const obj={
  "productName":product,
}

axios.post('http://localhost:3000'+"/products",obj).then((res)=>{
  console.log(res.data);
})

}