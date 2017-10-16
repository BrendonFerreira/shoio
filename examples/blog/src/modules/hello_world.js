module.exports = ({
    name: 'hello_world',
    model: {},
    renderer: 'pug',
    controller: {
        index() {
            this.render('hello_world')
        }
    }
})