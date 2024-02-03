import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogNet: UNetConnection::PendingConnectionLost\. \[UNetConnection] RemoteAddr: ([0-9a-f]{32}):[0-9]+, Name: (SteamNetConnection_[0-9]+), Driver: GameNetDriver (SteamNetDriver_[0-9]+), IsServer: YES, PC: NULL, Owner: NULL, UniqueId: (?:Steam:UNKNOWN \[.+]|INVALID) bPendingDestroy=0/,
  onMatch: (args, logParser) => {
    const data = {
      raw: args[0],
      time: args[1],
      chainID: args[2],
      steamID: args[3],
      connection: args[4],
      driver: args[5]
    }

    delete logParser.eventStore.clients[data.connection]
    logParser.emit('PENDING_CONNECTION_DESTROYED', data)
  }
}
export default handler
