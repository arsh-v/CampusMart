const Basejoi = require('joi');
// const { validate } = require('./models/review');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) =>({
    type: 'string',
    base: joi.string(),
    messages :{
        'string.escapeHTML' : '{{#label}} must not include HTML'
    },
    rules : {
        escapeHTML : {
            validate(value,helpers){
                const clean = sanitizeHtml(value , {
                    allowedTags : [],
                    allowedAttributes : {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML',{value})
                return clean;
            }
        }
    }
});

const joi = Basejoi.extend(extension);


module.exports.productSchema = joi.object({
    product: joi.object({
        title : joi.string().required().escapeHTML(),
        price: joi.number().required().min(0),
        location: joi.string().required().escapeHTML(),
        description: joi.string().required().escapeHTML()
    }).required(),
    deleteImages : joi.array()
})

module.exports.findSchema = joi.object({
    find : joi.object({
        search : joi.string().escapeHTML(),
        min : joi.number(),
        max: joi.number()
    }).required()
})

module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required().escapeHTML(),
        price: joi.number().required().min(0),
        location: joi.string().required().escapeHTML(),
        // image: joi.string().required(),
        description: joi.string().required().escapeHTML()
    }).required(),
    deleteImages: joi.array()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required().escapeHTML()
    }).required()
})