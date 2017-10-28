const shoio = require('../../index.js')
const app = shoio(__dirname)
const mongoose = require('./lib/mongoose')


app.beforeAction( function( ) {
  if( this.module.requiresAuth && this.module.requiresAuth.includes( this.route.action ) ) {
    console.log( 'USER MUST BE LOGGED' )
  } else {
    console.log('WATHEVER')
  }
  return;
} )

app.configure({
  adapter: {
    mongo: mongoose
  }
})

app.up()


process.on('unhandledRejection', err => {
  console.log("Caught unhandledRejection");
  console.log(err);
});