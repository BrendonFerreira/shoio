const shoio = require('../../index.js')
const app = shoio( __dirname )
const mongoose = require('./lib/mongoose')

app.configure({
    adapter: {
        mongo: mongoose
    }
})

app.up()
