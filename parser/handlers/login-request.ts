import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogNet: Login request: \?Name=(.+?)(?:\?PASSWORD=.+?)? userId: RedpointEOS:([\da-f]{32}) platform: RedpointEOS/,
  onMatch: (args, logParser) => {
    const data = {
      raw: args[0],
      time: args[1],
      chainID: args[2],
      suffix: args[3],
      eosID: args[4]
    }

    logParser.emit('CLIENT_LOGIN_REQUEST', data)
  }
}
export default handler
