import WebSocket, { WebSocketServer } from 'ws'
import wss from '../src/app'

describe('WebSocket Server', () => {
  const PORT: number = 8080

  beforeAll(done => {
    wss.on('listening', done)
  })

  it('Establish a Connection', done => {
    const client = new WebSocket(`ws://localhost:${PORT}`)

    client.on('open', () => {
      expect(client.readyState).toBe(WebSocket.OPEN)
      client.close()
    })
    client.on('close', () => done())
  })

  it('Receive Messages', done => {
    const client = new WebSocket(`ws://localhost:${PORT}`)
    const testMessage = 'Hello, WebSocket'

    client.on('open', () => {
      client.send(testMessage)
    })

    wss.on('connection', ws => {
      ws.on('message', data => {
        expect(data.toString()).toBe(testMessage)
        client.close()
      })
      ws.on('close', () => done())
    })
  })

  afterAll(done => {
    wss.close(done)
  })
})
