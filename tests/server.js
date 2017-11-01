const chai = require('chai')
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect
const shoio = require('../')
const app = shoio()

app.configure({
    debugRequests: false,
    debugRouteSpawn: false,
    adapter: {
        mongo: require('./mongoose')
    }
})

app.routes.register([
    {
        resource: 'article',
        path: 'articles',
    },
    { path: '/', method: 'get', action: 'article#list' }
])


app.modules.register({
    name: 'article',
    model: {
        adapter: 'mongo',
        schema: {
            title: { type: 'string', required: true },
            content: 'string',
            points: 'number'
        }
    }
})

let server;
beforeEach(async function() {
    app.down()
    try {
        server = await app.up(3003)
    } catch(e) {
        console.log(e)
    }
});

describe('Server instance', () => {
    it('Run server without errors', function (done) {
        chai.request(server)
            .get('/')
            .end((err, response) => {
                chai.assert.isArray(response.body, 'The response is not an array')
                expect(response).to.have.status(200)
                done()
            })

    })

    it('Create article without errors', function (done) {
        chai.request(server)
            .post('/articles')
            .send({
              'title': 'My article',
              'content': 'My article body',
            })
            .end((err, response) => {
                expect(response).to.have.status(200)
                chai.assert.isObject(response.body, 'The response is not an array')
                expect(response.body).to.have.property( 'title' )
                expect(response.body).and.to.have.property( 'content' )
                expect(response.body).and.to.have.property( '_id' )
                done()
            })

    })

    it('Create article with fields filter', function (done) {
        chai.request(server)
            .post('/articles')
            .send({
              'title': 'My article',
              'content': 'My article body',
              'myprop': 'should not be here',
            })
            .end((err, response) => {
                expect(response).to.have.status(200)
                chai.assert.isObject(response.body, 'The response is not an array')
                expect(response.body).to.have.property( 'title' )
                expect(response.body).and.to.have.property( 'content' )
                expect(response.body).and.to.have.property( '_id' )
                expect(response.body).and.to.not.have.property( 'myprop' )
                done()
            })

    })

    it('Create article with fields transformation', function (done) {
        chai.request(server)
            .post('/articles')
            .send({
              'title': 'My article',
              'content': 131209230123,
              'points': '2131293812'
            })
            .end((err, response) => {
                expect(response).to.have.status(200)
                chai.assert.isObject(response.body, 'The response is not an array')
                expect(response.body).to.have.property( 'title' )
                expect(response.body).to.have.property( 'content' ).and.be.a('string')
                expect(response.body).to.have.property( 'points' ).and.be.a('number')
                done()
            })

    })

    it('Should get all articles without errors', function (done) {
        chai.request(server)
            .get('/articles')
            .end((err, response) => {
                expect(response).to.have.status(200)
                chai.assert.isArray(response.body, 'The response is not an array')
                done()
            })
    })

    it('Should delete first article without errors', function (done) {
        chai.request(server)
            .get('/articles')
            .end((err, response) => {
                expect(response).to.have.status(200)
                expect(response.body).to.be.a('array' , 'The response is not an array')
                
                chai.request(server)
                    .delete('/articles/' + response.body[0]._id )
                    .end((err, response) => {
                        expect( response.body.ok ).to.be.equal( 1 , "Delete with error")
                        done()
                    })
            })
    })

    it('Should delete all articles without errors', function (done) {
        chai.request(server)
            .get('/articles')
            .end((err, response) => {
                expect(response).to.have.status(200)
                expect(response.body).to.be.a('array' , 'The response is not an array')
                
                response.body = response.body.map( async ( item ) => {
                    const response = await chai.request(server).delete('/articles/' +item._id )
                    expect( response.body.ok ).to.be.equal( 1 , "Delete with error")
                });
                done()
            })
    })

    it('the Articles should be empty', function (done) {
        chai.request(server)
            .get('/articles')
            .end((err, response) => {
                expect(response).to.have.status(200)
                expect(response.body).to.be.a('array' , 'The response is not an array')
                expect(response.body.length).to.be.equal(0, 'The articles was not deleted properly')
                done()
            })
    })
})

process.on('unhandledRejection', err => {
    console.log(err);
});