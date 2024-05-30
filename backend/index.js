
const express = require('express');
const app = express();
const cors = require ('cors');
const { connectDB } = require('./config/database');
connectDB();
const tickerController = require('./controller/tickerController');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
      origin: "*",
    })
  );
app.use('/api', tickerController);



app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});

module.exports=app;