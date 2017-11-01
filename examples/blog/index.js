const shoio = require('../../index.js')
const app = shoio(__dirname)
const mongoose = require('./lib/mongoose')

app.beforeAction( require('./lib/authentication') )

app.configure({
  adapter: {
    mongo: mongoose
  }
})

app.up()

process.on('unhandledRejection', err => {
  console.log(err);
});