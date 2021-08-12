const express = require('express');
const router = express.Router({ mergeParams: true }); //mergeparams removes errors in console
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/camp');
const Review = require('../models/review');
const { isLoggedIn, reviewValidation, campgroundValidation, userAuthReview, userAuth } = require('../middleware');


//route for creating reviews
router.post('/', reviewValidation , isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    req.flash('success', 'created new review!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

//route for deleting review (deletes ref inside campground db and entry inside review db)

router.delete('/:reviewID', isLoggedIn, userAuthReview, catchAsync(async (req, res) => {
    const {reviewID, id} = req.params; //reviewID is referenced from the show page (for review in campground.reviews)
    await Campground.findByIdAndUpdate(id, {$pull: {review: reviewID}}); //removes review ref stored in the campground using reviewID (using pull function)
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'successfully deleted review!')
    res.redirect(`/campgrounds/${id}`);

}))

module.exports = router;