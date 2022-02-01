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
let imageCollection = [
  {
    url: 'https://res.cloudinary.com/ronn1230/image/upload/v1643694357/Yelp-Camp/amtpbvod4fgeo2pnlvpv.jpg',
    filename: 'Yelp-Camp/amtpbvod4fgeo2pnlvpv',
        },
  {
    url: 'https://res.cloudinary.com/ronn1230/image/upload/v1643694341/Yelp-Camp/tommy-lisbin-2DH-qMX6M4E-unsplash_ryaimx.jpg',
    filename: 'Yelp-Camp/tommy-lisbin-2DH-qMX6M4E-unsplash_ryaimx',
  },
  {
    url: 'https://res.cloudinary.com/ronn1230/image/upload/v1643694341/Yelp-Camp/kilarov-zaneit-Hxs6EAdI2Q8-unsplash_p2a9qy.jpg',
    filename: 'Yelp-Camp/kilarov-zaneit-Hxs6EAdI2Q8-unsplash_p2a9qy',
  },
  {
    url: 'https://res.cloudinary.com/ronn1230/image/upload/v1643694340/Yelp-Camp/everett-mcintire-BPCsppbNRMI-unsplash_q62cjr.jpg',
    filename: 'everett-mcintire-BPCsppbNRMI-unsplash_q62cjr',
  },
  {
    url: 'https://res.cloudinary.com/ronn1230/image/upload/v1643694340/Yelp-Camp/matt-whitacre-F4GGnyJ8aiI-unsplash_w9gijv.jpg',
    filename: 'Yelp-Camp/doqdnfzhqay1rvaxehne',
  },
  {
    url: 'https://res.cloudinary.com/ronn1230/image/upload/v1643694339/Yelp-Camp/chris-holder-uY2UIyO5o5c-unsplash_qxai3s.jpg',
    filename: 'Yelp-Camp/doqdnfzhqay1rvaxehne',
  },
  {
    url: 'https://res.cloudinary.com/ronn1230/image/upload/v1643694339/Yelp-Camp/daan-weijers-pSaEMIiUO84-unsplash_vixwkj.jpg',
    filename: 'Yelp-Camp/doqdnfzhqay1rvaxehne',
  },
  {
    url: 'https://res.cloudinary.com/ronn1230/image/upload/v1643694338/Yelp-Camp/tegan-mierle-fDostElVhN8-unsplash_jq1jf5.jpg',
    filename: 'Yelp-Camp/doqdnfzhqay1rvaxehne',
  },
  {
    url: 'https://res.cloudinary.com/ronn1230/image/upload/v1643694338/Yelp-Camp/scott-goodwill-y8Ngwq34_Ak-unsplash_pqpmyn.jpg',
    filename: 'Yelp-Camp/doqdnfzhqay1rvaxehne',
  },
]


let seed= async()=>{
  for(var i = 0; i < 300 ; i++){
    let city =cities[Math.floor(Math.random()*1000)];
    let location=`${city.city} , ${city.state}`;
    let name = `${seeder(descriptors)} ${seeder(places)}`
    let price = Math.floor(Math.random() * 20) + 10;
    let author = "61f506f3975196cc7b7b1eb8";
    let geometry ={
      type : 'Point',
      coordinates : [
        `${city.longitude}`,
        `${city.latitude}`
      ],
    }
    let images =[
      imageCollection[Math.floor(Math.random() * 8)],
      imageCollection[Math.floor(Math.random() * 8)],
      imageCollection[Math.floor(Math.random() * 8)]
    ]
    let description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti omnis facere dolorem consequatur nemo. Quas sit corporis autem minima a doloribus illo fugit possimus sequi! Quae laboriosam porro odio fuga?Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti omnis facere dolorem consequatur nemo. Quas sit corporis autem minima a doloribus illo fugit possimus sequi! Quae laboriosam porro odio fuga?'
   
  
    let campground = new Campground({name : name , location:location , images , description , price,  author,geometry});
    await campground.save();
}
}

seed().then(() => {
  mongoose.connection.close();
})
