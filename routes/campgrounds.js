const express = require('express');
const app = express();
const router = express.Router();


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const {campgroundSchema}= require('../schemas');

const Campground = require('../models/campgrounds');
const {isLoggedIn,isAuthor} = require('../middleware')

const campgroundValidator = (req, res, next) => {
  let result=campgroundSchema.validate(req.body);
  if(result.error){
    let msg = result.error.details.map((error) => error.message).join(',');
    throw new ExpressError(msg,400);
  }else{
    next();
  }
  
}

router.get('/', catchAsync(async (req, res, next) =>{
  // need to await as fetching takes a lot of time
  let Campgrounds = await Campground.find();
  res.render('campgrounds/index.ejs',{Campgrounds})
}))

router.get('/new',isLoggedIn,catchAsync(async (req, res)=>{
  res.render('campgrounds/new')
}))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async (req, res) =>{
  const campground = await Campground.findById(req.params.id);
  if(!campground){
    req.flash('error', 'Cannot find that campground');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit',{campground})
}))

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(async (req, res) =>{
  const id = req.params.id;
  await Campground.findByIdAndDelete(id);
  req.flash('info','Successfully delted the campground');
  res.redirect('/campgrounds')
}))

router.patch('/:id',isLoggedIn,isAuthor,campgroundValidator,catchAsync(async (req, res) =>{
  let updated = req.body.Campground;
  await Campground.findByIdAndUpdate({_id: req.params.id},{...updated});
  res.redirect(`/campgrounds/${req.params.id}`)
  
}))

router.get('/:id', catchAsync(async (req, res) =>{
  const {id} = req.params;
  let campground=await Campground.findById(id).populate('author').populate({
    path : 'reviews' ,
    populate : {
      path : 'author',
    }
  });
  if(!campground){
    req.flash('error', 'Cannot find that campground');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show.ejs',{campground})
}))

router.post('/',isLoggedIn,campgroundValidator,catchAsync(async (req, res) =>{
  const body = req.body.Campground;
  body.author = req.user._id;
  console.log(body)
  // if no body then the mongo doesnt give error it simply creates empty data
  if(!body) throw new ExpressError('Invalid Data',403)
  const campground = new Campground(body);
  const {_id}=await campground.save(body).then((d) => d);
  req.flash('success',"Successfully created a campground")
  res.redirect(`/campgrounds/${_id}`)
}))

module.exports = router;