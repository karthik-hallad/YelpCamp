const express = require('express');
const app = express();
const PORT =3000; 
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const engine = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const {campgroundSchema,reviewSchema}= require('./schemas');


app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.engine('ejs', engine);

main().catch(err => console.log(err));

async function main() {
  try{
  await mongoose.connect('mongodb://localhost:27017/Yelp-Camp');
  }
  catch(e){
    console.log("OH NO ERROR")
  }
}


const campgroundValidator = (req, res, next) => {
  let result=campgroundSchema.validate(req.body);
  if(result.error){
    let msg = result.error.details.map((error) => error.message).join(',');
    throw new ExpressError(msg,400);
  }else{
    next();
  }
  
}

const reviewValidator = (req, res, next) => {
  let result=reviewSchema.validate(req.body);
  if(result.error){
    let msg = result.error.details.map((error) => error.message).join(',');
    throw new ExpressError(msg,400);
  }else{
    next();
  }
  
}


const Campground = require('./models/campgrounds');
const Review = require('./models/reviews')

app.get('/campgrounds', catchAsync(async (req, res, next) =>{
  // need to await as fetching takes a lot of time
  let Campgrounds = await Campground.find();
  res.render('campgrounds/index.ejs',{Campgrounds})
}))

app.get('/',(req, res)=>{
  res.render('home');
})

app.post('/campgrounds/:id/reviews',reviewValidator,catchAsync(async (req, res, next)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.Review);
  await review.save();
  console.log(review);
  campground.reviews.push(review);
  await campground.save();
  res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async (req, res, next)=>{
  const {id,reviewId}=req.params;
  await Campground.findByIdAndUpdate(id , {$pull :{ reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`)
}))

app.get('/campgrounds/new',catchAsync(async (req, res)=>{
  res.render('campgrounds/new')
}))

app.get('/campgrounds/:id/edit',catchAsync(async (req, res) =>{
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit',{campground})
}))

app.delete('/campgrounds/:id',catchAsync(async (req, res) =>{
  const id = req.params.id;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
}))

app.patch('/campgrounds/:id',campgroundValidator,catchAsync(async (req, res) =>{
  let updated = req.body.Campground;
  await Campground.findByIdAndUpdate({_id: req.params.id},{...updated});
  res.redirect(`/campgrounds/${req.params.id}`)
  
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) =>{
  const {id} = req.params;
  let campground=await Campground.findById(id).populate('reviews');
  res.render('campgrounds/show.ejs',{campground})
}))

app.post('/campgrounds',campgroundValidator,catchAsync(async (req, res) =>{
  const body = req.body.Campground;
  // if no body then the mongo doesnt give error it simply creates empty data
  if(!body) throw new ExpressError('Invalid Data',403)
  const campground = new Campground(body);
  const {_id}=await campground.save(body).then((d) => d);
  res.redirect(`/campgrounds/${_id}`)
}))

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