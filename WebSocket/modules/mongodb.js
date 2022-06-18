const mongoose = require("mongoose")
module.exports = () => {
    mongoose.connect("mongodb+srv://pkw:pkw%40)8Em!p%23s2r~6KS.%2F@cluster0.rjnsq.mongodb.net/codekathon").then(() => {
        console.log(`Mongo Connect`);
    })
}