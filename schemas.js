const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
  Campground: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string(),
    geometry: Joi.object({
      type: Joi.string().required,
      coordinates: Joi.array().required
    })
  }).required(),
  deleteImages : Joi.array()
});


module.exports.reviewSchema =Joi.object({
  Review: Joi.object({
    rating : Joi.number().min(1).max(5).precision(0).required(),
    body: Joi.string().max(100).required()
  })
}).required()