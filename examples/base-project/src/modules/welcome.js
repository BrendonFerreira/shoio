module.exports = ({
    name: 'welcome',
    renderer: 'pug',
    controller: {
        index() {
            this.render('welcome')
        },

        teste() {
            this.render('welcome')
        },
    }
})