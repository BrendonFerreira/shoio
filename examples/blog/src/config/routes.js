module.exports = [
    {
        resource: 'user',
        path: 'users'
    },
    {
        resource: 'article',
        path: 'articles',
    },
    {
        resource: 'comment',
        path: 'comments'
    },
    {
        path: '*',
        method: 'all',
        action: 'errors#pageNotFound'
    }
]