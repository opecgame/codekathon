const axios = require("axios");
const express = require(`express`);
const router = express.Router();
/**
 * @param { import "express".RequestParamHandler } req
 * @param { import "express".Response } res
 */
router.get("/", async (req, res) => {
    if (req.cookies.get("token")) {
        try {
            const checkuser = await axios.post("https://apicodekathon.opecgame.in.th/check", {},{
                headers: {
                    "Authorization": req.cookies.get("token")
                }
            })
            res.render("index", {
                user: checkuser.data.data.username
            })
        } catch (e) {
            res.clearCookie("token")
            res.render('login')
        }
    } else {
        res.render('login')
    }
})

router.get("/register", async (req, res) => {
    if (req.cookies.get("token")) return res.redirect("/")
    res.render("register")
})

router.get("/fogetpassword", async (req, res) => {
    if (req.cookies.get("token")) return res.redirect("/")
    res.render("fogetpassword")
})

router.get('/logout', (req, res) => {
    res.clearCookie("token")
    res.redirect("/")
})

module.exports = router;