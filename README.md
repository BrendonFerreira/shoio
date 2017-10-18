# shoio

## Installing 
  `npm install --save shoio`


## Basic project

```javascript
const shoio = require('shoio')
const app = shoio()

app.configure({
    adapter: { mongo: require('mongoose') },
    viewsPath: './src/views'
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

app.up(function (a) {
    console.log('Up in port', a)
})
``` 

When running this project, with this simple code snippet, a CRUD will be generated making routes available to perform operations, that operations will be shown in terminal as follows:

Ao rodar esse projeto, com esse simples trecho de codigo, será gerado um CRUD disponibilizando rotas para realizar operações, sendo essas que serão mostradas no terminal da seguinte forma:

```
Spawning route: article#list GET /articles/
Spawning route: article#getById GET /articles/:id
Spawning route: article#create POST /articles/
Spawning route: article#update PUT /articles/:id
Spawning route: article#delete DELETE /articles/:id
```

## Creating a route in this example
## Criando uma rota nesse exemplo

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

A ação é separada por duas partes:
  - 1: nome do módulo
  - 2: metodo para ser chamado do controller
Sendo essas, juntas pelo '#' formando a propriamente dita, action.

For this route to work it is necessary an action with the name `hello_world` inside the controller:

Para essa rota funcionar é necessário existir dentro do controller uma action com o nome `hello_world`:

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

Pronto! foi criado uma rota em sua aplicação. Ao fazer uma request para o caminho raiz de sua aplicação `http://localhost:3001/` irá ser retornado o texto `Hello World!!!`!

Sendo que no lugar desse retorno do texto pode ser utilizado:
  - Renderização de arquivos Pug por meio da função `this.render('page', data)`
  - Total suporte a retorno de JSON
  - Suporte a retorno de Promises, elas serão resolvidas por traz dos panos, fique tranquilo!
  
#Todo
- [ ] Enable the configuration of routes to the module in the module itself
- [ ] Create an ORM that make reference between entities using has_many, has_one, belongs_to 
- [ ] Enable register of fields
- [ ] A nice way to field validation

# Todo
- [ ] Possibilitar a configuração das rotas para o modulo no proprio modulo
- [ ] Criar um ORM que possibilite a referencia entre as entidades utilizando has_many, has_one, belongs_to
- [ ] Possibilitar o registro dos fields
- [ ] Uma boa forma de validar os campos





