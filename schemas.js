const BaseJoi = require('joi');
const SanitizeHtml = require('sanitize-html'); 

const customJoi = (joi) => ({


    type: 'string',
    base: joi.string(),
    messages: {
        'stringSanitize': 'Do not use html'
    },
    rules: {
        htmlStrip: {

            validate(value, helpers) {

                const clean = SanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) { return helpers.error('stringSanitize') }
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(customJoi)



module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().htmlStrip().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string(),
        location: Joi.string().htmlStrip().required(),
        description: Joi.string().htmlStrip().required(),

    }).required(),
    deleteImage: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(0).max(5).required(),
        body: Joi.string().required().htmlStrip()
    }).required()
})