module.exports = {

    list({ query, pagination }) {
        return this.model.find(query).exec()
    },

    create({ body }) {
        return this.model.create(body)
    },

    getById({ params }) {
        return this.model.findOne({ _id: params.id }).exec()
    },

    update({ params, body }) {
        return this.model.update({ _id: params.id }, { $set: body }).exec()
    },

    delete({ id: _id }, response) {
        return this.model.delete({ _id })
    }
}