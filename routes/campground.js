const express = require('express');
const multer = require('multer');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const campgrounds = require('../controllers/campgrounds')

const Campground = require('../models/camp');

const { campgroundSchema }  = require('../schemas.js');
const { isLoggedIn, userAuth, campgroundValidation } = require('../middleware')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })



router.route('/')
    //route for rendering campgrounds index
    .get(catchAsync(campgrounds.index))
    //route for submit new campground
    .post(isLoggedIn, upload.array('image'), campgroundValidation,  catchAsync(campgrounds.createNewCampground));

// routes for creating new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    //campground showpage route
    .get(catchAsync(campgrounds.viewCampground))
    //update campground route
    .put(isLoggedIn, upload.array('image'), campgroundValidation, userAuth, catchAsync(campgrounds.updateEditForm))
    //delete campground route
    .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground))

// routes for showing edit form
router.get('/:id/edit', isLoggedIn, userAuth, catchAsync(campgrounds.renderEditForm))

module.exports = router;