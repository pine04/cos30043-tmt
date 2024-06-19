const Joi = require("joi");

const registrationSchema = Joi.object({
    username: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_]*$")).max(30).required().messages({
        "any.required": "Username is required.",
        "string.empty": "Username cannot be empty.",
        "string.pattern.base":
            "Username can only consist of alphanumeric characters and underscores.",
        "string.max": "The maximum length for username is 30 characters."
    }),
    email: Joi.string().email().required().messages({
        "any.required": "Email is required.",
        "string.empty": "Email cannot be empty.",
        "string.email": "Email is invalid."
    }),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")).required().messages({
        "any.required": "Password is required.",
        "string.empty": "Password cannot be empty.",
        "string.pattern.base":
            "Password must consist of alphanumeric characters and be between 8 and 30 characters in length."
    }),
    cfPassword: Joi.string().equal(Joi.ref("password")).required().messages({
        "any.required": "Confirm password is required.",
        "any.only": "Confirm password does not match password."
    })
});

const loginSchema = Joi.object({
    username: Joi.string().messages({
        "string.empty": "Username cannot be empty."
    }),
    email: Joi.string().email().messages({
        "string.empty": "Email cannot be empty.",
        "string.email": "Email is invalid."
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required.",
        "string.empty": "Password cannot be empty."
    })
})
    .xor("username", "email")
    .messages({
        "object.missing": "Please provide either username or email.",
        "object.xor": "Please provide either username or email, not both."
    });

module.exports = {
    registrationSchema,
    loginSchema
};
