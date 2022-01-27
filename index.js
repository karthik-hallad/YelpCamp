const express = require('express');
const app = express();
const PORT =3000; 
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const engine = require('ejs-mate');


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

const Campground = require('./models/campgrounds');

app.get('/campgrounds', async (req, res, next) =>{
  // need to await as fetching takes a lot of time
  let Campgrounds = await Campground.find();
  res.render('campgrounds/index.ejs',{Campgrounds})
})

app.get('/',(req, res)=>{
  res.render('home');
})


app.get('/campgrounds/new',async (req, res)=>{
  res.render('campgrounds/new')
})

app.get('/campgrounds/:id/edit',async (req, res) =>{
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit',{campground})
})

app.delete('/campgrounds/:id',async (req, res) =>{
  const id = req.params.id;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
})

app.patch('/campgrounds/:id',async (req, res) =>{
  let updated = req.body.Campground;
  console.log(updated)
  await Campground.findByIdAndUpdate({_id: req.params.id},{...updated});
  res.redirect(`/campgrounds/${req.params.id}`)
  
})

app.get('/campgrounds/:id', async (req, res) =>{
  const {id} = req.params;
  let campground=await Campground.findById(id);
  res.render('campgrounds/show.ejs',{campground})
})

app.post('/campgrounds',async (req, res) =>{
  const body = req.body.Campground;
  const campground = new Campground(body);
  const {_id}=await campground.save(body).then((d) => d);
  res.redirect(`/campgrounds/${_id}`)
})

app.use((req,res, next)=>{
  res.status(404).send('<h1>NOT FOUND<h1><br><h2>Please check the url<h2>');
})

app.listen(PORT,()=>{
  console.log("Listening on port "+PORT);
})