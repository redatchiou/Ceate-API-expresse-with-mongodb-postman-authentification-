const express = require('express');
const cors = require('cors');
const app = express();
const connectDatabase = require('./config/database');
const routes = require('./routes/app');
app.use(cors());
app.use(express.json());
connectDatabase();
app.use('/', routes);
require("dotenv").config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
