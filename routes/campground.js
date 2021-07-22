const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Campground = require('../models/camp');

const { campgroundSchema }  = require('../schemas.js'); //include {} or else error


//campground validation middleware function using campgroundSchema
const campgroundValidation = (req, res, next) => {

    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const text = error.details.map(e => e.message).join(',')
        throw new ExpressError(text, 400)

    } else {
        next()
    }
}

//route for campgrounds index

router.get('/', async (req, res) =>{
    const campgrounds = await Campground.find({}); //grabs campground collection (all)
    res.render('campgrounds/index', { campgrounds })
})

// routes for creating new campground

router.get('/new', (req, res)=>{
    res.render('campgrounds/new')
})

router.post('/', campgroundValidation, async (req, res, next) => {
        const campground = new Campground(req.body.campground); //.campground because result campground[] due to form from new
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
})

//route for viewing a selected campground
//populates new reviews every time route is reached
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}))



// route for edit / update 

router.get('/:id/edit', async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})


router.put('/:id', campgroundValidation, async(req, res) => {

        const id = req.params.id;
        const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
        res.redirect(`/campgrounds/${campground.id}`)

})

//delete route
router.delete('/:id', async(req, res)=>{
    const id = req.params.id;
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

module.exports = router;