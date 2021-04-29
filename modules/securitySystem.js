const EquipmentModel = require("../models/equipment");

const { Sensor, Camera, DoorSensor, Keypad, Alarm } = require("./equipment");
const ActivityModel = require("../models/activityLog");
// Fetch all the previous activity
// Create a new log for each interaction
// Push it onto the log

module.exports = class SecuritySystem {
  constructor() {
    this.status = this.setDefaultStatus();
    this.setRestrictedZones();
    this.passcode = this.generatePasscode();
    this.interval = null;
    this.timer = null;
  }

  generatePasscode = () => {
    clearInterval(this.timer);
    this.status.testingMode.timeElapsed = 15;
    const newPasscode = Array.from([0, 0, 0, 0], (num) =>
      Math.floor(Math.random() * (8 - 1) + 1).toString()
    );
    this.passcode = newPasscode;

    if (this.status.alert) {
      this.startCountdown();
    }

    return newPasscode;
  };

  startCountdown = () => {
    this.timer = setInterval(() => {
      if (this.status.testingMode.timeElapsed > 0) {
        this.status.testingMode.timeElapsed -= 1;
      } else {
        this.status.testingMode.timeElapsed = 15;
      }
    }, 1000);
  };

  beginAutogeneratePasscode() {
    this.interval = setInterval(this.generatePasscode, 15000);
    this.generatePasscode();
  }

  setDefaultStatus() {
    return {
      zones: {
        zone1: { status: "Normal", camera: "Camera1", alarm: "Alarm1" },
        zone2: { status: "Normal", camera: "Camera2", alarm: "Alarm2" },
        zone3: { status: "Normal", camera: "Camera3", alarm: "Alarm3" },
        zone4: { status: "Normal", camera: "Camera4", alarm: "Alarm4" },
      },
      accessLevel: "NoAccess",
      alert: false,
      testingMode: { message: "", timeElapsed: 15 },
      cameraMessage: "Camera Ready",
    };
  }

  setRestrictedZones() {
    if (this.status.accessLevel === "Restricted") {
      this.status.restrictedZones = [1, 3];
      this.status.zones.zone1.status = "Normal";
      this.status.zones.zone2.status = "Unrestricted";
      this.status.zones.zone3.status = "Normal";
      this.status.zones.zone4.status = "Unrestricted";
    } else if (this.status.accessLevel === "FullAccess") {
      this.status.restrictedZones = [];
      this.status.zones.zone1.status = "Unrestricted";
      this.status.zones.zone2.status = "Unrestricted";
      this.status.zones.zone3.status = "Unrestricted";
      this.status.zones.zone4.status = "Unrestricted";
    } else {
      console.log(this.status.restrictedZones);
      this.status.restrictedZones = [1, 2, 3, 4];
      this.status.zones.zone1.status = "Normal";
      this.status.zones.zone2.status = "Normal";
      this.status.zones.zone3.status = "Normal";
      this.status.zones.zone4.status = "Normal";

      console.log(this.status.restrictedZones);
    }
  }

  changeAccessLevel(accessLevel) {
    this.status.accessLevel = accessLevel;
    this.setRestrictedZones();
  }

  async bootUpSecuritySystem() {
    await this.logActivity({ log: "System booting up..." });
    console.log("System booting up");
    await this.fetchAllSystemEquipment(this.status.accessLevel);
    await this.fetchActivityLog();
    return this.reportStatus();
  }

  async rebootSystem() {
    await this.logActivity({ log: "System resetting..." });
    console.log("System resetting...");
    clearInterval(this.interval);
    this.status = await this.setDefaultStatus();
    console.log("System rebooting...");
    this.setRestrictedZones();
    await this.logActivity({ log: "Setting Up Restricted Zones" });
    await this.logActivity({ log: "System re-booting" });
    return this.bootUpSecuritySystem();
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
        sensor.zone,
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
        camera.zone,
        "Ready"
      );
    });

    // // Register door sensors
    this.status.doorSensors = doorSensorList.map((doorSensor) => {
      return new DoorSensor(
        doorSensor.name,
        doorSensor.type,
        doorSensor._id,
        doorSensor.zone,
        "Ready",
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

  alertZone(zone) {
    zone.status = "Alert";
  }

  activateZoneCamera(zone) {
    const Camera = this.status.cameras.find(
      (camera) => camera.status.name === zone.camera
    );
    this.status.cameraMessage = `${zone.camera} recording...`;
    Camera.updateCameraStatus();
    const timeOfTrigger = new Date();
    Camera.storeFootage(timeOfTrigger);
  }

  async activateZoneAlarm(zone) {
    const Alarm = this.status.alarms.find(
      (alarm) => alarm.status.name === zone.alarm
    );
    await Alarm.updateAlarmStatus();
    Alarm.alert();
  }

  async triggerAlert(zone) {
    if (!this.status.alert) {
      clearInterval(this.interval);
      this.status.alert = true;
      this.beginAutogeneratePasscode();
    }
    await this.alertZone(zone);
    await this.activateZoneCamera(zone);
    await this.activateZoneAlarm(zone);
  }

  processSensorDetection = async (triggeredSensor) => {
    const correctSensorList =
      triggeredSensor.type === "DoorSensor" ? "doorSensors" : "sensors";

    const logMessage =
      correctSensorList === "doorSensors"
        ? "was breached"
        : "detected movement in restricted zone";

    try {
      const extractedSensor = await this.status[correctSensorList].find(
        (sensor) => sensor.status.name === triggeredSensor.name
      );

      const sensorZone = this.status.zones[
        `zone${extractedSensor.status.zone}`
      ];
      console.log(extractedSensor.status, sensorZone);
      const raiseAlert = await extractedSensor.updateSensorStatus(
        triggeredSensor.name,
        triggeredSensor.currentState,
        logMessage
      );

      if (raiseAlert) {
        this.triggerAlert(sensorZone);
      }
    } catch (error) {
      console.log(error);
    }
  };

  reportStatus() {
    if (this.status.alert) {
      this.status.testingMode.message = this.passcode;
    }
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
