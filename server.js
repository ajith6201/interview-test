const express = require('express');
const bodyParser= require('body-parser')
const app = express();


const MongoClient = require('mongodb').MongoClient;



  var connectionString = 'mongodb://127.0.0.1:27017';

  MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('sample');

    const collection = db.collection('authors');
    
    const collection_book = db.collection('books');

    app.get('/awards', (req, res) => {
        var value = parseInt(req.query.awards); 
        collection.find({awards : {$exists:true}, $where:'this.awards.length>='+value}).toArray(function(err, docs) {
            if(err)
            {
                res.status(400).json(err);
            }
            res.status(200).json(docs);           
          });
    });


    app.get('/award_year', (req, res) => { 
        var value = parseInt(req.query.year); console.log(value);
        collection.find({"awards": { $elemMatch: { year: { $gte: value } } }}).toArray(function(err, docs) {
            if(err)
            {
                res.status(400).json(err);
            }
            res.status(200).json(docs);           
          });
    });


    app.get('/total_details', (req, res) => { 
        
      collection_book.aggregate(
            [
              {
                "$lookup":
                {  
                  from: 'authors',  
                  localField: 'authorId',  
                  foreignField: '_id',  
                  as: 'authors'
                }
              },
              {
                $group:
                {
                  _id:"$authorId",
                  totalSold: 
                  { 
                    $sum: '$sold'  
                  },
                  totalProfit:
                  {
                    $sum:
                    {
                      $multiply:["$price","$sold"]
                    }
                  }
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
        
        collection.aggregate([
          {
            $match:
            {
              birth: { $gte: new Date(bdate)}
            }
          },
          {
            $lookup:
            {  
              from: 'books',  
              localField: '_id',  
              foreignField: 'authorId',  
              as: 'books'
            }
          },
          { 
            $unwind: "$books" 
          },
          {
            $group:
            {
              _id:"$books.authorId",
              totalPrice:
              {
                $sum:"$books.price"
              }
            }
          },
              {
            $match:
            {
              totalPrice: { $gte: price}
            }
          }
          ]).toArray(function(err, docs) {
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