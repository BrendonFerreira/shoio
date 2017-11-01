const chai = require('chai')
const expect = chai.expect
const orm = require('../orm')

orm.createModel({
    name: 'people',
    schema: {
        name: { type: 'string', required: true },
        points: 'number'
    },
    relations: [
        { hasMany: 'pet' }
    ]
})

orm.createModel({
    name: 'pet',
    schema: {
        name: 'string'
    },
    relations: [
        { belongsTo: 'user' }
    ]
})


const People = orm.getModel( 'people' )
const Pet = orm.getModel( 'pet' )

describe('ORM tests', () => {

    it('Shold relationate two models without errors', async function (done) {
        const fred = await People( { name: 'Fred', points: 10 } )
        const scooby = await Pet( { name: 'Scooby Doo' } )
        
        await fred.has( scooby )

        expect( people ).to.have.property( 'pets', 'The field pets, was not being fetched' )
        done()
    })


    it('Shold relationate two models without errors', async function (done) {
        try {
            const fred = await People( { name: 'Fred', points: 10 } )
            done(e)
        } catch( e ) {
            done(e)
        }
    })

    it('Show relations between two models', async function (done) {
        const fred = await People( { name: 'Fred', points: 10 } )
        const scooby = await Pet( { name: 'Scooby Doo' } )
        
        await fred.has( scooby )

        const people = await People.findOne( { name: 'Fred' } )
        const petsOfPerson = await people.fetch('pets')

        expect( people ).to.have.property( 'pets', 'The field pets, was not being fetched' )
        expect( petsOfPerson ).to.be.a( 'array', 'Pets was no being returned to variable' )
        done()
    })

})
