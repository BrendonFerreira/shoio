module.exports = {

    async list({ query, pagination }) {
        console.log( this.collection )
        return await this.collection.find(query)
    },

    async create({ body }) {
        return await this.model.create(body)
    },

    async getById({ params }) {

        return await this.collection.findOne({ _id: params.id }).exec()
    },

    async update({ params, body }) {
        return await this.collection.update({ _id: params.id }, { $set: body }).exec()
    },

    async delete({ params }, response) {
        return await this.collection.remove({ _id: params.id }).exec()
    }
    
}