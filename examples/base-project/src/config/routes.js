module.exports = [
    {
        path: '/',
        method: 'get',
        action: 'welcome#index'
    },
    {
        path: '/teste',
        method: 'get',
        action: 'welcome#teste'
    },
    {
        path: '/*',
        method: 'all',
        action: 'errors#pageNotFound'
    }
]