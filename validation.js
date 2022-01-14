const Joi = require("joi");

const registerValid = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        type: Joi.number().integer().max(2).min(1),
        gender: Joi.string(),
        birthday: Joi.string().max(10),
        address: Joi.string().max(255)
    });
    return schema.validate(data);
}

const loginValid = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    }); 
    return schema.validate(data);
}

const courseValid = data => {
    const schema = Joi.object({
        name : Joi.string().min(6).required(),
        subject_id : Joi.number().integer(),
        time_start : Joi.string().min(4).required(),
        time_end : Joi.string().min(4).required(),
        day_study : Joi.number().integer().max(8).min(2),
        max_slot : Joi.number().integer().min(1),
        fee : Joi.number().integer(),
    }); 
    return schema.validate(data);
}

module.exports.registerValid = registerValid;
module.exports.loginValid = loginValid;
module.exports.courseValid = courseValid;