if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const helmet = require('helmet')
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate')
const ExpressError = require('./utils/ExpressError');

//routers
const campgroundRoutes = require('./routes/campground'); //require campground router
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/users');

const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const MongoStore = require('connect-mongo');


const mongoSanitize = require('express-mongo-sanitize');

const dbUrl = process.env.DB_URL

const port = process.env.PORT || 3000
const app = express();
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
    console.log(`listening on port ${port} `)
})

//'mongodb://localhost:27017/campdb'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connected')
});

//serve static files (scripts/css) in public directory
app.use(express.static(path.join(__dirname, 'public'))); //path.join allows you to specify absolute paths when injecting scripts etc incase node is launched in different directory 
mongoose.set('useFindAndModify', false);


//store session cookie in mongodb under session
app.use(session({
    secret: 'keyboard cat',
    collectionName: 'RadCamp',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    ttl: 14 * 24 * 60 * 60,
    store: MongoStore.create({
      mongoUrl: dbUrl,
      touchAfter: 24 * 3600 // time period in seconds
    }).on("error", function(e){  //error handling
        console.log("session store error", e)
    })
  }));



/*  
//sessions middleware storing in memory
const sessionConfig = {

    name: 'RadCamp',
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //protects cookies (Security feature, enabled default)
        maxAge: 100000000
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/campdb',
        touchAfter: 24 * 3600 // time period in seconds
    })
}
*/   //memory storage of session data

/*memory storage of session data
app.use(session(sessionConfig));

*/


app.use(flash());//instantiate flash

//initialize passport for use and allows user to be tracked with sessions (stay logged in)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
//allow passport to utilize LocalStrategy
//utilize authenticate method thats been plugged into user model (static method)

passport.serializeUser(User.serializeUser()); //use the serialization method thats been plugged in user model (passport-local-mongoose)
passport.deserializeUser(User.deserializeUser());
//this is telling passport how to store and 'un-store' User in the session
//this is used for keeping user logged in.

app.use(methodOverride('_method')); //allows put and delete routes

//setup view engine (middleware)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine) //sets default ejs engine to ejs-mate

//res.locals variables for access in templates
app.use((req, res, next) => {
    res.locals.success = req.flash('success');//stores whatever message is under flash('success')
    res.locals.error = req.flash('error');   // inside res.locals for easy access in html templates
    //user info stored in currentUser variable to be accessed by templates.
    res.locals.currentUser = req.user;
    console.log(req.originalUrl)
    //this makes user experience more seamless. When a user tries to access a page thats restricted
    //the user is redirected to login. Once verified they are redirected to the page they wanted to visit.
    //in order to make this work, since this check is run for every route, you need to ignore the login route and home route.
    //this will avoid a loop where logging in redirects to login page. Look at user controller for implementation in login route.
    /*if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;

    } */
    next();
})


//express router middleware
app.use('/campgrounds', campgroundRoutes); //campground router
app.use('/campgrounds/:id/reviews', reviewRoutes); //instantiate review router
app.use('/', userRoutes);

app.use(mongoSanitize());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.get('/', (req, res) => {
    res.render('home')
})

//404 route
app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404))
})

//error handler middleware
app.use(function (err, req, res, next) {
    const { statusCode = 500, message = 'something went wrong' } = err;
    res.status(statusCode).send(message);
})