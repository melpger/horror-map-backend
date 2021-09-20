const express = require('express'); // Import express
const router = express.Router();
const auth = require('./Middleware/auth');

const userRouter = require('./Routes/user');
const horrorRouter = require('./Routes/horror');
require('./db/db');
require('dotenv').config();

// Initialise the app
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use('/api', auth);
app.use('/api', userRouter);
app.use('/api', horrorRouter);

// error handling middleware
app.use(function (err, req, res, next) {
    res.status(422).send({
        error: err.message
    });
});

// listen for requests
app.listen(process.env.port || 4000, function () {
    console.log('Ready to Go!');
});

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World'));