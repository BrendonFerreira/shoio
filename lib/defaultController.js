module.exports = {

    async list({ query, pagination }) {
        return await this.collection.find(query)
    },

    async create({ body }) {
        return await this.model.create( body )
    },

    async getById({ params }) {
        return await this.collection.findOne({ id: params.id })
    },

    async update({ params, body }) {
        let model = this.model( params.id )
        Object.assign( model, body )
        return await model.save()
    },

    async delete({ params }, response) {
        return await this.collection.remove({ id: params.id })
    }
    
}