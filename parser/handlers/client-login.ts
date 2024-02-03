import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: Login: NewPlayer: EOSIpNetConnection \/Engine\/Transient\.(EOSIpNetConnection_[0-9]+)/,
  onMatch: (args, logParser) => {
    const data = {
      raw: args[0],
      time: args[1],
      chainID: args[2],
      connection: args[3]
    }

    logParser.eventStore.joinRequests[data.chainID].connection = data.connection
    delete logParser.eventStore.clients[data.connection]
    logParser.emit('CLIENT_LOGIN', data)
  }
}
export default handler
