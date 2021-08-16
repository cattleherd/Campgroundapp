const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: [{
        url: String,
        filename: String
    }],
    reviews: [     //array of object ids which is linked to review model
        {        //one to many relationship (one campground many reviews)  
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }

    ],

    author: {

        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});


module.exports = mongoose.model('Campground', CampgroundSchema);