const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type:String
  },
  lastname:  {
    type:String
  },

  password:  {
    type:String
  },
});

const user = mongoose.model("user", UserSchema);

module.exports =user ;
