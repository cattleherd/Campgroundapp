const express = require('express');
const router = express.Router({ mergeParams: true }); //mergeparams removes errors in console
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { reviewSchema } = require('../schemas.js'); //include {} when linking schemas as it gives error otherwise (reviewschema.validate not function)

const Campground = require('../models/camp');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');

const reviewValidation = (req, res, next) => {
    const { error }  = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//route for creating reviews
router.post('/', reviewValidation , isLoggedIn, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    req.flash('success', 'created new review!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

//route for deleting review (deletes ref inside campground db and entry inside review db)

router.delete('/:reviewID', isLoggedIn, catchAsync(async (req, res) => {
    const {reviewID, id} = req.params; //reviewID is referenced from the show page (for review in campground.reviews)
    await Campground.findByIdAndUpdate(id, {$pull: {review: reviewID}}); //removes review ref in review array in campground db by reviewID (using pull function)
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'successfully deleted review!')
    res.redirect(`/campgrounds/${id}`);

}))

module.exports = router;