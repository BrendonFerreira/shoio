module.exports = [
    {
        path: '/',
        method: 'get',
        action: 'welcome#index'
    },
    {
        path: '*',
        method: 'all',
        action: 'errors#pageNotFound'
    }
]