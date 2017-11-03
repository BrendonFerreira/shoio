module.exports = ( route ) => ({
	path: route.path,
	name: route.name || route.resource,
	meta: route.meta || {},
	modules: [{
		path: '/',
		method: 'get',
		action: 'list',
	}, {
		path: '/:id',
		method: 'get',
		action: 'getById'
	}, {
		path: '/',
		method: 'post',
		action: 'create'
	}, {
		path: '/:id',
		method: 'put',
		action: 'update'
	}, {
		path: '/:id',
		method: 'delete',
		action: 'delete'
	}]
})
