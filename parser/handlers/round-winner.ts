import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQGameMode::)?DetermineMatchWinner\(\): (.+) won on (.+)/,
  onMatch: (args, logParser) => {
    const data = {
      raw: args[0],
      time: args[1],
      chainID: args[2],
      winner: args[3],
      layer: args[4]
    }

    if (logParser.eventStore.lastWinner) {
      logParser.eventStore.lastWinner = { ...data, winner: null }
    } else {
      logParser.eventStore.lastWinner = data
    }
  }
}
export default handler
