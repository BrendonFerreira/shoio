import comment from './comment'

export default {
    name: 'post',
    scaffold: true,
    model: {
        schema: {
            title: String,
        }
    },
    controller: {
        // scaffold will do this
    },

    modules: [
        comment
    ]
}