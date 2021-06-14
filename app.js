const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



app.listen(3000, ()=>{
    console.log('listening on port 3000')
})

app.get('/', (req,res)=>{
    res.render('home')
})
