const helloWorld = {
	name: 'hello-world',
	renderer: 'pug',
	controller: {
		index() {
			this.render('hello-world')
		}
	}
}

helloWorld.requiresAuthentication = [ 'index' ]

module.exports = helloWorld