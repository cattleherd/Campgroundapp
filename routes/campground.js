const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const campgrounds = require('../controllers/campgrounds')

const Campground = require('../models/camp');

const { campgroundSchema }  = require('../schemas.js'); //include {} or else error
const { isLoggedIn, userAuth, campgroundValidation } = require('../middleware')


//route for campgrounds index

router.get('/', catchAsync(campgrounds.index) )

// routes for creating new campground

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post('/', isLoggedIn, campgroundValidation, catchAsync(campgrounds.createNewCampground))

//route for viewing a selected campground
router.get('/:id', catchAsync(campgrounds.viewCampground))

// routes for showing edit form and updating

router.get('/:id/edit', isLoggedIn, userAuth, catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, campgroundValidation, userAuth, catchAsync(campgrounds.updateEditForm))

//delete route
router.delete('/:id', isLoggedIn, catchAsync(campgrounds.deleteCampground))

module.exports = router;