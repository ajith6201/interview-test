const express = require('express');
const bodyParser= require('body-parser')
const app = express();


const MongoClient = require('mongodb').MongoClient;



  var connectionString = 'mongodb://127.0.0.1:27017/test1';

  MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('test1');

    const collection = db.collection('authors');

    app.get('/awards', (req, res) => {
        var value = parseInt(req.query.awards); console.log(value);
        collection.find({awards : {$gte : value}}).toArray(function(err, docs) {
            if(err)
            {
                res.status(400).json(err);
            }
            res.status(200).json(docs);           
          });
    });


    app.get('/award_year', (req, res) => { 
        var value = parseInt(req.query.year); console.log(value);
        collection.find({award_year : {$gte : value}}).toArray(function(err, docs) {
            if(err)
            {
                res.status(400).json(err);
            }
            res.status(200).json(docs);           
          });
    });


    app.get('/total_details', (req, res) => { 
        
          collection.aggregate(
            [
              // First Stage
              {
                $group :
                  {
                    _id : "$author_name",
              totalBookSold: { $sum: "$books_sold"},
                    totalProfit: { $sum: { $multiply: [ "$books_sold", "$price" ] } }
                  }
               }
             ]
           ).toArray(function(err, docs) {
            if(err)
            {
                res.status(400).json(err);
            }
            res.status(200).json(docs);           
          });
    });



    app.get('/birthdate', (req, res) => 
    { 
        var dateObj = new Date(req.query.date); 
        var bdate = dateObj.toISOString(); 
        var price = parseInt(req.query.price);
        
        collection.find({
            birthdate: {
                $gte: new Date(bdate)
            },
            price: {
                $gte: price
            }
        }).toArray(function(err, docs) {
          if(err)
          {
              res.status(400).json(err);
          } console.log(docs);
          res.status(200).json(docs);           
        });
    });

  });




app.listen(3000, function() {
    console.log('listening on 3000')
  })