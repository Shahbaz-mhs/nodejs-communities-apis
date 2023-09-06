const Joi = require('joi');

const roleV = Joi.object({
    name: Joi.string().required().min(3),
})


const signupV = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6)
})


const signinV = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
})


const communityV = Joi.object({
    name: Joi.string().required().min(2)
})


const memberV = Joi.object({
    community: Joi.string().required(),
    user: Joi.string().required(),
    role: Joi.string().required(),
})

module.exports = {
    roleV,
    signupV,
    signinV,
    communityV,
    memberV
}