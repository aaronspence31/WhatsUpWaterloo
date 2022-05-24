const Joi = require('joi');
const { number } = require('joi');

module.exports.activitySchema = Joi.object({
    activity: Joi.object({
        title: Joi.string().required(),
        type: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})


