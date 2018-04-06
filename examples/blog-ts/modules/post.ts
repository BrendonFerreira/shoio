export default {
    name: 'post',
    scaffold: true,
    model: {
        schema: {
            title: String,
        },
        relations: $ => [
            $.belongsTo( 'user' ),
            $.hasMany( 'comments' )
        ] 
    }
}