import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: PostLogin: NewPlayer: BP_PlayerController_C .+PersistentLevel\.(\S+) \(IP: ([\d.]+) \| Online IDs: EOS: ([0-9a-f]{32}) steam: (\d+)\)/,
  onMatch: (args, logParser) => {
    const data:any = {
      raw: args[0],
      time: args[1],
      chainID: args[2],
      playerController: args[3],
      ip: args[4],
      eosID: args[5],
      steamID: args[6]
    }

    const joinRequestData = logParser.eventStore.joinRequests[data.chainID]

    data.connection = joinRequestData.connection
    data.playerSuffix = joinRequestData.suffix

    if (!logParser.eventStore.players[data.eosID]) {
      logParser.eventStore.players[data.eosID] = {
        steamID: data.steamID,
        eosID: data.eosID
      }
    }
    logParser.eventStore.players[data.eosID].controller = data.playerController

    logParser.emit('PLAYER_CONNECTED', data)
  }
}
export default handler
