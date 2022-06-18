const WebSocket = require("ws");
const Gpio = require('onoff').Gpio;
const sensor = require("node-dht-sensor");
const ws = new WebSocket("ws://localhost:3333", {
    headers: {
        "authorization": "",
        "user-agent": ""
    }
});

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
    "27"
]
const pin = {}


allpin.forEach((pinID) => {
    pin[pinID] = new Gpio(parseInt(pinID), 'out');
});

let itchange = 0
setInterval(() => {
    let pinIn = new Gpio(parseInt("7"), 'in');
    const isInPut = pinIn.readSync()
    let old = itchange
    itchange = isInPut
    if (isInPut === old) return;
    ws.send(JSON.stringify({
        op: 0,
        data: {
            action: "line",
            message: `${isInPut ? "พบ" : ""}การรั่วไหลของแก๊ส หรือ ควันไฟ ภายในบ้าน${isInPut ? "" : "ได้รับการแก้ไข"}`
        }
    }))
    pin["21"].writeSync(isInPut);
}, 1000);


ws.on("message", RawMSG => {
    const msg = JSON.parse(RawMSG)
    console.log(msg)
    if (msg.op == 0) {
        if (msg.data.action == "power") {

            if (typeof msg.data.pin == "object") {


                msg.data.pin.forEach(pinID => {
                    pin[pinID].writeSync(msg.data.status ? 1 : 0);
                });

                return ws.send(JSON.stringify({
                    op: 1,
                    data: {
                        pin: msg.data.pin,
                        status: msg.data.status ? 1 : 0
                    }
                }))

            }

            pin[msg.data.pin].writeSync(msg.data.status ? 1 : 0);

            ws.send(JSON.stringify({
                op: 1,
                data: {
                    pin: msg.data.pin,
                    status: msg.data.status ? 1 : 0
                }
            }))
        }

        if (msg.data.action == "dht") {
            sensor.read(11, 4, (e, temp, hum) => {
                if (!e) {
                    ws.send(JSON.stringify({
                        op: 1,
                        data: {
                            temp,
                            hum
                        }
                    }))
                }
            })
        }

        if (msg.data.action == "checkout") {
            const ObjStatus = {}
            if (typeof msg.data.pin == "object") {
                msg.data.pin.forEach(async pinID => {
                    ObjStatus[pinID] = pin[pinID].readSync();
                });

                return ws.send(JSON.stringify({
                    op: 1,
                    data: {
                        pin: msg.data.pin,
                        status: ObjStatus
                    }
                }))
            }

            ws.send(JSON.stringify({
                op: 1,
                data: {
                    pin: msg.data.pin,
                    status: pin[msg.data.pin].readSync()
                }
            }))
        }

        if (msg.data.action == "checkin") {
            let pinIn = new Gpio(parseInt(msg.data.pin), 'in');
            ws.send(JSON.stringify({
                op: 1,
                data: {
                    pin: msg.data.pin,
                    status: pinIn.readSync()
                }
            }))
        }
    }
})
