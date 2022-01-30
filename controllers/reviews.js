const Campground = require('../models/campgrounds')
const Review = require('../models/reviews')


module.exports.edit = async (req, res, next)=>{
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
}

module.exports.delete = async (req, res, next)=>{
  const {id,reviewId}=req.params;
  await Campground.findByIdAndUpdate(id , {$pull :{ reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`)
}