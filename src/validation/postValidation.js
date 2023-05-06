const joi = require('@hapi/joi');


const postValidation = (data) =>{
    console.log(data)
    const schema = joi.object({
        productName: joi.string().required(),
        category: joi.string().required(),
        noOfItems: joi.number().integer().positive().required(),
        description: joi.string().required(),
        productImage: joi.string().required(),
        unitPrice: joi.number().integer().positive().required(),
    
    });

    return schema.validate(data)
}

module.exports.postValidation = postValidation;