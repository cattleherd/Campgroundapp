const mongoose = require('mongoose')
const Campground = require('../models/camp')
const cities = require('./cities')
const {places, descriptors} = require('./seedhelper');

mongoose.connect('mongodb://localhost:27017/campdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected')
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 10; i++){
      const random1000 = Math.floor(Math.random() * 1000)
      const price = Math.floor(Math.random()* 20 + 10)
      const camp = new Campground({
        author: '610406077e17a42504b44a99',
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: 'http://source.unsplash.com/collection/484351',
        description: 'lorem dsjflasdkjhfkasjdfh asdkljfhaskdfjh adslkfhasdlkfjh asdkjfhasdklfjhasfdkjh sldkajfhsakdjfh sadlkfjhsadlkjfh laskdjfhaslkdjfh',
        price
      })
      await camp.save();  
    }
}

seedDB();