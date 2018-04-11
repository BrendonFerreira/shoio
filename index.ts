import * as express from 'express'
import * as pluralize from 'pluralize'
import * as sushi from '../sushi'
import * as memory from '../sushi/adapters/memory'
import * as bodyParser from 'body-parser'

import * as cloneDeep from 'lodash.clonedeep'

import * as path from 'path'

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
        toCreate['relations'] = relations ? relations( sushi ) : null
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

class ScaffoldModule {
    
    config;

    constructor( config ) {
        this.config = config
    }

    scaffold() {

        const routes = [ 
            { action: 'list', path: '/', method: 'get' },
            { action: 'getById', path: '/:id', method: 'get' },
            { action: 'create', path: '/', method: 'post' },
            { action: 'update', path: '/:id', method: 'put' },
            { action: 'delete', path: '/:id', method: 'delete' },
        ]

        const controller = {
            async list({ query, pagination }) {
                return await this.$collection.find(query)
            },
        
            async create({ body }) {
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
        
        this.config.routes = [
            ...routes,
            ...( this.config.routes || [] ),
        ]

        this.config.controller = {
            ...controller,
            ...( this.config.controller || {} )
        }
        
        return this.config

    }

}

export class Modules extends Models {

    $modules = [];

    constructor( _config ) {
        super( )
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
    
    createNestingRoutes( moduleName, routes = [] ) {
        return routes.map( route => ({
            ...route,
            'module': moduleName
        }) )
    }

}


interface Route {
    module: string;
    action: string;
    path?: string;
    method?: string;
    meta?: object;
    $scope?: object;
}

interface Config {
    name?: string,
    scaffold?: boolean,
    modules?: Array<any>,
    routes?: Array<Route>,
    route?: any,
    serve?: number,
    parent?: _Module,
    model?,
    controller?,
    collection?,
    beforeAction?: Function,
    root?: boolean,
}

export class _Module extends Models{

    $router: express.Router;
    $model: any = null
    $collection: any = null;
    $parent?: _Module;
    $config: Config = {}
    $controller: object = {}
    $childs: Array<_Module> = []
    $routes: Array<Route> = []
    $root: _Module;

    $beforeAction?: Function; 

    constructor( config: Config ) {
        super()
        this.$router = express.Router()
        this.$config = config;
    }

    async setup() {

        if( this.$config.scaffold ) {
            this.$config = new ScaffoldModule( this.$config ).scaffold()
        }

        if( this.$config.name && this.$config.model ) {
            this.$model = await this.createModel( this.$config )
            this.$collection = this.$model.collection
        } 

        if( this.$config.root ){
            this.$root = this
        }

        if( this.$config.modules ){
            for( const subModule of this.$config.modules ) {
                await this.loadModule( subModule )
            }
        }

        if( this.$config.routes ) {
            for( const route of this.$config.routes ) {
                this.registerRoute( route )
            }
        }

        this.$parent = this.$config.parent
        this.$controller = this.$config.controller
        this.$routes = this.$config.routes
        this.$beforeAction = this.$config.beforeAction

        return this
    }

    async loadModule( config ) {

        const _module = new _Module( config )

        _module.$root = this.$root 

        await _module.setup()

        this.registerModule( _module );
    }

    registerModule( _module: _Module ) {
        _module.$parent = this
        this.$childs.push( _module )
        this.$router.use( _module.$router )
    }

    registerRoute( route: Route ) {

        let baseroute = ''

        if( this.$config.route === true ) {
            baseroute = this.$config.name
        } else {
            baseroute = this.$config.route || baseroute
        }

        const _path = path.join( '/', baseroute, route.path )

        const _route = {
            'module': this.$config.name,
            ...route,
        }

        this.$router[ route.method ]( _path, async ( ...args ) => {
            
            const [ request, response ] = args;

            try {

                const outputs = await this.$root.dispatchAction( _route, ...args )

                for( const output of outputs ) {  
                    response.send( output )
                }

            } catch(error) {


                response.status(error.status || 500)

                if( error instanceof Error ){
                    response.send( {
                        messageUser: 'Ops, nada por aqui',
                        messageDevelop: 'API_NOT_RIGHT',
                        status: 404,
                        developmentStatus: error
                    } )
                    return;
                } else {
                    response.send(error)
                }
            }
            
            response.end()

        } )
    }

    async dispatchAction( route: Route, ...args ) {

        route = cloneDeep( route )

        // Pass nesteds parameter here too
        let $scope = {
            ...route.$scope,
            $module: this,
            $route: route,
            $meta: route.meta,
            $config: this.$config,
            $parent: this.$parent,
            $root: this.$root
        }

        if( this.$model ) {
            $scope['$model'] = this.$model
            $scope['$collection'] = this.$model.collection
        }

        if( this.$beforeAction ) {
            $scope['$beforeAction'] = this.$beforeAction 
        }

        route.$scope = $scope;

        
        /**
         * send to childs if have
         */

        if( !this.$config.name || this.$config.name !== route.module ) {
            let outputs = []

            for( const $child of this.$childs ) {
                const output = await $child.dispatchAction( route, ...args )
                outputs = outputs.concat( output )
            }
            return outputs
        }

        if( $scope['$beforeAction'] ) {
            $scope = await $scope['$beforeAction'].call( $scope, ...args )
        }


        const output = await this.$controller[ route.action ].call( $scope, ...args )

        return [ output ]
    }

}

export default class Shoio extends _Module {

    private app;
    private config;
    onReadyHook: Function = i => 0 ;

    constructor( config, ready? ) {
        
        super( config )
        
        this.config = config

        this.config.root = true

        this.app = express()
        
        this.app.use( bodyParser.json() )

        this.setup().then( i => {
            this.setupEnded();
            this.ready()
        })

        if( ready ) {
            this.onReadyHook = ready
        }
    }

    setupEnded() {
        this.app.use( this.$router )

        if( this.config.serve ) {
            this.serve( this.config.serve )
        }
    }

    ready( fn? : Function ) {
        if( !fn ) {
            this.onReadyHook( this )
        } else {
            this.onReadyHook = fn
        }
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


