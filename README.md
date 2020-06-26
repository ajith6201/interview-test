# interview-test

# Query & Api’s


**Task -1**

query - 

db.authors.find( {awards : {$exists:true}, $where:'this.awards.length>=4'} ).pretty();

URL - localhost:3000/awards?awards=4

**Task -2**

query - 

db.authors.find( { "awards": { $elemMatch: { year: { $gte: 2011 } } } } ).pretty();

URL - localhost:3000/award_year?year=1998

**Task – 3**

query - 

db.books.aggregate(
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
    ).pretty();

URL - localhost:3000/total_details


**Task - 4**

query - 

db.authors.aggregate([
    {
      $match:
      {
        birth: { $gte: ISODate('1906-12-09T05:00:00.000Z')}
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
        totalPrice: { $gte: 7000}
      }
    }
    ]).pretty();

URL - localhost:3000/birthdate?date=1906-12-09T05:00:00.000Z&price=5000


