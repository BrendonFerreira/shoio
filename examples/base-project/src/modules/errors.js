module.exports = ({
  name: 'errors',
  controller: {
    pageNotFound() {
      this.render('404')
    }
  }
})