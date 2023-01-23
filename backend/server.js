require('dotenv').config({ path: './config/.env' });
require('./config/db');
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT;
const app = express();

////
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

////

//middlewares
app.use(bodyParser.json());
app.use(express.json());

//server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
