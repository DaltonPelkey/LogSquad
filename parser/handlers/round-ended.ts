import {EventHandler} from '../types/EventHandler'

/**
 * Matches when Map state Changes to PostMatch (ScoreBoard)
 *
 * Emits winner and loser from eventstore
 *
 * winner and loser may be null if the match ends with a draw
 */
const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogGameState: Match State Changed from InProgress to WaitingPostMatch/,
  onMatch: (args, logParser) => {
    const data = {
      winner: logParser.eventStore.roundWinner ? logParser.eventStore.roundWinner : null,
      loser: logParser.eventStore.roundLoser ? logParser.eventStore.roundLoser : null,
      time: args[1]
    }

    delete logParser.eventStore.roundLoser
    delete logParser.eventStore.roundWinner

    logParser.emit('ROUND_ENDED', data)
  }
}
export default handler
