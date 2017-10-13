
const App = require('../../index.js')()

const fs = require('fs')

App.configure( require('./src/config/app') )

App.routes.register( require('./src/config/routes') )

for( let fileName of fs.readdirSync( './src/modules' ) ) {
  App.modules.register( require( './src/modules/' + fileName ) )
}

App.up()