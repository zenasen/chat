var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send("Hello world!");
});
// app.get('/hello', function(req, res){
    // res.send("Hello page ssssdsdasd");
// });
// app.get('/:id', function(req, res){
    // res.send('The id you specified is ' + req.params.id);
// });
var things = require('./things.js'); 
//both index.js and things.js should be in same directory
app.use('/things', things); 
app.listen(3000);