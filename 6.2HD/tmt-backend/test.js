const Joi = require("joi");

const schema = Joi.object({
    birthdate: Joi.string().isoDate().required().messages({
        "any.required": "Birthdate is required.",
        "string.isoDate": "Birthdate must be in ISO 8601 date format."
    })
});

const d = new Date();

const obj = {
    birthdate: "asdasd"
}

const { value, error } = schema.validate(obj);
console.log(value, error);

let { a } = obj;
a ??= "hello";
console.log(a);