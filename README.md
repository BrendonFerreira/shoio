# shoio

## Installing 
  `npm install --save shoio`


## Basic project

```javascript
const shoio = require('shoio')
const app = shoio()

app.configure({
    adapter: { 
        mongo: require('mongoose') 
    }
})

app.routes.register([
    {
        resource: 'article',
        path: 'articles',
    }
])

app.modules.register({
    name: 'article',
    model: {
        adapter: 'mongo',
        schema: {
            title: 'string',
            content: 'string',
        }
    }
})

app.up()
``` 

When running this project, with this simple code snippet, a CRUD will be generated making routes available to perform operations, that operations will be shown in terminal as follows:

```
Spawning route: article#list GET /articles/
Spawning route: article#getById GET /articles/:id
Spawning route: article#create POST /articles/
Spawning route: article#update PUT /articles/:id
Spawning route: article#delete DELETE /articles/:id
```

## Creating a route in this example

```javascript
app.routes.register([
  ...
  {
    path: '/',
    method: 'get',
    action: 'article#hello_world'
  }
  ...
])
```

The action is separated in two parts:
  - 1: module name
  - 2: method called by controller
  
Those, together by '#' forming the action.

For this route to work it is necessary an action with the name `hello_world` inside the controller:

```javascript

app.modules.register({
  name: 'users',
  ...
  controller: {
    hello_world(){
      return "Hello World!!!"
    }
  }
})

```

Done! A route has been created in your application. When a request is made to the root path  of your application `http://localhost:3001/` the text `Hello World!!!` will be returned! 

Instead of this return of the text can be used:
  - Rendering of Pug archives with the function `this.render('page', data)`
  - Total support to JSON return
  - Promises return support, they will be solved behind the cloths, stay calm!
  
 
# Code organization
# Starting a project

## Structure
├── yourproject                   
│   ├── src          
│   │   ├── config          
│   │   │   └── routes.js    
│   │   ├── modules          
│   │   │   └── [module_name].js
│   │   └── views
│   │       └── [view_name].js 
│   └── index.js         


### yourproject/index.js
```javascript
const shoio = require('../../index.js')
const app = shoio(__dirname)
const mongoose = require('./lib/mongoose')

app.configure({
  adapter: {
    mongo: mongoose
  }
})

app.up()
```

You might be wondering: Where are the modules/routes imports?
They are automaticaly included! If you put them on the right folders, everything will work perfectly!

## Basic route inside the framework:

### Create a module
#### yourproject/src/modules/example.js
```javascript
module.exports = ({
	name: 'example',
    model: {
        adapter: 'mongo', // It must be the same used on 'yourproject/index.js' configuration
        schema: {
            message: 'string',
        },
    }
})
```

### Set the CRUD ( Create, Read, Update e Delete )
#### yourproject/src/config/routes.js
```javascript
module.exports = [
    {
        resource: 'example', 
        path: '/', // It will be accessed by the root of the environment that you're using. In this case 'localhost:3001/'
    }
]
```

`path: '/'` - It will be accessed by the root of the environment that you're using. In this case 'localhost:3001/'
`resource: 'example'` - Name of the module you want to generate the CRUD

### Done! You already have available routes on your application!

# Todo
- [ ] Enable the configuration of routes to the module in the module itself
- [ ] Create an ORM that make reference between entities using has_many, has_one, belongs_to 
- [ ] Enable register of fields
- [ ] A nice way to field validation


