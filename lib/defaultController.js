module.exports = {

    async list({ query, pagination }) {
        return await this.model.find(query).exec()
    },

    async create({ body }) {
        return await this.model.create(body)
    },

    async getById({ params }) {
        return await this.model.findOne({ _id: params.id }).exec()
    },

    async update({ params, body }) {
        return await this.model.update({ _id: params.id }, { $set: body }).exec()
    },

    async delete({ params }, response) {
        return await this.model.remove({ _id: params.id }).exec()
    }
    
}