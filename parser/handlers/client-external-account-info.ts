import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]+)]LogEOS: Verbose: \[LogEOSConnect] FConnectClient::CacheExternalAccountInfo - ProductUserId: (?<eosID>[0-9a-f]{32}), AccountType: (\d), AccountId: (?<steamID>[0-9]{17}), DisplayName: <Redacted>/,
  onMatch: (args, logParser) => {
    const data = {
      raw: args[0],
      time: args[1],
      chainID: args[2],
      eosID: args.groups?.eosID,
      steamID: args.groups?.steamID
    }

    if (data.steamID && data.eosID) {
      logParser.eventStore.players[data.eosID] = {
        eosID: data.eosID,
        steamID: data.steamID
      }

      logParser.emit('CLIENT_EXTERNAL_ACCOUNT_INFO', data)
    }
  }
}
export default handler
