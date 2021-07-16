namespace loops {
    /**
     * Repeats the code forever in the background.
     * After each iteration, allows other codes to run for a set duration
     * so that it runs on a timer
     * @param interval time (in ms) to wait between each iteration of the action.
     * @param body code to execute
     */
    //% weight=45 blockAllowMultiple=1
    //% interval.shadow=longTimePicker
    //% afterOnStart=true help=loops/every-interval
    //% blockId=every_interval block="every $interval ms"
    export function everyInterval(interval: number, a: () => void): void {
        control.runInParallel(() => {
            while (true) {
                a();
                pause(interval);
            }
        });
    }

    /**
      * Get the time field editor
      * @param ms time duration in milliseconds, eg: 500, 1000
      */
    //% blockId=longTimePicker block="%ms"
    //% blockHidden=true shim=TD_ID
    //% colorSecondary="#FFFFFF"
    //% ms.fieldEditor="numberdropdown" ms.fieldOptions.decompileLiterals=true
    //% ms.fieldOptions.data='[["100 ms", 100], ["200 ms", 200], ["500 ms", 500], ["1 second", 1000], ["1 minute", 60000], ["1 hour", 3600000]]'
    export function __timePicker(ms: number): number {
        return ms;
    }
}