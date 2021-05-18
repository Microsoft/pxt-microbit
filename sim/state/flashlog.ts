namespace pxsim.flashlog {
    // we don't store the flash log in the runtime object, since it's persistent
    let headers: string[] = []
    let rows: {
        text: string,
        timestamp: number
    }[] = []
    let currentRow: string[] = undefined
    let SEPARATOR = ","
    let timestampFormat: number = undefined

    function commitRow(text: string) {
        if (!runtime) return;

        const timestamp = runtime.runningTime()
        rows.push({ text, timestamp })
        // TODO: maybe do something better here
        // send data to simulator
        const data = `${text}${timestampFormat ? `${SEPARATOR}${(timestamp / timestampFormat)}` : ""}\n`;
        Runtime.postMessage(<SimulatorSerialMessage>{
            type: 'serial',
            data,
            id: runtime.id,
            sim: true
        })
    }

    export function beginRow(): number {
        if (currentRow)
            return DAL.DEVICE_INVALID_STATE
        currentRow = []
        return DAL.DEVICE_OK
    }

    export function logData(key: string, value: string) {
        if (!currentRow)
            return DAL.DEVICE_INVALID_STATE

        // find header index
        let index = headers.indexOf(key)
        if (index < 0) {
            headers.push(key)
            index = headers.length - 1
        }

        // store
        currentRow[index] = value

        return DAL.DEVICE_OK
    }

    export function endRow(): number {
        if (!currentRow)
            return DAL.DEVICE_INVALID_STATE
        const line = currentRow.join(SEPARATOR)
        currentRow = undefined
        commitRow(line)
        return DAL.DEVICE_OK
    }

    export function logString(s: string) {
        if (!s) return

        commitRow(s)
    }

    export function clear() {
        rows = []
        headers = []
        currentRow = undefined;
    }

    export function setTimeStamp(format: number) {
        // this option is probably not serialized, needs to move in state
        timestampFormat = format
    }
}
