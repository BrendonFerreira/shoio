module.exports = ({
  name: 'errors',
  model: {
  },
  controller() {
    
    this.pageNotFound = () => {
      this.render('404')
    }

    return this
  }
})