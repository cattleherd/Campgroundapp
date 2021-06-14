const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/campdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected')
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



app.listen(3000, ()=>{
    console.log('listening on port 3000')
})

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/makecampground', async (req,res)=>{
    const camp = new Campground({title: 'my backyard'});
    await camp.save();
    res.send(camp)
})

