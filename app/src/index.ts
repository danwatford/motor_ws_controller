import { exit } from 'process'

import { init as commandInit } from './command'

console.log('motor_ws_controller')

console.log(
  'Drives GPIO connected motors according to instructions received via WebSocket'
)

if (!process.env.COMMAND_URL) {
  console.error(
    "Environment variable COMMAND_URL not set. COMMAND_URL must be set to the URL of command server's websocket. E.g. ws://1.2.3.4/ws"
  )
  exit(1)
}

const commandUrl: string = process.env.COMMAND_URL!

console.log('Command WebSocket URL: ' + commandUrl)

commandInit(commandUrl)
