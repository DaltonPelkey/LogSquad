import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogNet: AddClientConnection: Added client connection: \[UNetConnection] RemoteAddr: ([\d.]+):[0-9]+, Name: (EOSIpNetConnection_[0-9]+), Driver: GameNetDriver (EOSNetDriver_[0-9]+), IsServer: YES, PC: NULL, Owner: NULL, UniqueId: INVALID/,
  onMatch: (args, logParser) => {
    const data = {
      raw: args[0],
      time: args[1],
      chainID: args[2],
      ip: args[3],
      connection: args[4],
      driver: args[5]
    }

    logParser.eventStore.lastConnection = data
    logParser.emit('ADDING_CLIENT_CONNECTION', data)
  }
}
export default handler