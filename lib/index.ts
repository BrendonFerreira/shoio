import * as Router from "koa-router";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser"
import * as cors from 'koa-cors'
export class ShoioHttpServer {
  $options: any = {};
  $server: Koa;
  $router: ShoioHttpServerRouterBuilder;

  constructor(config) {
    this.$options = config;
    this.$server = new Koa();
  }

  startServer(sh) {

    const component =
      (this.$options.entry && sh.getComponent(this.$options.entry)) || sh;
    const router = component.__createRouter();

    if (!router) {
      throw new Error(
        'Entry component have not required handler functions "mountRouter" '
      );
    }
    
    this.$server.use(cors())
    this.$server.use(bodyParser())
    this.$server.use(router.routes());

    this.$server.listen(this.$options.port || 3000, () => {
      if (component.serverUp) {
        component.serverUp(this.$server, this.$options);
      }
    });
  }

  static setRouterConfigurator(sh) {
    sh.$options.routerConfiguratorName = "mountRouter";
    let configuratorName = sh.$options.routerConfiguratorName;

    if (typeof sh.$options.routerConfigurer === "function") {
      return;
    } else if (typeof sh.$options.routerConfigurer === "string") {
      configuratorName = sh.$options.routerConfigurer;
    }

    const configuratorFunction =
      sh.$options[configuratorName] || sh[configuratorName];

    if (!configuratorFunction) {
      return;
    }

    sh.$options.routerConfigurer = configuratorFunction;
  }

  install(shoio) {
    
    shoio.on("created", sh => {

      sh.$router = new ShoioHttpServerRouterBuilder(sh);

      // if mount router is not defined inside of component, search for routerConfiguratorName
      // and call it
      sh.$routerConfigurer = sh.mountRouter || ( sh.$options.routerConfiguratorName && sh[sh.$options.routerConfiguratorName] );

      sh.__createRouter = () => {

        if (!sh.$routerConfigurer) {
          return;
        }

        // Call the configurer handler from component
        sh.$routerConfigurer.call(sh, sh.$router, this.$server);

        /*
         Title: Configure Router prefix
        */
        // verify if was defined in constructor params
        if (typeof sh.$options.routerPrefix === "undefined") {
          sh.$routerPrefix = "/";
        }

        // verify if was defined in constructor params
        // with another name
        if (typeof sh.$options.prefix !== "undefined") {
          sh.$routerPrefix = sh.$options.prefix;
        }

        // Detect if prefix was configured inside component handler
        if ( typeof sh.$router.prefix !== "undefined") {
          sh.$routerPrefix = sh.$router.prefix;
        }
        
        // Creating another router to support the prefix
        const routerOut = new Router({ prefix: sh.$routerPrefix });
        routerOut.use(sh.$router.build().routes());
        return routerOut;
      };
    
    });

    // If is parent
    if (shoio.$parent) {
      return;
    }
    
    shoio.on("mounted", sh => {
      // @ts-ignore
      if (this.$options.boot) {
        this.startServer(sh);
      }
    });
  }
}

const defaultParser = (...args) => args 

export class ShoioHttpServerRouterBuilder {
  __scope: any = {};
  $router: Router = new Router();
  constructor(scope) {
    this.__scope = scope;
  }
  createHandler(action, requestParser = defaultParser ) {
    return async (ctx, next) => {

      const args = requestParser( ctx, next )

      let response;

      if (!action) {
        ctx.body = "Action not found";
        return;
      } else if (typeof action === "function") {
        response = action.call(this.__scope, ...args, next);
      } else if (typeof action === "object") {
        response = "not supported action";
      } else if (typeof action === "string") {
        action = this.__scope[action]
        response = action.call(this.__scope, ...args, next);
      }

      if (response || response instanceof Promise) {
        ctx.body = await response;
      }
      
      return;
    };
  }
  get(path, action, requestParser) {
    this.$router.get(path, this.createHandler(action, requestParser));
  }
  post(path, action, requestParser) {
    this.$router.post(path, this.createHandler(action, requestParser));
  }
  put(path, action, requestParser) {
    this.$router.put(path, this.createHandler(action, requestParser));
  }
  delete(path, action, requestParser) {
    this.$router.delete(path, this.createHandler(action, requestParser));
  }
  patch(path, action, requestParser) {
    this.$router.patch(path, this.createHandler(action, requestParser));
  }
  all(path, action, requestParser) {
    this.$router.patch(path, this.createHandler(action, requestParser));
  }
  middlewhere(action) {
    this.$router.use( (...args) => action.call( this.__scope, ...args ));
  }
  useComponent(path, componentSignature) {
    const component = this.__scope.getComponent(componentSignature, true, true);

    if (process.env.DEBUG && !component) {
      console.log(
        "Component not found, may be not registred or not mounted in application -->",
        typeof componentSignature,
        componentSignature.name
      );
    }

    if (!component) {
      return;
    }

    const router = component.__createRouter();

    if (!router) {
      console.log("Router not created");
      return;
    }

    this.$router.use(path, router.routes());
  }
  build() {
    return this.$router;
  }
}
