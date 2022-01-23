const mongoose = require('mongoose');
main().catch(err => console.log(err));

async function main() {
  try{
  await mongoose.connect('mongodb://localhost:27017/Yelp-Camp');
  }
  catch(e){
    console.log("OH NO ERROR")
  }
}

const Campground = require('../models/campgrounds');
const cities = require('./cities')
const {descriptors,places} = require('./seedHelpers')

const seeder = (arr) => arr[Math.floor(Math.random() * arr.length)] 

const deleteAll = async()=>{
  await Campground.deleteMany({})
}

deleteAll();



let seed= async()=>{
  for(var i = 0; i < 100 ; i++){
    let location =cities[Math.floor(Math.random()*1000)];
    location=`${location.city} , ${location.state}`;
    let name = `${seeder(descriptors)} ${seeder(places)}`
    let campground = new Campground({name : name , location:location});
    await campground.save();
}
}

seed().then(() => {
  mongoose.connection.close();
})