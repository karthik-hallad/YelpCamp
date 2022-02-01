const express = require('express');
const app = express();
const Campground = require('./models/campgrounds');
const Review = require('./models/reviews')
const {reviewSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn= (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in to see this page');
    return res.redirect('/login'); //must return this otherwise next line runs and sends error to console
  }
  next();
};

module.exports.isAuthor = async (req, res, next)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  if(! campground.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to view this page');
    return res.redirect(`/campgrounds/${id}`); 
  }
  next();
}

module.exports.reviewValidator = (req, res, next) => {
  let result=reviewSchema.validate(req.body);
  if(result.error){
    let msg = result.error.details.map((error) => error.message).join(',');
    throw new ExpressError(msg,400);
  }else{
    next();
  }
}

module.exports.isReviewAuthor = async (req, res, next) =>{
  const {id,reviewId}=req.params;
  const review = await Review.findById(reviewId);
  if(! req.user._id.equals(review.author)){
    next(new ExpressError('You do not have permission to do that',402));
  }
  next();
}
