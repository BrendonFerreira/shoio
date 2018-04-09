import Shoio from '../../shoio'

import { expect } from 'chai'


const message = {

    name: 'message',

    scaffold: true,

    beforeAction() {
        console.log( 'message' )
        this.$user = 'test'
        return this
    },

    model: {
        schema: {
            user: Number,
            content: String
        }
    }

}

const user = {

    name: 'user',

    scaffold: true,

    model: {
        schema: {
            name: String
        }
    },
    
    modules: [
        message
    ]

}

const media = {
    name: 'media'
}

const config = {
    modules : [
        user,
        media
    ],
}

describe( 'Nested modules', function() {
    
    let app;
    
    const log_modules = (str) => ( _module ) => {
        console.log( str, _module.$config.name || 'root' )
        if( _module.$childs ) {
            _module.$childs.map(log_modules(str+'---'))
        }
    }

    before( function(done) {
        app = new Shoio( config, _app => {
            log_modules('-')( _app )
            done()
        })
    })

    it( 'should find message', async function() {
        
        const result = await app.dispatchAction( { module: 'message', action: 'list' }, {
            query: {
                user: 1
            }
        } )

        expect( result ).to.be.an('array')

    } )

    it( 'create user', async function() {
        
        const result = await app.dispatchAction( { module: 'user', action: 'create' }, {
            body: {
                name: 'brendon',
            }
        } )

        expect( result ).to.be.an('array')
    } )

    it( 'create user message', async function() {
        
        const result = await app.dispatchAction( { module: 'message', action: 'create' }, {
            body: {
                content: 'Olá brendon',
                user: 1
            }
        } )

        const result1 = await app.dispatchAction( { module: 'message', action: 'create' }, {
            body: {
                content: 'Tudo bem?',
                user: 1
            }
        } )

        expect( result ).to.be.an('array')
        expect( result1 ).to.be.an('array')
    } )

    it( 'find messages to user', async function() {
        
        const result = await app.dispatchAction( { module: 'message', action: 'list' }, {
            query: {
                user: 1
            }
        } )

        expect( result ).to.be.an('array')
        expect( result ).to.have.length(2)
    } )

})