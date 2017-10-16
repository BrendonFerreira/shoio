module.exports = ({
  name: 'users',
  model: {
    adapter: 'mongo',
    schema: {
      name: 'string',
      birth_day: 'string',
    }
  }
})