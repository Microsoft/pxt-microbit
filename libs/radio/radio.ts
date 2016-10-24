/**
 * Communicate data using radio packets
 */
//% color=#E3008C weight=34
namespace radio {
    export class Packet {
        /**
         * The number payload if a number was sent in this packet (via ``sendNumber()`` or ``sendValue()``)
         * or 0 if this packet did not contain a number.
         */
        public receivedNumber: number;
        /**
         * The string payload if a string was sent in this packet (via ``sendString()`` or ``sendValue()``)
         * or the empty string if this packet did not contain a string.
         */
        public text: string;
        /**
         * The system time of the sender of the packet at the time the packet was sent.
         */
        public time: number;
        /**
         * The serial number of the sender of the packet or 0 if the sender did not sent their serial number.
         */
        public serial: number;
        /**
         * The received signal strength indicator (RSSI) of the packet.
         */
        public signal: number;
    }

    /**
     * Registers code to run when the radio receives a packet. Also takes the
     * received packet from the radio queue.
     */
    //% help=radio/on-data-packet-received
    //% mutate=true
    //% mutateText=Packet
    //% mutateDefaults="receivedNumber;text,receivedNumber;text"
    //% blockId=radio_on_packet block="on radio received" blockGap=8
    export function onDataPacketReceived(cb: (packet: Packet) => void) {
        onDataReceived(() => {
            receiveNumber();
            const packet = new Packet();
            packet.receivedNumber = receivedNumber();
            packet.time = receivedTime();
            packet.serial = receivedSerial();
            packet.text = receivedString();
            packet.signal = receivedSignalStrength();
            cb(packet)
        });
    }
}
