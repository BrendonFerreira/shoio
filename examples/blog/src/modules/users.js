module.exports = ({
  name: 'user',
  model: {
    adapter: 'mongo',
    schema: {
      name: 'string',
      birth_day: 'string',
    }
  }
})