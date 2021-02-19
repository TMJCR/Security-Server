const Sensor = require("./modules/sensor");
const sensor = new Sensor("Sensor1", "#1234", "sensor", "inactive");

module.exports = class SecuritySystem {
  constructor() {
    this.status = {
      alarm: "Off",
      cameras: [
        { name: "Camera1", status: "Off" },
        { name: "Camera2", status: "Off" },
      ],
    };
  }
  bootUpSecuritySystem() {
    console.log("system is booting up");
    this.fetchAllSystemEquipment();
    this.statusReport();
  }
  fetchAllSystemEquipment() {
    sensor.reportStatus();
  }
  statusReport() {
    console.log(this.status);
  }
  updateState(item, state) {
    console.log(this.status, item, state);
  }
};

// const Keypad = require("./modules/keypad.js");
// const keypad = new Keypad("1234");
// const response = keypad.enterPasscode("1234");
// console.log(response);
