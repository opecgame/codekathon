const mongoose = require("mongoose")
const config = require("../config");
module.exports = () => {
    mongoose.connect("").then(() => {
        console.log(`Mongo Connect`);
    })
}

