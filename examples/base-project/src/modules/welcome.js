module.exports = ({
    name: 'welcome',
    model: {},
    renderer: 'pug',
    controller: {
        index() {
            this.render('welcome')
        },

        teste() {
            console.log('teste')
        }
    }
})