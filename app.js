const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate')
const ExpressError = require('./utils/ExpressError');
const campground = require('./routes/campground') //require campground router
const review = require('./routes/review')
const methodOverride = require('method-override');


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

app.engine('ejs', engine) //sets default ejs engine to ejs-mate



app.listen(3000, ()=>{
    console.log('listening on port 3000')
})


app.use('/campgrounds', campground) //campground router
app.use('/campgrounds/:id/reviews', review) //instantiate review router


app.get('/', (req,res)=>{
    res.render('home')
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
