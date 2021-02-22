const { Sensor } = require("./modules/equipment");
const inventory = require("./modules/inventory");
const sensor = new Sensor("Sensor1", "#1234", "sensor", "inactive");

console.log(inventory.cameras, "test");
module.exports = class SecuritySystem {
  constructor() {
    this.status = {};
  }
  bootUpSecuritySystem() {
    console.log("system is booting up");
    this.fetchAllSystemEquipment();
    this.reportStatus();
  }
  fetchAllSystemEquipment() {
    const { sensors, cameras } = inventory;
    sensors.map((sensor) => {
      console.log("t", sensor);
    });
    // Fetch all the objects from the database, fetch cameras, sensors, door sensors, alarm and keypad seperately. Update the status.
    this.status = sensor.reportStatus();
  }
  reportStatus() {
    console.log(this.status);
    return this.status;
  }
  updateState(item, state) {
    console.log(this.status, item, state);
  }
};

// Set up the post requests that

// const Keypad = require("./modules/keypad.js");
// const keypad = new Keypad("1234");
// const response = keypad.enterPasscode("1234");
// console.log(response);
