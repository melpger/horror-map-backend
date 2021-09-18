const mongoose = require('mongoose'); // Import Mongoose

mongoose.connect(process.env.MONGODB_URL, {
    // useNewUrlParser: true,
    // useCreateIndex: true
});
mongoose.Promise = global.Promise;