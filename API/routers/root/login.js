const package = require(`../../package.json`)
const usersDB = require(`../../databases/users`)
const encoder = require(`../../modules/encoder`)
/**
 * 
 * @param {import ("express").Router} routes 
 */
module.exports = (routes) => {
    routes.post("/login", async (req, res, next) => {
        const user = await usersDB.findOne({
            "username": req.body.username
        })
        if (!user) return res.status(400).json({
            status: 400,
            message: "user not found"
        });

        if (user.password != req.body.password) return res.status(401).json({
            status: 401,
            message: "Invalid password"
        });

        const time = Date.now() + 3600 * 1000
        const token = `${encoder.encode(`${user.username}`)}.${encoder.encode(`${time}`)}.${(encoder.encode(`${user.username}${time}C0d3KatHoN`)).split("").reverse().join("")}`

        res.json({
            status: 200,
            data: {
                token
            }
        })
    })


    routes.post("/register", async (req,res) => {
        const user = await usersDB.findOne({
            "username": req.body.username
        })
        
        if (!req.body.username || !req.body.password) return res.status(400).json({
            status: 400,
            message: "username or password is empty"
        });
        
        if (user) return res.status(400).json({
            status: 400,
            message: "user already exists"
        });

        const newUser = await usersDB.create({
            username: req.body.username,
            password: req.body.password
        })

        const time = Date.now() + 3600 * 1000
        const token = `${encoder.encode(`${req.body.username}`)}.${encoder.encode(`${time}`)}.${(encoder.encode(`${req.body.username}${time}C0d3KatHoN`)).split("").reverse().join("")}`

        res.json({
            status: 200,
            data: {
                token
            }
        })
    })

    routes.post("/check", async (req, res, next) => {
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


            const user = await usersDB.findOne({
                username: keyDecode[0]
            })

            if (!user) return res.status(401).json({
                status: 401,
                message: "Invalid Authorization"
            });
            

            res.json({
                status: 200,
                data: user
            })

        } else {
            res.status(401).json({
                status: 401,
                message: "Invalid Authorization"
            })
        }
    })
}