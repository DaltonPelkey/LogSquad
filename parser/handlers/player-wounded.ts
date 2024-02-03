import {EventHandler} from '../types/EventHandler'

const handler:EventHandler = {
  regex: /^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquadTrace: \[DedicatedServer](?:ASQSoldier::)?Wound\(\): Player:(.+) KillingDamage=-*([0-9.]+) from ([A-z_0-9]+) \(Online IDs: EOS: (\w{32}) steam: (\d{17}) \| Controller ID: (\w+)\) caused by ([A-z_0-9-]+)_C/,
  onMatch: (args, logParser) => {
    const data = {
      ...logParser.eventStore.damageCache[args[3]],
      raw: args[0],
      time: args[1],
      chainID: args[2],
      victimName: args[3],
      damage: parseFloat(args[4]),
      attackerPlayerController: args[5],
      attackerEOSID: args[6],
      attackerSteamID: args[7],
      weapon: args[9]
    }

    logParser.eventStore.damageCache[data.victimName] = data

    logParser.emit('PLAYER_WOUNDED', data)
  }
}
export default handler
