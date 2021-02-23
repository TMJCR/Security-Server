const {
  Sensor,
  Camera,
  DoorSensor,
  Keypad,
  Alarm,
} = require("./modules/equipment");
const inventory = require("./modules/inventory");

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
    const { sensors, cameras, doorSensors, keypads, alarms } = inventory;

    // Register sensors
    this.status.sensors = sensors.map((sensor) => {
      return new Sensor(
        sensor.name,
        sensor.type,
        sensor.range,
        sensor.currentStatus,
        sensor.sensitivity
      );
    });

    // Register cameras
    this.status.cameras = cameras.map((camera) => {
      return new Camera(camera.name, camera.type);
    });

    // Register door sensors
    this.status.doorSensors = doorSensors.map((doorSensor) => {
      return new DoorSensor(doorSensor.name, doorSensor.type);
    });

    // Register keypads
    this.status.keypads = keypads.map((keypad) => {
      return new Keypad(keypad.name, keypad.type);
    });

    // Register alarms
    this.status.alarms = alarms.map((alarm) => {
      return new Alarm(alarm.name, alarm.type);
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
