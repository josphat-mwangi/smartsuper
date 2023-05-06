const joi = require('@hapi/joi');

const categoryValidation = (data) =>{
    const schema = joi.object({
        name: joi.string().required(),
      
    });

    return schema.validate(data)
}

module.exports.categoryValidation= categoryValidation;