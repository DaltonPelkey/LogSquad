import {Tail} from 'tail'

export class LogReader {
    private reader: Tail

    constructor(
        logFilePath:string,
        processLine:(logLine:string) => void
    ) {
        this.reader = new Tail(logFilePath, {
            useWatchFile: true
        })

        this.reader.on('line', processLine)
    }

    watch() {
        this.reader.watch()
    }

    unwatch() {
        this.reader.unwatch()
    }
}