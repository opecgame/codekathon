//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//                      Satu 99 !!
//

/**
 * Feature 
 * - Auto reconnect
 * 
 * 
 */

const allpin = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
]

const pin = []

const WebSocket = require("ws");
const axios = require("axios");
const config = require("./config")
const wss = new WebSocket.Server({
    port: config.port
});
const qs = require('qs');
const mongoose = require("mongoose")
require("./modules/mongodb")()
const users = require("./databases/users");
/**
 * @param {number} recoverykey
 */
let recoverykey = 000000

wss.on("listening", async () => {
    console.log(`Websocket server is listening on port ${config.port}`);


    sendLine("Websocket Server Ready !")

    const checkusers = await users.find();
    if (checkusers.length == 0) {
        await users.create({
            username: "admin",
            password: "12345678!#"
        })

        sendLine("Default Passowrd Added !")

    }

})


wss.on('connection', (ws, req) => {

    ws.on("close", () => {
        sendLine(`${ws.usertype} ได้ตัดการเชื่อมต่อแล้ว`)
    })

    const key = req.headers.authorization
    if (key != config.key) {
        return ws.close()
    }

    if (req.headers["user-agent"] == config.useragent.client) {
        ws.usertype = "Client"
        sendLine("มีการเชื่อมต่อใหม่จาก Client")
    } else if (req.headers["user-agent"] == config.useragent.server) {
        ws.usertype = "Server"
        sendLine("มีการเชื่อมต่อใหม่จาก Server")
    } else {
        return ws.close();
    }

    console.log(ws.usertype)

    ws.on("message", async (RawMSG) => {
        /**
         * @param { object } msg
         */
        const msg = JSON.parse(RawMSG);
        console.log(msg)

        if (ws.usertype == "Client") {


            if (msg.data.action == "line") {
                return sendLine(msg.data.message)
            }

            if (msg.data.action == "needresetpassword") {
                recoverykey = Math.floor(100000 + Math.random() * 900000)
                setTimeout(() => {
                    recoverykey = 000000
                }, 60000)
                return sendLine(`รหัสยืนยันในการตั้งค่ารหัสผ่านใหม่ของคุณคือ: ${recoverykey}\n\n*รหัสผ่านนี้มีอายุ 1 นาที*`)
            }

            if (msg.data.action == "resetpassword") {
                if (!msg.data.newpassword) return wss.clients.forEach(client => {
                    client.send(JSON.stringify({
                        op: 1,
                        data: {
                            action: "resetpassword",
                            status: false
                        }
                    }))
                })

                if (msg.data.key == recoverykey) {

                    await users.findOneAndUpdate({
                        username: "admin"
                    }, {
                        password: msg.data.newpassword
                    })

                    wss.clients.forEach(client => {
                        if (client.usertype == "Client") client.send(JSON.stringify({
                            op: 1,
                            data: {
                                action: "resetpassword",
                                status: true
                            }
                        }));
                    });

                    return sendLine(`ตั้งค่ารหัสผ่านใหม่สำเร็จ !`);
                }
                // return resetPassword(msg.data.newpassword);
            }

            if (msg.data.action == "power") {
                if (msg.data.pin == "all") msg.data.pin = allpin;
                sendLine(`ทำการ${msg.data.status ? "จ่าย" : "หยุดจ่าย"}ไฟไปที่ Pin ${typeof msg.data.pin == "object" ? msg.data.pin.length == 27 ? "ทั้งหมด" : msg.data.pin : msg.data.pin}`);
            }

            wss.clients.forEach(client => {
                if (client.usertype == "Server") client.send(JSON.stringify(msg));
            });
        }

        if (ws.usertype == "Server") {


            // if (msg.op == 1) {
            //     sendLine()
            // }

            if (msg.data.action == "line") {
                return sendLine(msg.data.message)
            }

            wss.clients.forEach(client => {
                if (client.usertype == "Client") client.send(JSON.stringify(msg));
            });
        }

    })

})


/**
 * 
 * @param {string} message 
 * @return { import("axios").AxiosResponse; }
 */
const sendLine = async (message) => {
    return await axios.post("https://notify-api.line.me/api/notify", qs.stringify({
        message
    }), {
        headers: {
            "Authorization": `Bearer ${config.linetoken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}



/**
 * 
 * @param {number} ms 
 * @returns void
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


process.on('unhandledRejection', (reason, p) => {
    if (reason.message === "Missing Access" && reason.path.split("/")[5] === "commands") {
        console.log("\n[err] Missing Access to put SlashCommands | guildId => " + reason.path.split("/")[4])
    } else {
        console.log('\n=== unhandled Rejection ==='.toUpperCase())
        console.log('Promise: ', p, 'Reason: ', reason.stack ? reason.stack : reason);
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

/**
 * OP Types
 * 
 * 0 - Action to do
 * 1 - Reply
 * 2 - Broacast
 * 7 - Verify
 * 9 - Disconnect
 */