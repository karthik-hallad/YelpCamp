const { model } = require('mongoose');
const campgrounds = require('../models/campgrounds');
const Campground = require('../models/campgrounds')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_ACCESS_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})
const {cloudinary} = require('../cloudinary')

module.exports.index =async (req, res, next) =>{
  // need to await as fetching takes a lot of time
  let Campgrounds = await Campground.find();
  res.render('campgrounds/index.ejs',{Campgrounds})
}

module.exports.new_form =async (req, res)=>{
  res.render('campgrounds/new')
}

module.exports.edit_form =async (req, res) =>{
  const campground = await Campground.findById(req.params.id);
  if(!campground){
    req.flash('error', 'Cannot find that campground');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit',{campground})
}

module.exports.delete =async (req, res) =>{
  const id = req.params.id;
  await Campground.findByIdAndDelete(id);
  req.flash('info','Successfully delted the campground');
  res.redirect('/campgrounds')
}

module.exports.update =async (req, res) =>{
  let updated = req.body.Campground;
  let campground=await Campground.findByIdAndUpdate({_id: req.params.id},{...updated});
  // map returns a array but in each iteration returns a single object
  req.files.forEach((file,i) =>{
    campground.images.push({url:file.path , filename:file.filename})
  })
  await campground.save();
  if(req.body.deleteImages){
    for( let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename)
    }
    await campground.updateOne({$pull : { images : { filename : {$in:req.body.deleteImages }}}})
  }
  req.flash('info','Successfully updated the campground');
  res.redirect(`/campgrounds/${req.params.id}`)
}

module.exports.show = async (req, res) =>{
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
}


module.exports.create = async (req, res) =>{
  console.log(req.files)
  let body = req.body.Campground;
  body.author = req.user._id;
  // if no body then the mongo doesnt give error it simply creates empty data
  if(!body) throw new ExpressError('Invalid Data',403)
  const campground = new Campground(body);
  let response=await geocoder.forwardGeocode({
    query: req.body.Campground.location,
    limit :1
  })
    .send()
  let geometry = response.body.features[0].geometry;
  campground.geometry = geometry;
  // forEach first arg is what it contains and second arg is the index
  req.files.forEach((file,i) =>{
    campground.images.push({url:file.path , filename:file.filename})
  })
  const {_id}=await campground.save().then((d) => d);
  req.flash('success',"Successfully created a campground")
  res.redirect(`/campgrounds/${_id}`)
}