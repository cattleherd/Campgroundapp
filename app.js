const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/camp');
const methodOverride = require('method-override')
const engine = require('ejs-mate')


mongoose.connect('mongodb://localhost:27017/campdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('connected')
});

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//sets default ejs engine to ejs-mate

app.engine('ejs', engine)



app.listen(3000, ()=>{
    console.log('listening on port 3000')
})

app.get('/', (req,res)=>{
    res.render('home')
})

//route for campgrounds index

app.get('/campgrounds', async (req, res) =>{
    const campgrounds = await Campground.find({}); //grabs campground collection (all)
    res.render('campgrounds/index', { campgrounds })
})

// routes for creating new campground

app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground); //.campground because result campground[] due to form from new
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    
})

//route for viewing a selected campground

app.get('/campgrounds/:id', async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})


// route for edit / update 

app.get('/campgrounds/:id/edit', async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})


app.put('/campgrounds/:id', async(req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground.id}`)
})

app.delete('/campgrounds/:id', async(req, res)=>{
    const id = req.params.id;
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})
