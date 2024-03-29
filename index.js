if( process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}


const express = require('express');
const app = express();
const PORT =8800; 
const path = require('path');
const mongoose = require('mongoose');
const helmet = require("helmet");


const methodOverride = require('method-override')
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const multer  = require('multer')
const ExpressError = require('./utils/ExpressError')
const mongoSanitize = require('express-mongo-sanitize')

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.engine('ejs', engine);

main().catch(err => console.log(err));

async function main() {
  try{
  await mongoose.connect('mongodb://localhost:27017/Yelp-Camp');
  }
  catch(e){
    console.log(" ERROR")
  }
}


const {scriptSrcUrls,styleSrcUrls,connectSrcUrls,fontSrcUrls}=require('./content_policy')
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
              "https://res.cloudinary.com/ronn1230/", 
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

const sessionDetails = {
  name : 'cookie',
  secret : 'thisisabadsecret',
  resave : false,
  saveUninitialized : false,
  cookie : {
    expires : Date.now() + 24*7*60*60*1000,
    maxAge : 24*7*60*60*1000,
    httpOnly : true,
    //secure : true
  }
}

const campgroundsRoute = require('./routes/campgrounds')
const reviewsRoute = require('./routes/reviews')
const userRoute = require('./routes/user')
const User = require('./models/user')

app.use(session(sessionDetails))
app.use(passport.initialize());
app.use(flash())
app.use(mongoSanitize({
  replaceWith : '_'
}));
app.use(passport.session());

app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

passport.use( new LocalStrategy(User.authenticate()))
//can have multiple strategies going at once

passport.serializeUser(User.serializeUser()); // start session
passport.deserializeUser(User.deserializeUser()); // take out of session

app.use(function(req, res, next){
  if(! ['/login','/register','/logout'].includes(req.originalUrl)){
    req.session.returnTo = req.originalUrl;
  }
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.info = req.flash('info');
    next();
})

app.use('/campgrounds',campgroundsRoute);
app.use('/campgrounds/:id/reviews',reviewsRoute)
app.use('/',userRoute)


app.get('/',(req, res)=>{
  res.render('home');
})

app.get('/fakeUser',async(req, res)=>{
  const user= new User({username:'ronn1232',email:'ronn1231@gmail.com'});
  const register = await User.register(user , "codmobile123");

})

app.use((req,res, next)=>{
  next(new ExpressError('Not Found',404));
})

app.use((err,req,res,next)=>{
  let {status=500, message="Something went wrong!!!"}=err;
  res.status(status).render('err',{message,status,err});
})

app.listen(PORT,()=>{
  console.log("Listening on port "+PORT);
})