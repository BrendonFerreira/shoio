module.exports = function authenticate( request, response, next ) {

    const { action: actionName } = this.route

    this.next()
    
    // return "Sem autenticação"

}