const { Sensor } = require("./modules/equipment");
const inventory = require("./modules/inventory");

// console.log(inventory.cameras, "test");
module.exports = class SecuritySystem {
  constructor() {
    this.status = { sensors: [], cameras: [] };
  }
  bootUpSecuritySystem() {
    console.log("system is booting up");
    const test = this.fetchAllSystemEquipment();
    return test;
  }
  registerEquipment(equipmentList, equipmentType) {
    const registeredList = equipmentList.map((item) => {
      if (equipmentType === "sensor") {
        return new Sensor("test", "sensor");
      } else if (equipmentType === "camera") {
        return new Camera(Object.values(item));
      }
    });
    console.log("registered", registeredList);
  }

  fetchAllSystemEquipment() {
    const { sensors, cameras } = inventory;
    const sensorList = sensors.map((sensor) => {
      return new Sensor(
        sensor.name,
        sensor.type,
        sensor.range,
        sensor.currentStatus,
        sensor.sensitivity
      );
    });
    this.registerEquipment(sensors, "sensor");
    this.status.sensors = sensorList;
    // console.log(sensorList);
    // Fetch all the objects from the database, fetch cameras, sensors, door sensors, alarm and keypad seperately. Update the status.
  }
  reportStatus() {
    // console.log(this.status);
    return this.status;
  }
  updateState(item, state) {
    // console.log(this.status, item, state);
  }
};

// Set up the post requests that

// const Keypad = require("./modules/keypad.js");
// const keypad = new Keypad("1234");
// const response = keypad.enterPasscode("1234");
// console.log(response);
