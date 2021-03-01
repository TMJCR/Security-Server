const SensorModel = require("./models/sensor");

const {
  Sensor,
  Camera,
  DoorSensor,
  Keypad,
  Alarm,
} = require("./modules/equipment");
// const inventory = require("./modules/inventory");

module.exports = class SecuritySystem {
  constructor() {
    this.status = {};
    this.alarm = "OFF";
  }
  async bootUpSecuritySystem() {
    console.log("system is booting up");
    await this.fetchAllSystemEquipment();
    this.reportStatus();
  }

  async fetchEquipmentByType(type) {
    let equipmentList;
    try {
      switch (type) {
        case "Sensor":
          equipmentList = await SensorModel.find();
          break;
        case "Camera":
          equipmentList = await SensorModel.find();
          break;
      }
      return equipmentList;
    } catch (error) {
      console.log(error);
    }
  }
  async fetchAllSystemEquipment() {
    // const { sensors, cameras, doorSensors, keypads, alarms } = inventory;
    const sensorList = await this.fetchEquipmentByType("Sensor");
    console.log("SENSEOR LIST =", sensorList);
    // Register sensors
    this.status.sensors = sensorList.map((sensor) => {
      return new Sensor(
        sensor.name,
        sensor.type,
        sensor.currentStatus,
        sensor.range,
        sensor.sensitivity
      );
    });
    console.log(this.status.sensors);
    // Register cameras
    // this.status.cameras = cameras.map((camera) => {
    //   return new Camera(camera.name, camera.type);
    // });

    // // Register door sensors
    // this.status.doorSensors = doorSensors.map((doorSensor) => {
    //   return new DoorSensor(doorSensor.name, doorSensor.type);
    // });

    // // Register keypads
    // this.status.keypads = keypads.map((keypad) => {
    //   return new Keypad(keypad.name, keypad.type);
    // });

    // // Register alarms
    // this.status.alarms = alarms.map((alarm) => {
    //   return new Alarm(alarm.name, alarm.type);
    // });
  }
  reportStatus() {
    return this.status;
  }

  update(item, state) {
    console.log(item);
    this.status.keypads[0].currentStatus = item;
  }
};
