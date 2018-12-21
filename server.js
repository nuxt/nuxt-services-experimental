const WebSocket = require('ws');


class RPC {
    constructor() {

    }

    testCall(x, y) {
        console.log("Test Call called", x, y);

        return x + y;
    }
}

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', function connection(ws) {

    ws.state = {
        rpc: new RPC()
    }

    console.log("New client");

    ws.on('error', function() {
        console.log("Got error");
    })

    ws.on('message', function incoming(message) {

        try {
            var obj = JSON.parse(message)
        } catch(e) {
            return;
        }

        let ret = null;

        switch (obj.action) {
            case "call":
                try {
                    ret = ws.state.rpc[obj.method](...obj.args);
                } catch(e) {
                    ret = e;
                }

                break;
            default:
        }

        const payload = {
            action: "return",
            challenge: obj.challenge || 0,
            data: ret
        }

        ws.send(JSON.stringify(payload));
    });
});

