const EquipmentModel = require("./models/equipment");

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
  }
  async bootUpSecuritySystem() {
    console.log("System booting up");
    await this.fetchAllSystemEquipment();
    this.reportStatus();
  }

  async rebootSystem() {
    console.log("System resetting...");
    this.status = {};
    console.log("System rebooting...");
    this.bootUpSecuritySystem();
  }

  async fetchAllSystemEquipment() {
    const equipmentList = await EquipmentModel.find();
    const sensorList = equipmentList.filter((item) => item.type === "Sensor");
    const cameraList = equipmentList.filter((item) => item.type === "Camera");
    const doorSensorList = equipmentList.filter(
      (item) => item.type === "DoorSensor"
    );
    const keypadList = equipmentList.filter((item) => item.type === "Keypad");
    const alarmList = equipmentList.filter((item) => item.type === "Alarm");

    // Register sensors
    const sensors = sensorList.map((sensor) => {
      return new Sensor(
        sensor.name,
        sensor.type,
        sensor._id,
        sensor.currentStatus,
        sensor.configuration.range,
        sensor.configuration.sensitivity,
        sensor.connectedCamera
      );
    });

    this.status.sensors = sensors;

    // Register cameras
    this.status.cameras = cameraList.map((camera) => {
      return new Camera(camera.name, camera.type, camera._id, "Recording");
    });

    // // Register door sensors
    this.status.doorSensors = doorSensorList.map((doorSensor) => {
      return new DoorSensor(
        doorSensor.name,
        doorSensor.type,
        doorSensor._id,
        "Closed"
      );
    });

    // // Register keypads
    this.status.keypads = keypadList.map((keypad) => {
      return new Keypad(keypad.name, keypad.type, keypad._id);
    });

    // // Register alarms
    this.status.alarms = alarmList.map((alarm) => {
      return new Alarm(alarm.name, alarm.type, alarm._id);
    });
  }
  reportStatus() {
    return this.status;
  }

  update(item, state) {
    console.log(item);
    this.status.keypads[0].currentStatus = item;
  }
};
