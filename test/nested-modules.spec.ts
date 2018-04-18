import Shoio from '../index'

import { expect } from 'chai'


const message = {

    name: 'message',

    scaffold: true,

    beforeAction() {
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

    before( function(done) {
        app = new Shoio( config, _app => {
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
        
        const [ result ] = await app.dispatchAction( { module: 'message', action: 'list' }, {
            query: {
                user: 1
            }
        } )

        expect( result ).to.be.an('array')
        expect( result ).to.have.length(2)
    } )

})