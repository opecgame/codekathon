const express = require('express');
const app = express();
const cors = require(`cors`);
const cookies = require(`cookies`);
const rootRoutes = require("./routers/root");
const config = require(`./config`);
app.use(cors("*"));


require("./modules/mongodb");

app.use(cookies.express("a", "b", "c"));
app.use((req, res, next) => {
    res.set({
        'X-Powered-By': ['PHP/5.3.29', 'PleskLin'],
        'Server': 'Apache/2.4.52 (Win64) OpenSSL/1.1.1m PHP/5.3.29'
    })
    next()
});

app.use(express.json());
app.set('trust proxy', true)



app.use(`/`, (req, res, next) => {
    if (!config.maintenance) return next()
    if (req.cookies.get("isDev")) {
        return next();
    }
    return res.status(403).json({
        status: 403,
        message: "Maintenance Mode"
    })
});

app.use(`/`,
    rootRoutes
);

app.use("*", (req, res, next) => {
    return res.status(404).json({
        status: 404,
        message: "Not Found"
    })
})



app.listen(config.port, () => {
    console.log('Server is running on port 3000');
});

