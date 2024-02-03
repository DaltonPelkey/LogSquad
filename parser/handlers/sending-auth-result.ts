import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogOnline: STEAM: AUTH HANDLER: Sending auth result to user (\d{17}) with flag success\? 1/,
  onMatch: (args, logParser) => {
    if (!logParser.eventStore.lastConnection) return

    const data = {
      ...logParser.eventStore.lastConnection,
      steamID: args[3]
    }

    logParser.eventStore.clients[data.connection] = data.steamID
    logParser.eventStore.connectionIdToSteamID.set(data.connection, data.steamID)

    delete logParser.eventStore.lastConnection

    logParser.emit('CLIENT_CONNECTED', data)
  }
}
export default handler
