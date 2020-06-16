# interview-test

# Query & Api’s
Task -1

query - 
db.collection.find({awards : {$gte : 26}})

URL - /awards?awards=40

Task -2 

query - 
db.collection.find({year : {$gte : 26}})

URL - /award_year?year=2003

Task – 3

query - 
db.collection.aggregate(
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
)

URL - /total_details


Task - 4
query - 
db.collection.find({
    "birthdate": {
        "$gte":  ISODate("1991-06-17T00:00:00Z") 
    },
    "price": {
        "$gte": 1000
    }
});

URL - /birthdate?date=1991-12-09T05:00:00.000Z&price=3000


