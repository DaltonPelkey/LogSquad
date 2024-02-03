import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQPlayerController::)?OnPossess\(\): PC=(.+) \(Online IDs: EOS: (\w{32}) steam: (\d{17})\) Pawn=([A-z0-9_]+)_C/,
  onMatch: (args, logParser) => {
    const data = {
      raw: args[0],
      time: args[1],
      chainID: args[2],
      playerSuffix: args[3],
      playerEOSID: args[4],
      playerSteamID: args[5],
      possessClassname: args[6],
      pawn: args[5]
    }

    logParser.eventStore.possessCache[data.playerSuffix] = data.chainID

    logParser.emit('PLAYER_POSSESS', data)
  }
}
export default handler
