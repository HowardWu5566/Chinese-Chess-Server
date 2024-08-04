import { WebSocketServer } from 'ws'
import { PlayerService } from './services/PlayerService'
import { TableService } from './services/TableService'
import { GameService } from './services/GameService'

const PORT = 8080
const playerService = new PlayerService()
const tableService = new TableService()
const gameService = new GameService(playerService, tableService)
const wss = new WebSocketServer({ port: PORT })

wss.on('connection', gameService.handleNewConnection)
console.log(`WebSocket server is running on port ${PORT}`)
