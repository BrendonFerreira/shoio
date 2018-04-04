import * as express from 'express'

import * as pluralize from 'pluralize'

import * as sushi from '../sushi'

import * as memory from '../sushi/adapters/memory'

sushi.use( new memory() )

class Model {

    
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

class Models {

    registered : Object = {};

    constructor() {
        return this
    }

    registerModel( name: string, model: Model ) {

        this.registered[ name ] = model
        this.registered[ pluralize(name, 1, false) ] = model.collection

    }

    async createModel( modelConfig ) {
    
        const model = await Model.create( modelConfig );

        this.registerModel( modelConfig.name, model )

        return model
    }

}

class Modules extends Models {

    list = []

    queue = [];

    constructor( _config ) {
        super( )
    }

    getModule(name) {
		return this.list.find(item => item.name == name)
	}

	getModuleController(name) {
		if (!this.getModule(name)) {
			throw new Error(`Module "${name}" not found, are you sure you've registered?`)
		}
		return this.getModule(name)
	}

    async createModule( _module ) {
    
        _module.model = await this.createModel( _module )

        console.log( _module.name )

        this.registerModule( _module )

        return _module;
    }

    registerModule( _module ) {

        this.list.push( _module )

    }


}

class Shoio extends Modules {

    private app;

    constructor( config, ready ) {
        super(config)

        this.app = express()
        this.loadConfig( config ).then( ready )
    }

    async loadConfig( config ){
        
        for( let _module of config.modules ) {
            await this.createModule( _module )
        }

        config.routes.map( route => {
            this.registerRoute( route )
        } )

        return this;

    }

    registerRoute( route ) {


        this.app[ route.method ]( route.path, async ( request, response, next ) => {

            response.end( await this.dispatchAction( route, request.params, ...arguments ) )

        } )

    }

    async dispatchAction( route, ...args ) {

        const $module = this.getModule( route.module )

        const $scope = {
            $model: $module.model,
            $collection: $module.model.collection,
            $module: $module,
            $models: this.registered,
            $route: route,
            $meta: route.meta
        }

        return await $module.controller[ route.action ].call( $scope, $scope, ...args )
    }

    install( Installer ) {
        Installer( this )
    }

    serve( port: number, callback: Function ) {
        this.app.listen( port )
        callback( this.app )
    }
}




const app = new Shoio( {

    modules: [ {
        name: 'post',
        model: {
            schema: {
                title: String,
            },
            relations: $ => [
                $.belongsTo( 'user' ),
                $.hasMany( 'comments' )
            ] 
        },
        controller: {
            async index() {
                return 'hello world'
            },
            async all() {
                return JSON.stringify( await this.$collection.find() )
            },
            async create( params ) {
                await this.$model.create( {
                    title: 'brendon'
                } )
                return 'created!'
            }
        }

        // Adicionar a possibilidade de declarar as rotas aqui tmbm, assim nao precisaria colocar o nome module
        // Before action
        // After action

    }],

    routes: [
        { module: 'post', action: 'index', path: '/', method: 'get' },
        { module: 'post', action: 'all', path: '/all', method: 'get' }
    ]

}, async i => {

    // OLHA ISSO CARA
    console.log( await i.dispatchAction( { module: 'post', action: 'all', path: '/', method: 'get' }, {  } ) )

    // app.serve( 8080, function( ...args ) {
    //     // console.log( ...args )
    // } )

})
