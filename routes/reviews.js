const express = require('express');
const app = express();
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const {reviewSchema}= require('../schemas');

const Review = require('../models/reviews')
const Campground = require('../models/campgrounds');
const {reviewValidator , isLoggedIn, isReviewAuthor} = require('../middleware')

router.post('/',isLoggedIn,reviewValidator,catchAsync(async (req, res, next)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  const {body,rating}= req.body.Review;
  const author = req.user._id;
  const review = new Review({body,rating,author});
  await review.save();
  campground.reviews.push(review);
  await campground.save();
  req.flash('success','Created a new review');
  res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async (req, res, next)=>{
  const {id,reviewId}=req.params;
  await Campground.findByIdAndUpdate(id , {$pull :{ reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;