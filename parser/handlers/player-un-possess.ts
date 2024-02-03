import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQPlayerController::)?OnUnPossess\(\): PC=(.+) \(Online IDs: EOS: (\w{32}) steam: (\d{17})\)/,
  onMatch: (args, logParser) => {
    const data = {
      raw: args[0],
      time: args[1],
      chainID: args[2],
      playerSuffix: args[3],
      playerEOSID: args[4],
      playerSteamID: args[5],
      switchPossess: args[4] in logParser.eventStore.possessCache && logParser.eventStore.possessCache[args[4]] === args[2]
    }

    delete logParser.eventStore.possessCache[data.playerSuffix]

    logParser.emit('PLAYER_UNPOSSESS', data)
  }
}
export default handler
