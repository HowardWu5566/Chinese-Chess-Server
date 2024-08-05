import { WebSocketServer } from 'ws'
import { GameService } from './services/GameService'

const PORT = 8080
const gameService = new GameService()
const wss = new WebSocketServer({ port: PORT })

wss.on('connection', gameService.handleNewConnection)
console.log(`WebSocket server is running on port ${PORT}`)
