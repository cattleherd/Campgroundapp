const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const user = require('../controllers/users.js');


//register route
router.get('/register', user.renderRegisterForm );
router.post('/register', catchAsync(user.createUser));


//login/logout route
router.get('/login', user.renderLoginForm);
router.post('/login', user.loginUser );
router.get('/logout',user.logoutUser );

module.exports = router;