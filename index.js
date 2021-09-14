const express       = require('express');           // Import express
const bodyParser    = require('body-parser');       // Import Body parser
const mongoose      = require('mongoose');          // Import Mongoose

// Initialise the app
const app = express();

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/resthub');
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(express.json());

app.use('/api',require('./Routes/api'));

// error handling middleware
app.use(function(err,req,res,next){
    //console.log(err);
    res.status(422).send({error: err.message});
});

// listen for requests
app.listen(process.env.port || 4000, function(){
    console.log('Ready to Go!');
});

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World'));
