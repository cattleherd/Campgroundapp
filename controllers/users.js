
const User = require('../models/user');
const passport = require('passport');

module.exports.renderRegisterForm = (req, res) => {
    res.render('./users/register')
}

//here we use our own simple try and catch error hander using catchasync middleware instead of default error handler we created. Utilizes flash.
module.exports.createUser = async(req, res) => {
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render('./users/login')
}

module.exports.loginUser = passport.authenticate('local', {failureFlash: true, successRedirect: '/campgrounds', failureRedirect: '/login'}), (req, res)=>{
    req.flash('success', 'welcome back')
    res.redirect('/campgrounds')
}

module.exports.logoutUser = (req, res) =>{
    req.logout();
    req.flash('success', 'you successfully logged out');
    res.redirect('/campgrounds');
}