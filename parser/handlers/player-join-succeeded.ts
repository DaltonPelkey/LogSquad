import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogNet: Join succeeded: (.+)/,
  onMatch: (args, logParser) => {
    const data:any = {
      raw: args[0],
      time: args[1],
      chainID: +args[2],
      playerSuffix: args[3]
    }

    const joinRequestsData = logParser.eventStore.joinRequests[data.chainID]

    data.eosID = joinRequestsData.eosID
    data.controller = joinRequestsData.controller

    if (joinRequestsData.connection) {
      data.steamID = logParser.eventStore.connectionIdToSteamID.get(joinRequestsData.connection)
      logParser.eventStore.connectionIdToSteamID.delete(joinRequestsData.connection)
    }

    delete logParser.eventStore.joinRequests[data.chainID]

    // Handle Reconnecting players
    if (logParser.eventStore.disconnected[data.eosID]) {
      delete logParser.eventStore.disconnected[data.eosID]
    }

    logParser.emit('JOIN_SUCCEEDED', data)
  }
}
export default handler
