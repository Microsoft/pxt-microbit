// Auto-generated. Do not edit.
declare namespace input {

    /**
     * Registers an event that runs when a sound is detected
     */
    //% help=input/on-sound
    //% blockId=input_on_sound block="on %sound sound"
    //% parts="microphone"
    //% weight=88 blockGap=12
    //% group="micro:bit (V2)" shim=input::onSound
    function onSound(sound: DetectedSound, handler: () => void): void;

    /**
     * Reads the loudness through the microphone from 0 (silent) to 255 (loud)
     */
    //% help=input/sound-level
    //% blockId=device_get_sound_level block="sound level"
    //% parts="microphone"
    //% weight=34 blockGap=8
    //% group="micro:bit (V2)" shim=input::soundLevel
    function soundLevel(): int32;

    /**
     * Sets the threshold for a sound type.
     */
    //% help=input/set-sound-threshold
    //% blockId=input_set_sound_threshold block="set %sound sound threshold to %value"
    //% parts="microphone"
    //% threshold.min=0 threshold.max=255
    //% weight=14 blockGap=8
    //% advanced=true
    //% group="micro:bit (V2)" threshold.defl=128 shim=input::setSoundThreshold
    function setSoundThreshold(sound: SoundThreshold, threshold?: int32): void;
}
declare namespace input {

    /**
     * Return microphone sampling period in microseconds.
     */
    //% shim=input::soundSamplingPeriod
    function soundSamplingPeriod(): int32;

    /**
     * Set microphone sampling period in microseconds. Typical range 20-200.
     */
    //% shim=input::setSoundSamplingPeriod
    function setSoundSamplingPeriod(us: int32): void;
}

// Auto-generated. Do not edit. Really.
