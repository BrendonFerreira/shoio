
const App = require('../../index.js')()

App.plugin(require('socket-io-shoio'))

App.socket.register({

  handlers() {
    const app = this

    async function loggofUser(credentials) {
      const user = app.$models.users.find( { username: credentials.username } )
      user.isOnline = false
      await user.save()
    }

    async function authenticateUser( credentials ){
      const user = app.$models.users.find( { username: credentials.username } )
      user.isOnline = true
      await user.save()
    }

    return {
      connection(socket) {
        socket.on('authenticate', authenticateUser)
        socket.on('signout', loggofUser)
      }
    }
  }
})

App.up()