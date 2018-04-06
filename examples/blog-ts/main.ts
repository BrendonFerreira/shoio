import Shoio from '../../index'

import post from './modules/post'

new Shoio( {
    modules: [
        post
    ],
    serve: 8080
}, i => {

    i.dispatchAction( { module: 'post', action: 'create' }, { body: { title: 'New post ' + Date.now() } } )

})
