import WebSocket, { ErrorEvent } from 'ws'
import { ioMessageHandler } from './io'

type Command_WebSocket_States = 'DISCONNECTED' | 'CONNECTED'

let websocketState: Command_WebSocket_States = 'DISCONNECTED'

let url: string

let websocket: WebSocket

const onConnectWs = () => {
  console.log('Command websocket connection has been opened.')
  websocketState = 'CONNECTED'
}

const onCloseWs = () => {
  console.log('Command websocked has closed. Will reconnect.')
  websocketState = 'DISCONNECTED'

  setTimeout(() => init(url), 5000)
}

const onErrorWs = (error: ErrorEvent) => {
  console.error('Error making command websocket connection: ', error.message)
}

const wsMessageHandler = (data: WebSocket.Data) => {
  ioMessageHandler(data)
}

export const init = (websocketUrl: string) => {
  url = websocketUrl
  console.log(`Initialising command websocket connection: ${url}`)

  switch (websocketState) {
    case 'CONNECTED':
      if (websocket) {
        console.log(`Command websocket already open. Closing...`)
        websocket.close()
      }
      websocketState = 'DISCONNECTED'
      break
  }

  websocket = new WebSocket(url)
  websocketState = 'DISCONNECTED'

  websocket.on('open', onConnectWs)
  websocket.on('message', wsMessageHandler)
  websocket.on('close', onCloseWs)
  websocket.on('error', onErrorWs)
}
