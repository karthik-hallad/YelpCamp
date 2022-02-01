const express = require("express");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const app = express();


cloudinary.config({
  cloud_name: process.env.DB_USER,
  api_key: process.env.DB_KEY,
  api_secret: process.env.DB_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Yelp-Camp",
    format: async (req, file) => 'png', 
    allowedFormats: ["png","jpg","jfif","jpeg"]
  },
});

module.exports = {
  cloudinary ,
  storage
};