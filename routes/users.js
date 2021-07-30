const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const LocalStrategy = require('passport-local');


//register route
router.get('/register', (req, res) => {
    res.render('./users/register')
})
//here we use our own simple try and catch error hander using catchasync middleware instead of default error handler we created. Utilizes flash.
router.post('/register', catchAsync(async(req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const signedUser = await User.register(user, password);
        req.login(signedUser,function(err){
            if (err) { return next(err); }
        })
        req.flash('success', 'welcome')
        res.redirect('/campgrounds')
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}));


//login/logout route
router.get('/login', (req, res) => {
    res.render('./users/login')
})
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res)=>{
    req.flash('success', 'welcome back')
    res.redirect(req.session.returnTo || '/campgrounds')
});

router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success', 'you successfully logged out');
    res.redirect('/campgrounds');
})

module.exports = router;