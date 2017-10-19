module.exports = ({
	name: 'hello_world',
	renderer: 'pug',
	controller: {
		index() {
			this.render('hello_world')
		}
	}
})