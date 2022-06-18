const { Schema, model } = require(`mongoose`)
const users = Schema({
    username: { default: "admin", type: String, required: true },
    password: { default: "12345678!#", type: String, required: true }
});

module.exports = model(`users`, users);
