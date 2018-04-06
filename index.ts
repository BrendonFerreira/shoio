import * as express from 'express'

import * as pluralize from 'pluralize'

import * as sushi from '../sushi'

import * as memory from '../sushi/adapters/memory'

sushi.use( new memory() )

export class Model {

    
    model: any;
    collection: any;

    constructor( config ) {

    }

    static async create( config ) {

        const schema = config.model.schema
        const relations = config.model.relations

        const toCreate = {}
        toCreate['relations'] = relations( sushi )
        toCreate['schema'] = schema

		const [ model, collection ] = await sushi.createModel(config.name, toCreate)
		model.collection = collection
		return model
    }
}

export class Models {

    $models : Object = {};

    constructor() {
        return this
    }

    registerModel( name: string, model: Model ) {
        this.$models[ name ] = model
        this.$models[ pluralize(name, 1, false) ] = model.collection
    }

    async createModel( modelConfig ) {
        const model = await Model.create( modelConfig );
        this.registerModel( modelConfig.name, model )
        return model
    }

}

export class Modules extends Models {

    $modules = [];

    constructor( _config ) {
        super( )
    }

    async createModule( _module ) {
        _module.model = await this.createModel( _module )
        return _module;
    }

    registerModule( _module ) {
        this.$modules.push( _module )
    }

    getModule(name) {
		return this.$modules.find(item => item.name == name)
    }
    
	getModuleController(name) {
		if (!this.getModule(name)) {
			throw new Error(`Module "${name}" not found, are you sure you've registered?`)
		}
		return this.getModule(name)
	}

}

export default class Shoio extends Modules {

    private app;

    //Create config interface
    config: Object = {};

    onReadyHook: Function = i => 0 ;

    constructor( config, ready? : Function ) {
        super(config)
        this.config = config;
        this.app = express()

        this.loadConfig().then( i => this.ready() )

        if( ready ) {
            this.onReadyHook = ready
        }
    }

    ready( fn? : Function ) {
        if( !fn ) {
            this.onReadyHook( this )
        } else {
            this.onReadyHook = fn
        }
    }

    createNestingRoutes( moduleName, routes = [] ) {
        return routes.map( route => ({
            ...route,
            'module': moduleName
        }) )
    }

    scaffoldModule( config ) {

        let basepath = config.name

        if( config.scaffold.route ) {
            basepath = config.scaffold.route
        }

        const extendConfig = ( base ) => {
            return ( extend ) => {
                return {
                    ...base,
                    ...extend,
                    path: basepath + extend.path
                }
            }
        }

        const configure = extendConfig( { module: config.name } )

        const routes = [ 
            { action: 'list', path: '/', method: 'get' },
            { action: 'getById', path: '/:id', method: 'get' },
            { action: 'create', path: '/', method: 'post' },
            { action: 'update', path: '/:id', method: 'put' },
            { action: 'delete', path: '/:id', method: 'delete' },
        ].map( configure )

        const controller = {
            async list({ query, pagination }) {
                return await this.$collection.find(query)
            },
        
            async create({ body }) {
                console.log( body )
                return await this.$model.create( body )
            },
        
            async getById({ params }) {
                return await this.$collection.findOne({ id: params.id })
            },
        
            async update({ params, body }) {
                let model = this.$model( params.id )
                Object.assign( model, body )
                return await model.save()
            },
        
            async delete({ params }, response) {
                return await this.$collection.remove({ id: params.id })
            }
        }
        
        config.routes = [
            ...routes,
            ...config.routes,
        ]

        config.controller = {
            ...controller,
            ...( config.controller || {} )
        }
        
        return config

    }

    async loadModuleConfig( config ) {

        if( config.scaffold ) {
            config = this.scaffoldModule( config )
        }

        const routes = this.createNestingRoutes( config.name, config.routes )
            
        const _module = await this.createModule( config )
        
        this.registerModule( _module )

    }

    async loadConfig(){
        
        const routes = this.config.routes || []

        for( let _module of this.config.modules ) {
            await this.loadModuleConfig( _module )
        }

        for( const route of routes ) {
            this.registerRoute( route )
        }
        
        if( this.config.serve ) {
            this.serve( this.config.serve )
        }

        return this;
    }

    registerRoute( route ) {

        this.app[ route.method ]( route.path, async ( request, response, next ) => {

            const output = await this.dispatchAction( route, request, ...arguments )

            response.end( output )

        } )

    }

    async dispatchAction( route, ...args ) {

        const $module = this.getModule( route.module )

        if( !$module ) {
            console.warn('Module not found or not ready to execute')
            return
        }

        const $scope = {
            $model: $module.model,
            $collection: $module.model.collection,
            $module: $module,
            $models: this.$models,
            $route: route,
            $meta: route.meta
        }
        
        return await $module.controller[ route.action ].call( $scope, ...args )
    }

    install( Installer ) {
        Installer( this )
    }

    serve( port: number, callback?: Function ) {
        this.app.listen( port )

        if( !callback ) return

        callback( this.app )
    }
}





