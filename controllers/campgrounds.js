const { model } = require('mongoose');
const Campground = require('../models/campgrounds')

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
  await Campground.findByIdAndUpdate({_id: req.params.id},{...updated});
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
  const body = req.body.Campground;
  body.author = req.user._id;
  // if no body then the mongo doesnt give error it simply creates empty data
  if(!body) throw new ExpressError('Invalid Data',403)
  const campground = new Campground(body);
  const {_id}=await campground.save(body).then((d) => d);
  req.flash('success',"Successfully created a campground")
  res.redirect(`/campgrounds/${_id}`)
}