import * as Router from "koa-router";
import * as Koa from "koa";
export declare class ShoioHttpServer {
    $options: any;
    $server: Koa;
    $router: ShoioHttpServerRouterBuilder;
    constructor(config: any);
    startServer(sh: any): void;
    static setRouterConfigurator(sh: any): void;
    install(shoio: any): void;
}
export declare class ShoioHttpServerRouterBuilder {
    __scope: any;
    $router: Router;
    constructor(scope: any);
    createHandler(action: any, requestParser?: (...args: any[]) => any[]): (ctx: any, next: any) => Promise<void>;
    get(path: any, action: any, requestParser: any): void;
    post(path: any, action: any, requestParser: any): void;
    put(path: any, action: any, requestParser: any): void;
    delete(path: any, action: any, requestParser: any): void;
    patch(path: any, action: any, requestParser: any): void;
    all(path: any, action: any, requestParser: any): void;
    middlewhere(action: any): void;
    useComponent(path: any, componentSignature: any): void;
    build(): Router;
}
