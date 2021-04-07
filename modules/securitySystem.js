const EquipmentModel = require("../models/equipment");

const { Sensor, Camera, DoorSensor, Keypad, Alarm } = require("./equipment");
const ActivityModel = require("../models/activityLog");
// Fetch all the previous activity
// Create a new log for each interaction
// Push it onto the log

module.exports = class SecuritySystem {
  constructor() {
    this.status = {
      zones: {
        zone1: { status: "Normal" },
        zone2: { status: "Normal" },
        zone3: { status: "Normal" },
        zone4: { status: "Normal" },
      },
      accessLevel: "NoAccess",
    };
    if (this.status.accessLevel === "NoAccess") {
      this.status.restrictedZones = [1, 2, 3, 4];
    } else if (this.status.accessLevel === "Restricted") {
      this.status.restrictedZones = [1, 3];
    } else {
      this.status.restrictedZones = [];
    }
  }

  changeAccessLevel() {}

  async bootUpSecuritySystem() {
    await this.logActivity({ log: "System booting up..." });
    console.log("System booting up");
    await this.fetchAllSystemEquipment(this.status.accessLevel);
    await this.fetchActivityLog();
    this.reportStatus();
  }

  async rebootSystem() {
    await this.logActivity({ log: "System resetting..." });
    console.log("System resetting...");
    this.status = {};
    console.log("System rebooting...");
    await this.logActivity({ log: "System re-booting" });
    this.bootUpSecuritySystem();
  }

  async fetchActivityLog() {
    const log = await ActivityModel.find();
    this.status.activityLog = log;
    return this.status.activityLog;
  }

  async fetchAllSystemEquipment(accessLevel) {
    await this.logActivity({ log: "Registering equipment" });
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
        sensor.zone || 1,
        sensor.currentStatus,
        sensor.configuration.range,
        sensor.configuration.sensitivity,
        sensor.connectedCamera
      );
    });

    this.status.sensors = sensors;

    // Register cameras
    this.status.cameras = cameraList.map((camera) => {
      return new Camera(
        camera.name,
        camera.type,
        camera._id,
        camera.zone || 1,
        "Recording"
      );
    });

    // // Register door sensors
    this.status.doorSensors = doorSensorList.map((doorSensor) => {
      return new DoorSensor(
        doorSensor.name,
        doorSensor.type,
        doorSensor._id,
        doorSensor.zone || 1,
        "Closed"
      );
    });

    // // Register keypads
    this.status.keypads = keypadList.map((keypad) => {
      return new Keypad(keypad.name, keypad.type, keypad._id, keypad.zone || 1);
    });

    // // Register alarms
    this.status.alarms = alarmList.map((alarm) => {
      return new Alarm(alarm.name, alarm.type, alarm._id, alarm.zone || 1);
    });

    await this.logActivity({ log: "Equipment registration process complete" });
  }
  reportStatus() {
    return this.status;
  }

  logActivity(activity) {
    const newLog = new ActivityModel(activity);
    console.log(activity.log);
    newLog.save();
  }

  // update(item, state) {
  //   console.log(item);
  //   this.status.keypads[0].currentStatus = item;
  // }
};
