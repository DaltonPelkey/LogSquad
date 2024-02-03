import EventEmitter from 'events'
import fs from 'fs'
import moment from 'moment'
import {EventHandler} from './types/EventHandler'
import {LogReader} from './LogReader'
import {Player} from './types/Player'
import {JoinRequest} from './types/JoinRequest'
import {WinnerData} from './types/WinnerData'
import {LastConnection} from './types/LastConnection'
import RoundTickets from './handlers/round-tickets'
import {RoundTicket} from './types/RoundTicket'

export class LogParser extends EventEmitter {
    private eventHandlers: EventHandler[] | undefined
    private logReader: LogReader
    public eventStore: {
        /** Key is EOS ID */
        disconnected: Record<string, boolean>;
        /** Connection ID -> Steam ID */
        clients: Record<string, string>;
        /** Key is EOS ID */
        players: Record<string, Player>;
        /** Key is chain ID */
        joinRequests: Record<string, JoinRequest>;
        connectionIdToSteamID: Map<string, string>;
        lastConnection?: LastConnection;
        lastWinner?: WinnerData;
        /** Player suffix -> Chain ID */
        possessCache: Record<string, string>;
        /** Player name -> Event data (Track wounded, died, and revived events across log lines) */
        damageCache: Record<string, any>;
        roundWinner?: RoundTicket;
        roundLoser?: RoundTicket;
    }

    constructor(logFilePath:string) {
        super()

        this.processLine = this.processLine.bind(this)
        this.logReader = new LogReader(logFilePath, this.processLine)

        this.eventStore = {
            disconnected: {}, // holding area, cleared on map change.
            players: {}, // persistent data, steamid, controller, suffix.
            connectionIdToSteamID: new Map(),
            clients: {}, // used in the connection chain before we resolve a player.
            joinRequests: {},
            possessCache: {},
            damageCache: {}
        }
    }

    async processLine(line:string) {
        const handlers = await this.getHandlers()
        for (let handler of handlers) {
            const match = line.match(handler.regex)
            if (!match) continue
            match[1] = moment.utc(match[1], 'YYYY.MM.DD-hh.mm.ss:SSS').toDate().toString()
            handler.onMatch(match, this)
            break
        }
    }

    async getHandlers() {
        if (!this.eventHandlers) {
            this.eventHandlers = []
            const paths = fs.readdirSync('./handlers')
            for (let path of paths) {
                const handler = await import(path)
                this.eventHandlers.push(handler)
            }
        }
        return this.eventHandlers
    }

    start() {
        this.logReader.watch()
    }

    stop() {
        this.logReader.unwatch()
    }

    clearEventStore() {
        for (const player of Object.values(this.eventStore.players)) {
            if (this.eventStore.disconnected[player.eosID]) {
                delete this.eventStore.players[player.eosID]
                delete this.eventStore.disconnected[player.eosID]
            }
        }
        this.eventStore.possessCache = {}
        this.eventStore.damageCache = {}
    }
}
