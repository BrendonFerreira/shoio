module.exports = ({
  name: 'comment',
  model: {
    adapter: 'mongo',
    schema: {
      comment: 'string',
    },
    relations: [{
      belongsTo: 'article',
      belongsTo: 'user',
    }]
  },
  controller() {
    return this
  }
})