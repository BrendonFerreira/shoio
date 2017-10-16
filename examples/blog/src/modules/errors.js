// module.exports = ({
//   name: 'errors',
//   controller() {
//     this.pageNotFound = () => {
//       this.render('404')
//     }
//     return this
//   }
// })

module.exports = ({
  name: 'errors',
  controller: {
    pageNotFound() {
      this.render('404')
    }
  }
})