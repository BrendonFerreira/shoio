module.exports = ({
    name: 'hello_world',
    model: {},
    renderer: 'pug',
    controller() {

        this.index = () => {
            this.render('hello_world')
        }

        return this
    }
})