import { Gpio } from "onoff";
import WebSocket from "ws";

interface MockableGpio {
  writeSync: (_: number) => null;
}

let writeGpioTimeout: NodeJS.Timeout;

const writablePins = [7, 8, 9, 10];
const pins = new Map();

if (Gpio.accessible) {
  console.log("GPIO is accessisble");
  writablePins.forEach((pinNo) => {
    pins.set(pinNo, new Gpio(pinNo, "out"));
  });
} else {
  console.log("GPIO is not accessisble. Mocking pins");
  writablePins.forEach((pinNo) => {
    pins.set(pinNo, {
      writeSync: (val: number) => {
        console.log(`Setting pin ${pinNo} to ${val}`);
      },
    });
  });
}

pins.forEach((gpio) => gpio.writeSync(0));

export const ioMessageHandler = (data: WebSocket.Data) => {
  const dataString: string = data.toString();
  if (dataString.startsWith("{")) {
    const json = JSON.parse(dataString);
    console.log("JSON is: ", json);

    if (json.writeGpio) {
      if (writeGpioTimeout) {
        clearTimeout(writeGpioTimeout);
      }

      json.writeGpio.forEach((jsonPinGpio: any) => {
        const pinNo = jsonPinGpio.pin;
        const pinVal = jsonPinGpio.value;

        if (pins.has(pinNo)) {
          const gpio = pins.get(pinNo);
          gpio.writeSync(pinVal);
          console.log("Pin " + pinNo + " set to " + pinVal);
        } else {
          console.log("Pin not found: ", pinNo);
        }
      });

      writeGpioTimeout = setTimeout(() => {
        pins.forEach((gpio) => gpio.writeSync(0));
      }, 1000);
    }
  }
};

process.on("SIGINT", (_) => {
  if (Gpio.accessible) {
    pins.forEach((gpio) => gpio.unexport(0));
  }
});
