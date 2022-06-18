const users = require("../databases/users");
const encoder = require("./encoder");

module.exports = async (req, res, next) => {
    if (req.headers.authorization) {
        const key = req.headers.authorization.split(".")
        if (key.length !== 3) {
            return res.status(401).json({
                status: 401,
                message: "Invalid Authorization"
            })
        }

        key[2] = key[2].split("").reverse().join("")
        const keyDecode = []
        try {
            key.forEach(a => keyDecode.push(encoder.decode(a)));
        } catch (e) {
            return res.status(401).json({
                status: 401,
                message: "Authorization Failed"
            })
        }

        if (keyDecode[1] < Date.now()) return res.status(401).json({
            status: 401,
            message: "Authorization Expried"
        })

        if (keyDecode[2] !== `${keyDecode[0]}${keyDecode[1]}C0d3KatHoN`) return res.status(401).json({
            status: 401,
            message: "Invalid Authorization"
        })


        const user = await users.findOne({
            username: keyDecode[0]
        })

        if (!user) return res.status(401).json({
            status: 401,
            message: "Invalid Authorization"
        });
        

        next();

    } else {
        res.status(401).json({
            status: 401,
            message: "Invalid Authorization"
        })
    }
}