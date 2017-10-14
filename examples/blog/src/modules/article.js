module.exports = ({
  name: 'article',
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
  controller() {

    this.index = async () => {
      const articles = JSON.parse( JSON.stringify( await this.model.find().exec() ) );

      for( const article of articles ) {
        let comments = await this.$models.comment.find({ _id: { $in: article.comments } }).exec()
        article.comments = comments
      }

      this.render('index', {
        articles : articles
      })
    }

    this.list = ({ query, pagination }) =>
      this.model.find(query).exec()

    this.create = ({ body }) =>
      this.model.create(body)

    this.getById = async ({ params }) => {
      const found = await this.model.findOne({ _id: params.id })
      const comments = await this.$models.comment.find({ _id: { $in: found.comments } }).exec()

      return {
        ...found.toJSON(),
        comments
      }
    }
    
    // Make this work
    this.commentArticle = async ({ params, body }) => {
      const comment = await this.$models.comment.create( body )
      
    }

    // Make this work
    this.getCommentsFromArticleId = async ({ params }) => {
      const found = await this.model.findOne({ _id: params.id })
      return this.$models.comment.find( { _id: { $in: found.comments } } ).exec()
    }

    this.update = ({ id, body }) =>
      this.model.update({ id }, body)

    this.delete = ({ id }, response) =>
      this.model.delete({ id })

    return this
  }
})