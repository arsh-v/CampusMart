const Campground = require('../models/campground');
const Product = require('../models/product');
const flash = require('connect-flash');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary/index');


module.exports.index = async (req, res, next) => {
    const products = await Product.find({});
    // console.log(products[0].images);
    res.render('campgrounds/index', { products : products ,user : req.user });
}
module.exports.index2 = async (req, res, next) => {
    const products = await Product.find({});
    // const {search , min , max} = req.body.find;
    // console.log(search);
    // console.log(min);
    // console.log(max);
    console.log(req.body);
    // console.log(products[0].images);
    res.render('campgrounds/index', { products });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.product.location,
        limit: 1
    }).send();
    const product = new Product(req.body.product);
    product.geometry = geoData.body.features[0].geometry;
    product.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    product.author = req.user._id;
    await product.save();
    console.log(product);
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${product._id}`)

}

module.exports.showCampground = async (req, res, next) => {
    // const { id } = req.params;
    const product = await Product.findById(req.params.id).populate('author');
    // console.log(campground);
    if (!product) {
        console.log('product not found');
        req.flash('error', 'Cannot find that Campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { product });
}


module.exports.renderEdit = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        req.flash('error', 'Cannot find that Campground!');
        return res.redirect(`/campgrounds/${product._id}`);
    }

    res.render('campgrounds/edit', { product });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.product.location,
        limit: 1
    }).send();
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product })
    product.geometry = geoData.body.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    product.images.push(...imgs);
    await product.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    // await campground.save();
    req.flash('success', 'Successfully Updated a campground!');
    res.redirect(`/campgrounds/${product._id}`);
}

module.exports.destroycampground = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted a campground!');
    res.redirect('/campgrounds');
}













// .populate({
//     path: 'reviews',
//     populate: {
//         path: 'author'
//     }
// })