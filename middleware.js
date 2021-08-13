const { campgroundSchema, reviewSchema }  = require('./schemas.js'); //include {} or else error
const Campground = require('./models/camp.js')
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');




//campground validation middleware function using campgroundSchema
module.exports.campgroundValidation = (req, res, next) => {

    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const text = error.details.map(e => e.message).join(',')
        throw new ExpressError(text, 400)

    } else {
        next()
    }
}

module.exports.reviewValidation = (req, res, next) => {
    const { error }  = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()){ //isauthenticated is a method from passport thats injected to req to authenticate users
        req.flash('error', 'you must be authenticated first');
        return res.redirect('/login'); //return otherwise the last line will run
    }
    next();
}

//campground authorization..must be owner of campground to update/edit campgrounds
module.exports.userAuth = async(req, res, next) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)){
        req.flash('error', 'you must be owner of this campground');
        return res.redirect('/campgrounds');
    }
    next();
}
//review authorization..must be owner of review to delete (review author must equal currentuser)
module.exports.userAuthReview = async(req, res, next) =>{
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'you must be owner of this review');
        return res.redirect('/campgrounds');
    }
    next();
}
