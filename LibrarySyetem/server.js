const express=require('express');
const app=express();
const PORT=3000;

const  bookRouter=require('./routers/Book');

app.use('/books',bookRouter);




app.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`)
})