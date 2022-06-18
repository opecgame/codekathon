/**
 * 
 * @param {import ("express").Router} routes 
 */

const WebSocket = require("ws");
const middleware = require("../../modules/middleware");

module.exports = (routes) => {

    const ws = new WebSocket("ws://localhost:3333", {
        headers: {
            "Authorization": "C0d3KatHoN",
            "User-Agent": "PKWClient/0.1 (compatible; PKWbot/1.0; +https://www.pkw.ac.th;)"
        }
    });

    ws.on("open", () => {
        console.log("connected")
    });

    ws.on("message", (data) => {
        console.log(JSON.parse(data))
        console.log(JSON.parse(data).data.action)
        if (JSON.parse(data).data.action) process.emit(JSON.parse(data).data.action, JSON.parse(data));
        else process.emit("wsmessage", JSON.parse(data));
    })
    

    routes.post("/power", middleware ,async (req, res, next) => {



        ws.send(JSON.stringify({
            op: 0,
            data: {
                action: "power",
                pin: req.body.pin,
                status: req.body.status
            }
        }));

        res.json({
            status: 200,
            data: {
                power: req.body.status ? 1 : 0
            }
        })
    })


    routes.get("/dht", (req, res) => {
        ws.send(JSON.stringify({
            op: 0,
            data: {
                action: "dht"
            }
        }));
        process.once("wsmessage", (data) => {
            res.json({
                status: 200,
                data: {
                    temp: data.data.temp,
                    hum: data.data.hum
                }
            })
        })
    })


    routes.get("/getdefault", (req, res) => {
        ws.send(JSON.stringify({
            op: 0,
            data: {
                "action": "checkout",
                "pin": [
                    "17",
                    "27",
                    "22",
                    "21"
                ]
            }
        }));

        process.once("wsmessage", (data) => {
            res.json({
                status: 200,
                data: {
                    status: data.data.status
                }
            })
        })
    })


    routes.post("/resetpassword", async (req, res, next) => {
        ws.send(JSON.stringify({
            "op": 0,
            "data": {
                "action": "resetpassword",
                "username": req.body.username,
                "newpassword": req.body.password,
                "key": req.body.key
            }
        }))

        process.on("resetpassword", (a) => {
            res.status(a.data.status ? 200 : 400).json({
                status: a.data.status ? 200 : 400
            })
        })
        
    })

    routes.post("/needresetpassword", async (req, res, next) => {
        ws.send(JSON.stringify({
            "op": 0,
            "data": {
                "action": "needresetpassword",
            }
        }))

        res.json({
            status: 200
        })
    })

}