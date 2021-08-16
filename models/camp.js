const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({

    url: String,
    filename: String
})

//virtual property so that you can manipulate image url to set max width (cloudinary functionality)
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
})


const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    geoJSON: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          
        },
        coordinates: {
          type: [Number],
          
        }
    },
    description: String,
    location: String,
    image: [ImageSchema],
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