const express = require('express');
const app = express();
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');
const reviewCont = require('../controllers/reviews')
const {reviewValidator , isLoggedIn, isReviewAuthor} = require('../middleware')

router.post('/',isLoggedIn,reviewValidator,catchAsync(reviewCont.edit))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviewCont.delete))

module.exports = router;