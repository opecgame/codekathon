const mongoose = require(`mongoose`)
const config = require(`../config`)
mongoose.connect(`${config.mongoconnect}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log(`[Logs] Client Database has connected!`)
}).catch((err) => console.log(err))