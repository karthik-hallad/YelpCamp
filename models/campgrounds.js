const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./reviews')

const ImageSchema = new Schema({
    url : String,
    filename : String
})

const opts = { toJSON: { virtuals: true } };
const campgrounds= new Schema({ 
  name : String,
  location : String,
  description : String,
  price : Number,
  geometry : {
    type:{
      type : String ,
      enum : ['Point'],
      required : true
    },
    coordinates :{
      type : [Number],
      required : true
    }
  },
  images : [ImageSchema],
  author :{
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  reviews : [
    {
      type: Schema.Types.ObjectId,
      ref : 'Review'
    }
  ]
},opts)

ImageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload','/upload/w_200')
})

campgrounds.virtual('properties.popupText').get(function(){
  if(this.description.length>70){
  return `<h5><a href="/campgrounds/${this._id}">${this.name}</a></h5><p>${this.description.substring(0,70)}...</p>`
  }else{
    return `<h5><a href="/campgrounds/${this._id}">${this.name}</a></h5><p>${this.description}...</p>`
  }
})

campgrounds.post('findOneAndDelete',async (doc)=>{
  if(doc.reviews.length){
    await Review.deleteMany({
      _id : { $in: doc.reviews}
    })
    console.log(doc.reviews)
  }
})

module.exports = mongoose.model('Campground',campgrounds);