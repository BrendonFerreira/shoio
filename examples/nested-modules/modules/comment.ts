export default {
    name: 'comment',
    scaffold: true,
    model: {
        schema: {
            content: String,
        } 
    },
    controller: {
        create() {
            return 'Hello my parent is '+this.$parent.$config.name+' and my name is '+this.$config.name
        }
    }
}