const Module = require('../index')

const content = {

    name: 'Content',

    model: {
        schema: {
            name: 'string'
        }
    },

    router: {
        base: 'contents',
        routes: [
            { action: 'create', method: 'get' }
        ]
    },
   
    methods: {
        create(data, context) {
            return data;
        }
    },

};

const user = {
    name: 'User',
    
    router: {
        base: 'users',
    },

    modules: [
        content
    ],
    
    methods: {
        hello() {
            return 'world'
        }
    },
};


new Module({

    router: {
        port: 3000,
        on: {
            initialized: 'test'
        },
        routes: [
            {
                action: 'ping',
                path: 'ping'
            },
            {
                action: 'showPayload',
                path: 'test',
            }
        ]
    },

    modules: [
        user
    ],

    methods: {
        showPayload( data ) {
            return Object.keys( this.$orm )
        },
        ping( data ) {
            return 'pong';
        }
    }

})