const Joi = require("joi");

const schema = Joi.object({
    identity: Joi.alternatives(
        Joi.string().pattern(new RegExp("^[a-zA-Z0-9_]*$")).max(30).artifact("username"),
        Joi.string().email().artifact("email")
    ).required()
});

const object = {
    identity: "tunggnut@gmail.com"
};

const { value, error, artifacts } = schema.validate(object);

if (error) {
    console.log(error);
} else {
    console.log(value);
}

console.log(artifacts);
console.log(artifacts.has("email"));
