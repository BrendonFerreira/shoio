module.exports = ({
  name: 'errors',
  model: {
  },
  controller: {
    pageNotFound() {
      this.render('404')
    }
  }
})