module.exports = ({
    name: 'welcome',
    model: {},
    renderer: 'pug',
    controller() {

        this.index = () => {
            this.render('welcome')
        }

        return this
    }
})