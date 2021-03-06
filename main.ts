/** 
 * @file pxt-maqueen/maqueen.ts
 * @brief DFRobot's maqueen makecode library.
 * @n [Get the module here](https://www.dfrobot.com.cn/goods-1802.html)
 * @n This is a MakeCode graphical programming education robot.
 * 
 * @copyright    [DFRobot](http://www.dfrobot.com), 2016
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](jie.tang@dfrobot.com)
 * @date  2019-10-08
*/

let maqueencb: Action
let maqueenmycb: Action
let maqueene = "1"
let maqueenparam = 0
let alreadyInit = 0
let IrPressEvent = 0
const MOTER_ADDRESSS = 0x10

enum PingUnit {
    //% block="cm"
    Centimeters,
}
enum state {
    state1 = 0x10,
    state2 = 0x11,
    state3 = 0x20,
    state4 = 0x21
}
interface KV {
    key: state;
    action: Action;
}

//% color=#f44242 icon="\uf1b9" block="cobit-mq"
namespace cobit_mq {

    let kbCallback: KV[] = []

    export class Packeta {
        public mye: string;
        public myparam: number;
    }

    export enum Motors {
        //% blockId="left motor" block="left"
        M1 = 0,
        //% blockId="right motor" block="right"
        M2 = 1,
        //% blockId="all motor" block="all"
        All = 2
    }

    export enum Servos {
        //% blockId="S1" block="서보1번"
        S1 = 0,
        //% blockId="S2" block="서보2번"
        S2 = 1
    }

    export enum Dir {
        //% blockId="CW" block="Forward"
        CW = 0x0,
        //% blockId="CCW" block="Backward"
        CCW = 0x1
    }

    export enum Patrol {
        //% blockId="patrolLeft" block="왼쪽"
        PatrolLeft = 13,
        //% blockId="patrolRight" block="오른쪽"
        PatrolRight = 14
    }

    export enum Patrol1 {
        //% blockId="patrolLeft" block="왼쪽"
        PatrolLeft = 0x10,
        //% blockId="patrolRight" block="오른쪽"
        PatrolRight = 0x20
    }
    export enum Voltage {
        //%block="높음(high)"
        High = 0x01,
        //% block="낮음(low)"
        Low = 0x00
    }

    export enum LED {
        //% blockId="LEDLeft" block="왼쪽"
        LEDLeft = 8,
        //% blockId="LEDRight" block="오른쪽"
        LEDRight = 12
    }

    export enum LEDswitch {
        //% blockId="turnOn" block="켜기"
        turnOn = 0x01,
        //% blockId="turnOff" block="끄기"
        turnOff = 0x00
    }

    //% advanced=true shim=maqueenIR::getParam
    function getParam(): number {
        return 0
    }

    function maqueenInit(): void {
        if (alreadyInit == 1) {
            return
        }
        alreadyInit = 1
    }

    /**
     * Read ultrasonic sensor.
     */

    //% blockId=ultrasonic_sensor block="초음파 센서 읽기 |%unit "
    //% weight=95
    export function Ultrasonic(unit: PingUnit, maxCmDistance = 500): number {
        let d
        pins.digitalWritePin(DigitalPin.P1, 0);
        if (pins.digitalReadPin(DigitalPin.P2) == 0) {
            pins.digitalWritePin(DigitalPin.P1, 1);
            pins.digitalWritePin(DigitalPin.P1, 0);
            d = pins.pulseIn(DigitalPin.P2, PulseValue.High, maxCmDistance * 58);
        } else {
            pins.digitalWritePin(DigitalPin.P1, 0);
            pins.digitalWritePin(DigitalPin.P1, 1);
            d = pins.pulseIn(DigitalPin.P2, PulseValue.Low, maxCmDistance * 58);
        }
        let x = d / 39;
        if (x <= 0 || x > 500) {
            return 0;
        }
        switch (unit) {
            case PingUnit.Centimeters: return Math.round(x);
            default: return Math.idiv(d, 2.54);
        }

    }

    /**
     * Go forward cobit-mq.
     */

    //% weight=90
    //% blockId=motor_MotorForward block="모터 앞으로 가기 |%speed 속도"
    //% speed.min=0 speed.max=255
    export function motorForward(speed: number): void {
        let buf = pins.createBuffer(3);

        buf[0] = 0x00;
        buf[1] = 0;
        buf[2] = 0;
        pins.i2cWriteBuffer(0x10, buf);
        buf[0] = 0x02;
        pins.i2cWriteBuffer(0x10, buf);

        buf[0] = 0x00;
        buf[1] = Dir.CW;
        buf[2] = speed;
        pins.i2cWriteBuffer(0x10, buf);
        buf[0] = 0x02;
        pins.i2cWriteBuffer(0x10, buf);
    }

    /**
     * Go backward cobit-mq
     */

    //% weight=90
    //% blockId=motor_MotorBackward block="모터 뒤로 가기 |%speed 속도"
    //% speed.min=0 speed.max=255
    export function motorBackward(speed: number): void {
        let buf = pins.createBuffer(3);

        buf[0] = 0x00;
        buf[1] = 0;
        buf[2] = 0;
        pins.i2cWriteBuffer(0x10, buf);
        buf[0] = 0x02;
        pins.i2cWriteBuffer(0x10, buf);

        buf[0] = 0x00;
        buf[1] = Dir.CCW;
        buf[2] = speed;
        pins.i2cWriteBuffer(0x10, buf);
        buf[0] = 0x02;
        pins.i2cWriteBuffer(0x10, buf);
    }

    /**
     * Go backward cobit-mq
     */

    //% weight=90
    //% blockId=motor_MotorTurnLeft block="모터 왼쪽으로 회전하기 |%speed 속도"
    //% speed.min=0 speed.max=255
    export function motorTurnLeft(speed: number): void {
        let buf = pins.createBuffer(3);

        buf[0] = 0x00;
        buf[1] = 0;
        buf[2] = 0;
        pins.i2cWriteBuffer(0x10, buf);
        buf[0] = 0x02;
        pins.i2cWriteBuffer(0x10, buf);

        buf[0] = 0x02;
        buf[1] = Dir.CW;
        buf[2] = speed;
        pins.i2cWriteBuffer(0x10, buf);
    }

    /**
     * Go backward cobit-mq
     */

    //% weight=90
    //% blockId=motor_MotorTurnRight block="모터 오른쪽으로 회전하기 |%speed 속도"
    //% speed.min=0 speed.max=255
    export function motorTurnRight(speed: number): void {
        let buf = pins.createBuffer(3);

        buf[0] = 0x00;
        buf[1] = 0;
        buf[2] = 0;
        pins.i2cWriteBuffer(0x10, buf);
        buf[0] = 0x02;
        pins.i2cWriteBuffer(0x10, buf);

        buf[0] = 0x00;
        buf[1] = Dir.CW;
        buf[2] = speed;
        pins.i2cWriteBuffer(0x10, buf);
    }

    /**
     * Stop cobit-mq.
     */
    //% weight=20
    //% blockId=motor_motorStop block="모터 멈추기"
    export function motorStop(): void {
        let buf = pins.createBuffer(3);
        buf[0] = 0x00;
        buf[1] = 0;
        buf[2] = 0;
        pins.i2cWriteBuffer(0x10, buf);
        buf[0] = 0x02;
        pins.i2cWriteBuffer(0x10, buf);
    }

    /**
     * Read line tracking sensor.
     */

    //% weight=20
    //% blockId=read_Patrol block="라인센서 |%patrol|쪽 센서 읽기"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function readPatrol(patrol: Patrol): number {
        if (patrol == Patrol.PatrolLeft) {
            return pins.digitalReadPin(DigitalPin.P13)
        } else if (patrol == Patrol.PatrolRight) {
            return pins.digitalReadPin(DigitalPin.P14)
        } else {
            return -1
        }
    }

    /**
     * Turn on/off the LEDs.
     */

    //% weight=20
    //% blockId=writeLED block="LED |%led|을 |%ledswitch"
    //% led.fieldEditor="gridpicker" led.fieldOptions.columns=2 
    //% ledswitch.fieldEditor="gridpicker" ledswitch.fieldOptions.columns=2
    export function writeLED(led: LED, ledswitch: LEDswitch): void {
        if (led == LED.LEDLeft) {
            pins.digitalWritePin(DigitalPin.P8, ledswitch)
        } else if (led == LED.LEDRight) {
            pins.digitalWritePin(DigitalPin.P12, ledswitch)
        } else {
            return
        }
    }

    /**
     * Set the Maqueen servos.
     */

    //% weight=90
    //% blockId=servo_ServoRun block="서보모터 |%index|를 |%angle|도로 회전하기"
    //% angle.min=0 angle.max=180
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function servoRun(index: Servos, angle: number): void {
        let buf = pins.createBuffer(2);
        if (index == 0) {
            buf[0] = 0x14;
        }
        if (index == 1) {
            buf[0] = 0x15;
        }
        buf[1] = angle;
        pins.i2cWriteBuffer(0x10, buf);
    }

    /**
    * Line tracking sensor event function
    */
    //% weight=2
    //% blockId=kb_LtEvent block="라인센서 |%value 센서 출력이 |%vi 이면"
    export function ltEvent(value: Patrol1, vi: Voltage, a: Action) {
        let state = value + vi;
        serial.writeNumber(state)
        let item: KV = { key: state, action: a };
        kbCallback.push(item);
    }
    let x: number
    let i: number = 1;
    function patorlState(): number {
        switch (i) {
            case 1: x = pins.digitalReadPin(DigitalPin.P13) == 0 ? 0x10 : 0; break;
            case 2: x = pins.digitalReadPin(DigitalPin.P13) == 1 ? 0x11 : 0; break;
            case 3: x = pins.digitalReadPin(DigitalPin.P14) == 0 ? 0x20 : 0; break;
            default: x = pins.digitalReadPin(DigitalPin.P14) == 1 ? 0x21 : 0; break;
        }
        i += 1;
        if (i == 5) i = 1;

        return x;
    }

    basic.forever(() => {
        if (kbCallback != null) {
            let sta = patorlState();
            if (sta != 0) {
                for (let item of kbCallback) {
                    if (item.key == sta) {
                        item.action();
                    }
                }
            }
        }
        basic.pause(50);
    })

}