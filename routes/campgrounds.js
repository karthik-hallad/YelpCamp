const express = require('express');
const app = express();
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const {campgroundSchema}= require('../schemas');

const Campground = require('../models/campgrounds');
const {isLoggedIn,isAuthor} = require('../middleware')
const campCont = require('../controllers/campgrounds')

const campgroundValidator = (req, res, next) => {
  let result=campgroundSchema.validate(req.body);
  if(result.error){
    let msg = result.error.details.map((error) => error.message).join(',');
    throw new ExpressError(msg,400);
  }else{
    next();
  }
  
}

router.get('/', catchAsync(campCont.index))

router.get('/new',isLoggedIn,catchAsync(campCont.new_form))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campCont.edit_form))

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campCont.delete))

router.patch('/:id',isLoggedIn,isAuthor,campgroundValidator,catchAsync(campCont.update))

router.get('/:id', catchAsync(campCont.show))

router.post('/',upload.single('Campground[image]'),isLoggedIn,campgroundValidator,catchAsync(campCont.create))

module.exports = router;