module.exports = ({
    name: 'welcome',
    model: {},
    renderer: 'pug',
    controller() {

        this.index = () => {
            this.render('welcome')
        }

        this.teste = () => {
            console.log('teste')
        }

        return this
    }
})