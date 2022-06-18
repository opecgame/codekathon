const mongoose = require("mongoose")
module.exports = () => {
    mongoose.connect("").then(() => {
        console.log(`Mongo Connect`);
    })
}