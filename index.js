const express = require('express');
const app = express();
const PORT =3000; 
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

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

app.get('/campgrounds', async (req, res) =>{
  // need to await as fetching takes a lot of time
  let Campgrounds = await Campground.find();
  console.log(Campgrounds)
  res.render('campgrounds/index.ejs',{Campgrounds})
})

app.get('/campgrounds/new',async (req, res)=>{
  res.render('campgrounds/new')
})

app.get('/campgrounds/:id', async (req, res) =>{
  const {id} = req.params;
  let campground=await Campground.findById(id);
  res.render('campgrounds/show.ejs',{campground})
})

app.get('*',()=>{
  console.log('I DONT KNOW THIS PATH');
})

app.listen(PORT,()=>{
  console.log("Listening on port "+PORT);
})