const express = require('express');
const app = express();
const router = express.Router({mergeParams: true});

const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const User = require('../models/user')

router.get('/register', (req, res, next) => {
  res.render("users/register")
})


router.post('/register', catchAsync(async (req, res, next) => {
  try{
  const {username , password , email } = req.body.User;
  const user = new User({email, username});
  // make sure to take care of the order
  const register =await User.register(user , password);
  req.login(register, (err)=>{
    if(err) next(err);
    req.flash('success',"Welcome to YelpCamp!!!");
    const redirect = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirect)
  })
  }catch(err){
    req.flash('error',err.message);
    res.redirect('/register')
  }
}))



router.get('/login', (req, res, next) => {
  res.render("users/login")
})

//validate before showing anything
router.post('/login',passport.authenticate('local',{failureFlash:true , failureRedirect: '/login'}),(req, res, next) => {

  req.flash('success',"Welcome Back to YelpCamp!!!");
  res.redirect('/campgrounds')
})

router.get('/logout', (req, res, next) => {
  req.logOut();
  req.flash('success','Successfully logged out..See you soon :)')
  res.redirect('/')
})

module.exports = router;