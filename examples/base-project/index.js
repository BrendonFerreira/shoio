const shoio = require('../../index.js')
const app = shoio()
const fs = require('fs')

app.configure( require('./src/config/app') )
app.routes.register( require('./src/config/routes') )
app.modules.register( fs.readdirSync( './src/modules' ).map( src => `./src/modules/${src}` ).map( require ) )
app.up( (port) => {
  console.log( 'Server listening for requests in port', port )
} )

// Better debugging
process.on('unhandledRejection', err => {
  console.log("Caught unhandledRejection");
  console.log(err);
});