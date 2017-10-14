module.exports = [
    {
        resource: 'article',
        path: 'articles',
    },
    {
        resource: 'comment',
        path: 'comments'
    },
    {
        path: 'hello',
        method: 'get',
        action: 'hello_world#index'
    },
    {
        path: '/',
        method: 'get',
        action: 'article#index'
    },
    {
        path: '*',
        method: 'all',
        action: 'errors#pageNotFound'
    }
]