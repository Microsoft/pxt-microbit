// The fallback logic below still requires level detection.
// It's only kept with a view to syncing with the common-packages in future.

#include "pxt.h"

#if MICROBIT_CODAL

#include "LevelDetector.h"
#include "LevelDetectorSPL.h"
#include "DataStream.h"

namespace pxt {

class TeeStream : public DataSink, public DataSource {
  public:
    int evid;
    DataSource &upstream;
    DataStream output;
    ManagedBuffer buffer;
    bool pxtPending;

    TeeStream(int evid, DataSource &src) : evid(evid), upstream(src), output(*this) {
        pxtPending = false;
        output.setBlocking(false);
        upstream.connect(*this);
    }

    Buffer pxtBuffer() {
        if (!pxtPending)
            return nullptr;
        pxtPending = false;
        return mkBuffer(buffer.getBytes(), buffer.length());
    }

    virtual ManagedBuffer pull() override { return buffer; }
    virtual int getFormat() override { return upstream.getFormat(); }
    virtual int setFormat(int format) override { return upstream.setFormat(format); }

    virtual int pullRequest() override {
        buffer = upstream.pull();
        pxtPending = buffer.length() > 0;
        output.pullRequest();
        Event(DEVICE_ID_NOTIFY, evid);
        return DEVICE_OK;
    }
};

class WMicrophone {
  public:
    NRF52ADCChannel *microphone;
    StreamNormalizer normalizer;
    TeeStream tee;
    LevelDetectorSPL level;
    WMicrophone()
        : microphone(uBit.adc.getChannel(uBit.io.microphone)),
          normalizer(microphone->output, 1.0f, true, DATASTREAM_FORMAT_UNKNOWN, 10),
          tee(allocateNotifyEvent(), normalizer.output),
          level(tee.output, 75.0, 60.0, 9, 52, DEVICE_ID_MICROPHONE) {
        uBit.io.runmic.setDigitalValue(1);
        uBit.io.runmic.setHighDrive(true);
        microphone->setGain(7, 0);
        DMESG("microphone: %d Hz", 1000000 / uBit.adc.getSamplePeriod());
    }
};
SINGLETON(WMicrophone);

codal::LevelDetectorSPL *getMicrophoneLevel() {
    auto wmic = getWMicrophone();
    return wmic ? &(wmic->level) : NULL;
}

} // namespace pxt

#endif

namespace microphone {

//%
int _readyEvent() {
#if MICROBIT_CODAL
    return getWMicrophone()->tee.evid;
#else
    target_panic(PANIC_VARIANT_NOT_SUPPORTED);
    return 0;
#endif
}

//%
Buffer _pull() {
#if MICROBIT_CODAL
    return getWMicrophone()->tee.pxtBuffer();
#else
    target_panic(PANIC_VARIANT_NOT_SUPPORTED);
    return nullptr;
#endif
}

} // namespace microphone

namespace input {

/**
 * (beta) Return microphone sampling period in microseconds.
 */
//%
int soundSamplingPeriod() {
#if MICROBIT_CODAL
    return uBit.adc.getSamplePeriod();
#else
    target_panic(PANIC_VARIANT_NOT_SUPPORTED);
    return 0;
#endif
}

/**
 * (beta) Set microphone sampling period in microseconds. Typical range 20-200.
 */
//%
void setSoundSamplingPeriod(int us) {
#if MICROBIT_CODAL
    if (us != uBit.adc.getSamplePeriod())
        uBit.adc.setSamplePeriod(us);
#else
    target_panic(PANIC_VARIANT_NOT_SUPPORTED);
#endif
}

} // namespace input
