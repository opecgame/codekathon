const express = require(`express`);
const package = require(`../package.json`);
const routes = express.Router();

require("./root/login")(routes)
require("./root/power")(routes)

routes.get("/", async (req, res) => {
    res.json({
        status: 200,
        message: "OK"
    })
})

routes.get("/version", (req, res, next) => {
    res.json({
        status: 200,
        version: package.version
    })
})

module.exports = routes;
