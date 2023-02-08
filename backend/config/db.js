const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_PASS}@piiquante.1inzptg.mongodb.net/piiquante`
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

/////////////////////////////////////////

// mongoose
//   .connect(
//     'mongodb+srv://' +
//       process.env.DB_USER_PASS +
//       '@piiquante.1inzptg.mongodb.net/piiquante'
//     // {
//     //   useNewUrlParser: true,
//     //   useUnifiedTopology: true,
//     // }
//   )
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.log('Failed to connect to MongoDB', err));
