const express = require('express');
const router = express.Router({ mergeParams: true }); //mergeparams removes errors in console
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/camp');
const Review = require('../models/review');
const { isLoggedIn, reviewValidation, campgroundValidation, userAuthReview, userAuth } = require('../middleware');
const reviews = require('../controllers/reviews')

//route for creating reviews
router.post('/', reviewValidation , isLoggedIn, catchAsync(reviews.createReview))

//route for deleting review (deletes ref inside campground db and entry inside review db)

router.delete('/:reviewID', isLoggedIn, userAuthReview, catchAsync(reviews.deleteReview))

module.exports = router;