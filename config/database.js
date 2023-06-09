const mongoose = require('mongoose');
require("dotenv").config();
const URL_MONGOOSE = process.env.URL_MONGOOSE;
const connectDatabase = () => {
  mongoose
    .connect(URL_MONGOOSE)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Database connection error:', error));
};
module.exports = connectDatabase;
