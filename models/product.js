const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('./user');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload' , '/upload/w_200');
})

const ProductSchema = new Schema({
    title : String,
    description : String,
    location : String,
    price : Number,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: user
    }
})

module.exports = mongoose.model('Product' , ProductSchema);

