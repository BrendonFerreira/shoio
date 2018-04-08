import Shoio from '../../index'

import post from './modules/post'



new Shoio( {
    modules: [
        post
    ],
    serve: 8080
}, async i => {

    console.log( await i.dispatchAction( { module: 'post', action: 'create' }, { body: { title: 'New post ' + Date.now() } } ) )

    console.log( await i.dispatchAction( { module: 'comment', action: 'create' }, { body: { title: 'New post ' + Date.now() } } ) )

})

process.on( 'unhandledRejection', err => {
	console.log( err )
} )
