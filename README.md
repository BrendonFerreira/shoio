# Shoio Server

## Installing

  `npm install --save @shoio/core @shoio/server`

## Getting Started

```javascript
import { Shoio } from "@shoio/core";
import { ShoioHttpServer } from "@shoio/server";

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
```