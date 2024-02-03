import {LogParser} from '../LogParser'

export type EventHandler = {
    regex: RegExp;
    onMatch: (args:RegExpMatchArray, logParser:LogParser) => void;
}