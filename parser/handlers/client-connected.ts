import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogNet: AddClientConnection: Added client connection: \[UNetConnection] RemoteAddr: ([0-9]{17}):[0-9]+, Name: (SteamNetConnection_[0-9]+), Driver: GameNetDriver (SteamNetDriver_[0-9]+), IsServer: YES, PC: NULL, Owner: NULL, UniqueId: INVALID/,
  onMatch: (args, logParser) => {
    const data = {
      raw: args[0],
      time: args[1],
      chainID: args[2],
      steamID: args[3],
      connection: args[4],
      driver: args[5]
    }

    logParser.eventStore.clients[data.connection] = data.steamID
    logParser.emit('CLIENT_CONNECTED', data)
  }
}
export default handler
