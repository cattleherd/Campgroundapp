module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()){ //isauthenticated is a method from passport thats injected to req to authenticate users
        req.flash('error', 'you must be authenticated first');
        return res.redirect('/login'); //return otherwise the last line will run
    }
    next();
}