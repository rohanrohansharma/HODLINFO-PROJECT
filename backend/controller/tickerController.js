var express = require('express');
var app = express.Router();
app.use(express.json());
const {connection} = require("../config/database");
const axios = require('axios');
async function fetchData(){
    return await axios.get('https://api.wazirx.com/api/v2/tickers');
}
app.post('/fetch-data', async (req, res) => {
    try {
      const response = await fetchData();
      const tickers = response.data;
      const top10 = Object.values(tickers).slice(0, 10);
  
      for (const item of top10) {
        const { name, last, buy, sell, volume, base_unit } = item;
        
        console.log(name , last, buy, sell , volume, base_unit);
        // Insert data into MySQL
        connection.query('INSERT INTO tickers (name, last, buy, sell, volume, base_unit) VALUES (?, ?, ?, ?, ?, ?)', [name, last, buy, sell, volume, base_unit], (err, result) => {
          if (err) throw err;
          console.log('Inserted data:', { name, last, buy, sell, volume, base_unit });
        });
      }
  
      res.status(200).json({
        data:tickers,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
    }
  });
  
  app.get('/getdata' ,async (req, res) => {
    try{
        connection.query('SELECT * FROM tickers', (error, results) => {
            if (error) {
                console.error('Database query error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
                return; 
            }
    
            return res.status(200).json(results);
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"issue while fetching the data from database",
        })
    }
  })
  module.exports=app;