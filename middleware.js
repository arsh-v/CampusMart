const { productSchema , campgroundSchema, reviewSchema ,findSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground')
const Review = require('./models/review');
const Product = require('./models/product');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // console.log(req.path);
        // console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in')
        return res.redirect('/login');
    }
    next();
}

module.exports.validatFind = (req,res,next) =>{
    console.log(req.body);
    const {error} = findSchema.validate(req.body);
    if(error)
    {
        console.log(req.body);
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg , 400);
    }
    else
    {
        next();
    }
}

module.exports.validateproduct = (req,res,next) =>{
    
    const { error } = productSchema.validate(req.body);
    if(error)
    {
        console.log(req.body);
        console.log(error);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg , 400);
    }
    else
    {
        next();
    }
}
module.exports.validatecampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        console.log(error);
        // let cnt = "";
        // for (let el of error.details) {
        //     cnt += el.message + ',';
        // }
        const msg = error.details.map(el => el.message).join(',');
        // const msg = cnt;
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
    // console.log(result);
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${product._id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}