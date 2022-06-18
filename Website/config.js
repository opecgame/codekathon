const config = {
    development: {
        port: 7000,
    },
    production: {
        port: 7855
    }
}



module.exports = config[process.env.NODE_ENV === 'development' ? 'development' : 'production']