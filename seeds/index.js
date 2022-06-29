const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Product = require('../models/product');
const fakepros = require('./fakepros');


mongoose.connect('mongodb://localhost:27017/omg', {
    useNewUrlParser: true,
    // useCreateIndex: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected");
})

// const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Product.deleteMany({});
    for (let i = 0; i < fakepros.length ; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const product = new Product({
            // your user id
            author: '62b948c61eaa343b382d34c2',
            title: fakepros[i].title,
            description: fakepros[i].description,
            price: price,
            location : "Bramhaputra Hostel IIT Guwahati , Assam",
            geometry : {
                type : 'Point',
                coordinates : [91.731377,26.148043]
            },
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
                    filename: 'img1'
                },
                {
                    url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                    filename: 'img2'
                },
                {
                    url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
                    filename: 'img3'
                }
            ]
        })
        await product.save();
        // console.log(product);
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})