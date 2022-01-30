const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
  Campground: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string()
  }).required()
}).required()


module.exports.reviewSchema =Joi.object({
  Review: Joi.object({
    rating : Joi.number().min(1).max(5).precision(0).required(),
    body: Joi.string().max(100).min(7).required()
  })
}).required()