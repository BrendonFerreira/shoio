const Module = require('../index')

const file = {
    name: 'File',

    router: {
        base: 'file',
        expose: [ 'all' ]
    },
    
    model: {
        schema: _ => ({
            name: _.STRING,
            publicUrl: _.STRING,
        }),
        relations: _ => [
            _.belongsTo('Content'),
        ]
    },

    methods: {
        all() {
            return this.$model.all()
        }
    }
}

const content = {

    name: 'Content',

    modules: [ file ],
 
    scaffold: true,

    model: {
        schema: _ => ({
            name: _.STRING
        }),
        relations: _ => [
            _.belongsTo('User'),
            _.hasOne('File')
        ]
    },

   

};

const user = {

    name: 'User',
    
    modules: [ content ],

    scaffold: true,

    router: {
        base: 'users',
    },

    model: {
        schema: _ => ({
            name: _.STRING,
            email: _.STRING,
            password: _.STRING
        }),
        relations: _ => [
            _.belongsTo('User')
        ]
    }
};


new Module({

    router: {
        port: 3000,
        on: {
            initialized: 'test'
        }
    },

    modules: [
        user
    ],


}).init()


process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });