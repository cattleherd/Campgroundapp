const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/camp');
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');


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


const campgroundValidation = (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().min(0).required(),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required(),

        }).required()
    })
    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const text = error.details.map(e => e.message).join(',')
        throw new ExpressError(text, 400)

    } else {
        next()
    }
}



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

app.post('/campgrounds', campgroundValidation, async (req, res, next) => {
        const campground = new Campground(req.body.campground); //.campground because result campground[] due to form from new
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
})

//route for viewing a selected campground

app.get('/campgrounds/:id', catchAsync(async (req, res) =>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}))


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

//404 route
app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404))
})

//error handler middleware
app.use(function (err, req, res, next) {
    const { statusCode = 500, message = 'something went wrong' } = err;
    res.status(statusCode).send(message);
})
