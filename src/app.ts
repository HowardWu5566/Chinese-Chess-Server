import { WebSocketServer } from 'ws'
const PORT = 8080

const wss = new WebSocketServer({ port: PORT })

wss.on('connection', function connection(ws) {
  console.log('Someone connects to server')

  ws.on('error', console.error)

  ws.on('message', function message(data) {
    console.log('received: %s', data)
  })
})
