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

Ao rodar esse projeto, com esse simples trecho de codigo, será gerado um CRUD disponibilizando rotas para realizar operações, sendo essas que serão mostradas no terminal da seguinte forma:

```
Spawning route: article#list GET /articles/
Spawning route: article#getById GET /articles/:id
Spawning route: article#create POST /articles/
Spawning route: article#update PUT /articles/:id
Spawning route: article#delete DELETE /articles/:id
```

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

A ação é separada por duas partes:
  - 1: nome do módulo
  - 2: metodo para ser chamado do controller
Sendo essas, juntas pelo '#' formando a propriamente dita, action.

Para essa rota funcionar é necessário existir dentro do controller uma action com o nome `hello_world`:

```javascript

app.modules.register({
  name: 'users',
  ...
  controller: {
    hello_world(){
      return "Olá mundo!!!"
    }
  }
})

```

Pronto! foi criado uma rota em sua aplicação. Ao fazer uma request para o caminho raiz de sua aplicação `http://localhost:3001/` irá ser retornado o texto `Olá mundo!!!`!

Sendo que no lugar desse retorno do texto pode ser utilizado:
  - Renderização de arquivos Pug por meio da função `this.render('page', data)`
  - Total suporte a retorno de JSON
  - Suporte a retorno de Promises, elas serão resolvidas por traz dos panos, fique tranquilo!
  
# Todo
- [ ] Possibilitar a configuração das rotas para o modulo no proprio modulo
- [ ] Criar um ORM que possibilite a referencia entre as entidades utilizando has_many, has_one, belongs_to
  










