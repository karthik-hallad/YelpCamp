const mongoose = require('mongoose')
const Schema = mongoose.Schema

const campgrounds= new Schema({ 
  name : String,
  location : String,
  description : String,
  image : String,
  price : Number
})

module.exports = mongoose.model('Campground',campgrounds);