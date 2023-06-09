const mongoose = require("mongoose");
const ProductSchema= mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  detail: String,
  price: Number,
  hero: String,
  image: String,
});
const product=mongoose.model("product",ProductSchema)
module.exports =  product;
