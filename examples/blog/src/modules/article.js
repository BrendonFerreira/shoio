module.exports = {
  name: 'article',
  requiresAuth: [ 'commentArticle', 'create', 'update' ],
  model: {
    adapter: 'mongo',
    schema: {
      title: 'string',
      content: 'string',
      comments: ['string']
    },
    relations: [{
      hasMany: 'comment',
      belongsTo: 'user'
    }]
  },
  controller: {

    async index() {
      const articles = (await this.model.find().exec()).map(item => item.toObject());

      for (const article of articles) {
        let comments = await this.$models.comment.find({ _id: { $in: article.comments } }).exec()
        article.comments = comments
      }

      this.render('index', {
        articles: articles
      })
    },

    async getById({ params }) {
      const found = await this.model.findOne({ _id: params.id })
      const comments = await this.$models.comment.find({ _id: { $in: found.comments } }).exec()

      return {
        ...found.toJSON(),
        comments
      }
    },

    // Make this work
    async commentArticle({ params, body }) {
      const comment = await this.$models.comment.create(body)
      return comment
    },

    // Make this work
    async getCommentsFromArticleId({ params }) {
      const found = await this.model.findOne({ _id: params.id })
      return this.$models.comment.find({ _id: { $in: found.comments } }).exec()
    }

  }
}