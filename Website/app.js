/**
 * @author OpecZ CH <me@opecgame.in.th>
 */


// http://localhost:7000/

const express = require('express');
const app = express();
const logger = require("./modules/logger")
const config = require("./config")
const bodyParser = require("body-parser");
const path = require("path")
const cookies = require("cookies")

app.use((req, res, next) => {
    res.set({
        'X-Powered-By': ['PHP/5.3.29', 'PleskLin'],
        'Server': 'Apache/2.4.52 (Win64) OpenSSL/1.1.1m PHP/5.3.29'
    })
    next()
});
app.set('trust proxy', true);
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookies.express("a", "b", "c"));



app.use("/",
    require("./routes/root")
)




app.use(function (req, res, next) {
    const err = new Error('ไม่พบหน้าดังกล่าว');
    err.status = 404;
    next(err);
});


app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render(`err/err`, {
        errcode: err.status,
        errmsg: err.message || "ไม่พบหน้าที่คุณค้นหาหรือถูกลบไปแล้ว...",
    });
});


app.listen(config.port, () => {
    logger.info(`Server Listen on Port : ${config.port}`)
})



process.on('unhandledRejection', (reason, p) => {
    if (reason.message === "Missing Access" && reason.path.split("/")[5] === "commands") {
        console.log("\n[err] Missing Access to put SlashCommands | guildId => " + reason.path.split("/")[4])
    } else {
        console.log('\n=== unhandled Rejection ==='.toUpperCase())
        console.log('Promise: ', p , 'Reason: ', reason.stack ? reason.stack : reason);
        console.log('=== unhandled Rejection ==='.toUpperCase())
    }
})
process.on("uncaughtException", (err, origin) => {
    console.log('\n=== uncaught Exception ==='.toUpperCase())
    console.log('Origin: ', origin, 'Exception: ', err.stack ? err.stack : err)
    console.log('=== uncaught Exception ==='.toUpperCase())
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('\n=== uncaught Exception Monitor ==='.toUpperCase())
    console.log('Origin: ', origin, 'Exception: ', err.stack ? err.stack : err)
    console.log('=== uncaught Exception Monitor ==='.toUpperCase())
})
process.on('beforeExit', (code) => {
    console.log('\n=== before Exit ==='.toUpperCase())
    console.log('Code: ', code);
    console.log('=== before Exit ==='.toUpperCase())
})
process.on('exit', (code) => {
    console.log('\n=== exit ==='.toUpperCase())
    console.log('Code: ', code)
    console.log('=== exit ==='.toUpperCase())
})
process.on('multipleResolves', (type, promise, reason) => {
    console.log('\n=== multiple Resolves ==='.toUpperCase())
    console.log(type, promise, reason)
    console.log('=== multiple Resolves ==='.toUpperCase())
})
