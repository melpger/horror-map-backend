const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create horror schema & model
const HorrorSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    latitude: {
        type: mongoose.Decimal128,
        required: [true, 'Latitude is required']
    },
    longtitude: {
        type: mongoose.Decimal128,
        required: [true, 'Longitude is required']
    },
    img1: {
        data: Buffer,
        contentType: String
    },
    img2: {
        data: Buffer,
        contentType: String
    },
    img3: {
        data: Buffer,
        contentType: String
    },
    create_date: {
        type: Date,
    },
    update_date: {
        type: Date,
    },
    isPrivate: {
        type: Boolean,
        required: [true, 'isPrivate is required']
    },
    delete_flag: {
        type: Boolean
    }
});


const Horror = mongoose.model('Horror', HorrorSchema);

module.exports = Horror;