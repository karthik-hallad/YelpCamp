const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./reviews')

const campgrounds= new Schema({ 
  name : String,
  location : String,
  description : String,
  image : String,
  price : Number,
  reviews : [
    {
      type: Schema.Types.ObjectId,
      ref : 'Review'
    }
  ]
})

campgrounds.post('findOneAndDelete',async (doc)=>{
  if(doc.reviews.length){
    await Review.deleteMany({
      _id : { $in: doc.reviews}
    })
    console.log(doc.reviews)
  }
  else{
    next()
  }
})

module.exports = mongoose.model('Campground',campgrounds);