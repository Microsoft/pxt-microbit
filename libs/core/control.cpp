#include "pxt.h"

extern uint32_t __StackTop;

/**
 * How to create the event.
 */
enum class EventCreationMode {
    /**
     * MicroBitEvent is initialised, and no further processing takes place.
     */
    CreateOnly = CREATE_ONLY,
    /**
     * MicroBitEvent is initialised, and its event handlers are immediately fired (not suitable for use in interrupts!).
     */
    CreateAndFire = CREATE_AND_FIRE,
};

const char *MICROBIT_BOARD_VERSION[2] = { "2.0", "2.X" };

// note the trailing '_' in names - otherwise we get conflict with the pre-processor
// this trailing underscore is removed by enums.d.ts generation process

// TODO shouldn't these be renamed to something more sensible anyways?

enum EventBusSource {
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_BUTTON_A_ = MICROBIT_ID_BUTTON_A,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_BUTTON_B_ = MICROBIT_ID_BUTTON_B,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_BUTTON_AB_ = MICROBIT_ID_BUTTON_AB,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_RADIO_ = MICROBIT_ID_RADIO,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_GESTURE_ = MICROBIT_ID_GESTURE,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_ACCELEROMETER_ = MICROBIT_ID_ACCELEROMETER,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P0_ = MICROBIT_ID_IO_P0,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P1_ = MICROBIT_ID_IO_P1,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P2_ = MICROBIT_ID_IO_P2,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P3_ = MICROBIT_ID_IO_P3,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P4_ = MICROBIT_ID_IO_P4,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P5_ = MICROBIT_ID_IO_P5,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P6_ = MICROBIT_ID_IO_P6,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P7_ = MICROBIT_ID_IO_P7,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P8_ = MICROBIT_ID_IO_P8,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P9_ = MICROBIT_ID_IO_P9,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P10_ = MICROBIT_ID_IO_P10,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P11_ = MICROBIT_ID_IO_P11,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P12_ = MICROBIT_ID_IO_P12,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P13_ = MICROBIT_ID_IO_P13,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P14_ = MICROBIT_ID_IO_P14,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P15_ = MICROBIT_ID_IO_P15,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P16_ = MICROBIT_ID_IO_P16,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P19_ = MICROBIT_ID_IO_P19,
    //% blockIdentity="control.eventSourceId"
    MICROBIT_ID_IO_P20_ = MICROBIT_ID_IO_P20,
    //% blockIdentity="control.eventSourceId"
    MES_DEVICE_INFO_ID_ = MES_DEVICE_INFO_ID,
    //% blockIdentity="control.eventSourceId"
    MES_SIGNAL_STRENGTH_ID_ = MES_SIGNAL_STRENGTH_ID,
    //% blockIdentity="control.eventSourceId"
    MES_DPAD_CONTROLLER_ID_ = MES_DPAD_CONTROLLER_ID,
    //% blockIdentity="control.eventSourceId"
    MES_BROADCAST_GENERAL_ID_ = MES_BROADCAST_GENERAL_ID,
};

enum EventBusValue {
    //% blockIdentity="control.eventValueId"
    MICROBIT_EVT_ANY_ = MICROBIT_EVT_ANY,
    //% blockIdentity="control.eventValueId"
    MICROBIT_BUTTON_EVT_DOWN_ = MICROBIT_BUTTON_EVT_DOWN,
    //% blockIdentity="control.eventValueId"
    MICROBIT_BUTTON_EVT_UP_ = MICROBIT_BUTTON_EVT_UP,
    //% blockIdentity="control.eventValueId"
    MICROBIT_BUTTON_EVT_CLICK_ = MICROBIT_BUTTON_EVT_CLICK,
    //% blockIdentity="control.eventValueId"
    MICROBIT_BUTTON_EVT_LONG_CLICK_ = MICROBIT_BUTTON_EVT_LONG_CLICK,
    //% blockIdentity="control.eventValueId"
    MICROBIT_RADIO_EVT_DATAGRAM_ = MICROBIT_RADIO_EVT_DATAGRAM,
    //% blockIdentity="control.eventValueId"
    MICROBIT_ACCELEROMETER_EVT_DATA_UPDATE_ = MICROBIT_ACCELEROMETER_EVT_DATA_UPDATE,
    //% blockIdentity="control.eventValueId"
    MICROBIT_PIN_EVT_RISE_ = MICROBIT_PIN_EVT_RISE,
    //% blockIdentity="control.eventValueId"
    MICROBIT_PIN_EVT_FALL_ = MICROBIT_PIN_EVT_FALL,
    //% blockIdentity="control.eventValueId"
    MICROBIT_PIN_EVT_PULSE_HI_ = MICROBIT_PIN_EVT_PULSE_HI,
    //% blockIdentity="control.eventValueId"
    MICROBIT_PIN_EVT_PULSE_LO_ = MICROBIT_PIN_EVT_PULSE_LO,
    //% blockIdentity="control.eventValueId"
    MES_ALERT_EVT_ALARM1_ = MES_ALERT_EVT_ALARM1,
    //% blockIdentity="control.eventValueId"
    MES_ALERT_EVT_ALARM2_ = MES_ALERT_EVT_ALARM2,
    //% blockIdentity="control.eventValueId"
    MES_ALERT_EVT_ALARM3_ = MES_ALERT_EVT_ALARM3,
    //% blockIdentity="control.eventValueId"
    MES_ALERT_EVT_ALARM4_ = MES_ALERT_EVT_ALARM4,
    //% blockIdentity="control.eventValueId"
    MES_ALERT_EVT_ALARM5_ = MES_ALERT_EVT_ALARM5,
    //% blockIdentity="control.eventValueId"
    MES_ALERT_EVT_ALARM6_ = MES_ALERT_EVT_ALARM6,
    //% blockIdentity="control.eventValueId"
    MES_ALERT_EVT_DISPLAY_TOAST_ = MES_ALERT_EVT_DISPLAY_TOAST,
    //% blockIdentity="control.eventValueId"
    MES_ALERT_EVT_FIND_MY_PHONE_ = MES_ALERT_EVT_FIND_MY_PHONE,
    //% blockIdentity="control.eventValueId"
    MES_ALERT_EVT_PLAY_RINGTONE_ = MES_ALERT_EVT_PLAY_RINGTONE,
    //% blockIdentity="control.eventValueId"
    MES_ALERT_EVT_PLAY_SOUND_ = MES_ALERT_EVT_PLAY_SOUND,
    //% blockIdentity="control.eventValueId"
    MES_ALERT_EVT_VIBRATE_ = MES_ALERT_EVT_VIBRATE,
    //% blockIdentity="control.eventValueId"
    MES_CAMERA_EVT_LAUNCH_PHOTO_MODE_ = MES_CAMERA_EVT_LAUNCH_PHOTO_MODE,
    //% blockIdentity="control.eventValueId"
    MES_CAMERA_EVT_LAUNCH_VIDEO_MODE_ = MES_CAMERA_EVT_LAUNCH_VIDEO_MODE,
    //% blockIdentity="control.eventValueId"
    MES_CAMERA_EVT_START_VIDEO_CAPTURE_ = MES_CAMERA_EVT_START_VIDEO_CAPTURE,
    //% blockIdentity="control.eventValueId"
    MES_CAMERA_EVT_STOP_PHOTO_MODE_ = MES_CAMERA_EVT_STOP_PHOTO_MODE,
    //% blockIdentity="control.eventValueId"
    MES_CAMERA_EVT_STOP_VIDEO_CAPTURE_ = MES_CAMERA_EVT_STOP_VIDEO_CAPTURE,
    //% blockIdentity="control.eventValueId"
    MES_CAMERA_EVT_STOP_VIDEO_MODE_ = MES_CAMERA_EVT_STOP_VIDEO_MODE,
    //% blockIdentity="control.eventValueId"
    MES_CAMERA_EVT_TAKE_PHOTO_ = MES_CAMERA_EVT_TAKE_PHOTO,
    //% blockIdentity="control.eventValueId"
    MES_CAMERA_EVT_TOGGLE_FRONT_REAR_ = MES_CAMERA_EVT_TOGGLE_FRONT_REAR,
    //% blockIdentity="control.eventValueId"
    MES_DEVICE_DISPLAY_OFF_ = MES_DEVICE_DISPLAY_OFF,
    //% blockIdentity="control.eventValueId"
    MES_DEVICE_DISPLAY_ON_ = MES_DEVICE_DISPLAY_ON,
    //% blockIdentity="control.eventValueId"
    MES_DEVICE_GESTURE_DEVICE_SHAKEN_ = MES_DEVICE_GESTURE_DEVICE_SHAKEN,
    //% blockIdentity="control.eventValueId"
    MES_DEVICE_INCOMING_CALL_ = MES_DEVICE_INCOMING_CALL,
    //% blockIdentity="control.eventValueId"
    MES_DEVICE_INCOMING_MESSAGE_ = MES_DEVICE_INCOMING_MESSAGE,
    //% blockIdentity="control.eventValueId"
    MES_DEVICE_ORIENTATION_LANDSCAPE_ = MES_DEVICE_ORIENTATION_LANDSCAPE,
    //% blockIdentity="control.eventValueId"
    MES_DEVICE_ORIENTATION_PORTRAIT_ = MES_DEVICE_ORIENTATION_PORTRAIT,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_1_DOWN_ = MES_DPAD_BUTTON_1_DOWN,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_1_UP_ = MES_DPAD_BUTTON_1_UP,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_2_DOWN_ = MES_DPAD_BUTTON_2_DOWN,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_2_UP_ = MES_DPAD_BUTTON_2_UP,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_3_DOWN_ = MES_DPAD_BUTTON_3_DOWN,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_3_UP_ = MES_DPAD_BUTTON_3_UP,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_4_DOWN_ = MES_DPAD_BUTTON_4_DOWN,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_4_UP_ = MES_DPAD_BUTTON_4_UP,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_A_DOWN_ = MES_DPAD_BUTTON_A_DOWN,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_A_UP_ = MES_DPAD_BUTTON_A_UP,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_B_DOWN_ = MES_DPAD_BUTTON_B_DOWN,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_B_UP_ = MES_DPAD_BUTTON_B_UP,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_C_DOWN_ = MES_DPAD_BUTTON_C_DOWN,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_C_UP_ = MES_DPAD_BUTTON_C_UP,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_D_DOWN_ = MES_DPAD_BUTTON_D_DOWN,
    //% blockIdentity="control.eventValueId"
    MES_DPAD_BUTTON_D_UP_ = MES_DPAD_BUTTON_D_UP,
    //% blockIdentity="control.eventValueId"
    MES_REMOTE_CONTROL_EVT_FORWARD_ = MES_REMOTE_CONTROL_EVT_FORWARD,
    //% blockIdentity="control.eventValueId"
    MES_REMOTE_CONTROL_EVT_NEXTTRACK_ = MES_REMOTE_CONTROL_EVT_NEXTTRACK,
    //% blockIdentity="control.eventValueId"
    MES_REMOTE_CONTROL_EVT_PAUSE_ = MES_REMOTE_CONTROL_EVT_PAUSE,
    //% blockIdentity="control.eventValueId"
    MES_REMOTE_CONTROL_EVT_PLAY_ = MES_REMOTE_CONTROL_EVT_PLAY,
    //% blockIdentity="control.eventValueId"
    MES_REMOTE_CONTROL_EVT_PREVTRACK_ = MES_REMOTE_CONTROL_EVT_PREVTRACK,
    //% blockIdentity="control.eventValueId"
    MES_REMOTE_CONTROL_EVT_REWIND_ = MES_REMOTE_CONTROL_EVT_REWIND,
    //% blockIdentity="control.eventValueId"
    MES_REMOTE_CONTROL_EVT_STOP_ = MES_REMOTE_CONTROL_EVT_STOP,
    //% blockIdentity="control.eventValueId"
    MES_REMOTE_CONTROL_EVT_VOLUMEDOWN_ = MES_REMOTE_CONTROL_EVT_VOLUMEDOWN,
    //% blockIdentity="control.eventValueId"
    MES_REMOTE_CONTROL_EVT_VOLUMEUP_ = MES_REMOTE_CONTROL_EVT_VOLUMEUP,
};

enum EventFlags {
    //%
    QueueIfBusy = MESSAGE_BUS_LISTENER_QUEUE_IF_BUSY,
    //%
    DropIfBusy = MESSAGE_BUS_LISTENER_DROP_IF_BUSY,
    //%
    Reentrant = MESSAGE_BUS_LISTENER_REENTRANT
};

//% weight=1 color="#333333"
//% advanced=true
namespace control {
    void fiberDone(void *a)
    {
      decr((Action)a);
      release_fiber();
    }

    /**
    * Gets the number of milliseconds elapsed since power on.
    */
    //% help=control/millis weight=50
    //% blockId=control_running_time block="millis (ms)"
    int millis() {
        return system_timer_current_time();
    }

    /**
    * Gets current time in microseconds. Overflows every ~18 minutes.
    */
    //%
    int micros() {
        return system_timer_current_time_us() & 0x3fffffff;
    }

    /**
     * Schedules code that run in the background.
     */
    //% help=control/in-background blockAllowMultiple=1 afterOnStart=true
    //% blockId="control_in_background" block="run in background" blockGap=8
    void inBackground(Action a) {
      runInParallel(a);
    }

    /**
    * Blocks the calling thread until the specified event is raised.
    */
    //% help=control/wait-for-event async
    //% blockId=control_wait_for_event block="wait for event|from %src|with value %value"
    void waitForEvent(int src, int value) {
        pxt::waitForEvent(src, value);
    }

    /**
     * Resets the BBC micro:bit.
     */
    //% weight=30 async help=control/reset blockGap=8
    //% blockId="control_reset" block="reset"
    void reset() {
      microbit_reset();
    }

    /**
    * Blocks the current fiber for the given microseconds
    * @param micros number of micro-seconds to wait. eg: 4
    */
    //% help=control/wait-micros weight=29 async
    //% blockId="control_wait_us" block="wait (µs)%micros"
    //% micros.min=0 micros.max=6000
    void waitMicros(int micros) {
        sleep_us(micros);
    }

    /**
     * Raises an event in the event bus.
     * @param src ID of the MicroBit Component that generated the event e.g. MICROBIT_ID_BUTTON_A.
     * @param value Component specific code indicating the cause of the event.
     * @param mode optional definition of how the event should be processed after construction (default is CREATE_AND_FIRE).
     */
    //% weight=21 blockGap=12 blockId="control_raise_event" block="raise event|from source %src=control_event_source_id|with value %value=control_event_value_id" blockExternalInputs=1
    //% help=control/raise-event
    //% mode.defl=CREATE_AND_FIRE
    void raiseEvent(int src, int value, EventCreationMode mode) {
        MicroBitEvent evt(src, value, (MicroBitEventLaunchMode)mode);
    }

    /**
     * Registers an event handler.
     */
    //% weight=20 blockGap=8 blockId="control_on_event" block="on event|from %src=control_event_source_id|with value %value=control_event_value_id"
    //% help=control/on-event
    //% blockExternalInputs=1
    void onEvent(int src, int value, Action handler, int flags = 0) {
        if (!flags) flags = ::EventFlags::QueueIfBusy;
        registerWithDal(src, value, handler, (int)flags);
    }

    /**
    * Gets the value of the last event executed on the bus
    */
    //% blockId=control_event_value" block="event value"
    //% help=control/event-value
    //% weight=18
    int eventValue() {
        return pxt::lastEvent.value;
    }

    /**
    * Gets the timestamp of the last event executed on the bus
    */
    //% blockId=control_event_timestamp" block="event timestamp"
    //% help=control/event-timestamp
    //% weight=19 blockGap=8
    int eventTimestamp() {
        return pxt::lastEvent.timestamp;
    }

    /**
     * Make a friendly name for the device based on its serial number
     */
    //% blockId="control_device_name" block="device name" weight=10 blockGap=8
    //% help=control/device-name
    //% advanced=true
    String deviceName() {
        return mkString(microbit_friendly_name(), -1);
    }

    /**
     * Returns the major version of the microbit
     */
    //% help=control/hardware-version
    String _hardwareVersion() {
        #if MICROBIT_CODAL
            MicroBitVersion v = uBit.power.getVersion();
            int versionIdx;
            switch (v.board) {
                case 0x9903:
                case 0x9904:
                    versionIdx = 0;
                    break;
                default:
                    versionIdx = 1;
                    break;
            }
            return mkString(MICROBIT_BOARD_VERSION[versionIdx], -1);
        #else
            return mkString("1.X", 1);
        #endif
    }

    /**
    * Derive a unique, consistent serial number of this device from internal data.
    */
    //% blockId="control_device_serial_number" block="device serial number" weight=9
    //% help=control/device-serial-number
    //% advanced=true
    int deviceSerialNumber() {
        return microbit_serial_number();
    }

   /**
    * Derive a unique, consistent 64-bit serial number of this device from internal data.
    */
    //% help=control/device-long-serial-number
    //% advanced=true
    Buffer deviceLongSerialNumber() {
        return mkBuffer((uint8_t*)&NRF_FICR->DEVICEID[0], sizeof(uint64_t));
    }

    /**
    * Informs simulator/runtime of a MIDI message
    * Internal function to support the simulator.
    */
    //% part=midioutput blockHidden=1
    void __midiSend(Buffer buffer) {
        // this is a stub to support the simulator
    }

    /**
    *
    */
    //%
    void __log(int priority, String text) {
        if (NULL == text) return;
        pxt::sendSerial(text->getUTF8Data(), text->getUTF8Size());
    }



/**
* Allocates the next user notification event
*/
//% help=control/allocate-notify-event
int allocateNotifyEvent() {
#if MICROBIT_CODAL
    return ::allocateNotifyEvent();
#else
    static int notifyEv = 1024;
    return ++notifyEv;
#endif
}

/** Write a message to DMESG debugging buffer. */
//%
void dmesg(String s) {
    // this is no-op on v1
    DMESG("# %s", s->getUTF8Data());
}

/** Write a message and value (pointer) to DMESG debugging buffer. */
//%
void dmesgPtr(String str, Object_ ptr) {
    // this is no-op on v1
    DMESG("# %s: %p", str->getUTF8Data(), ptr);
}

//%
uint32_t _ramSize()
{
    return (uint32_t)&__StackTop & 0x1fffffff;
}

}
