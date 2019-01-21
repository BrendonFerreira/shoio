import { Shoio } from "@shoio/core";
import { ShoioHttpServer } from "../lib/index";


class PingService extends Shoio {

    mountRouter(http) {
        http.get('ping', this.ping)
    }

    routerMounted( server, config ) {
        console.log( 'Server running in port', config.port )
    }

    ping() {
        return 'pong'
    }

}

const app = new PingService({
    plugins: [
        new ShoioHttpServer({boot: true})  
    ]
})

app.mount()
