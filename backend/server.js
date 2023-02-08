require('dotenv').config({ path: './config/.env' });
require('./config/db');
const express = require('express');
// const bodyParser = require('body-parser');
const port = process.env.PORT;
const app = express();
const path = require('path');
const userRoute = require('./routes/userRoute');
const sauceRoute = require('./routes/sauceRoute');

////
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
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
// app.use(bodyParser.json());
app.use(express.json());

//routes
app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use(express.static('images'));

app.use('/api/auth', userRoute);
app.use('/api/sauces', sauceRoute);

//server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
