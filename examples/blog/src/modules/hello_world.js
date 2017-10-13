module.exports = ({
    name: 'hello_world',
    model: {
        adapter: 'mongo',
        schema: {}
    },
    renderer: 'pug',
    controller() {

        this.index = () => {
            this.render('hello_world')
        }

        return this
    }
})