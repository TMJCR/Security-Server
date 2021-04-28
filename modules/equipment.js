const ActivityModel = require("../models/activityLog");
const SecuritySystem = require("./securitySystem");

class Equipment {
  constructor(name, type, id, zone, currentStatus = "Ready") {
    this.status = {
      name,
      type,
      id,
      zone,
      currentStatus,
    };
  }
  async logActivity(activity) {
    const newLog = new ActivityModel(activity);
    console.log(activity.log);
    await newLog.save();
    return true;
  }
  reportStatus() {
    return this.status;
  }
}

class Sensor extends Equipment {
  constructor(
    name,
    type,
    id,
    zone,
    currentStatus,
    range = 2,
    sensitivity = 50,
    connectedCamera = null
  ) {
    super(name, type, id, zone, currentStatus);
    const configuration = { configuration: { range, sensitivity } };
    this.status = { ...this.status, ...configuration, connectedCamera };
  }
  async updateSensorStatus(name, newState, message) {
    this.status.currentStatus = newState;
    await this.logActivity({ log: `${name} ${message}` });
    // Now activate camera and alarm
    if (this.status.currentStatus === "Alert") {
      return true;
    } else {
      return false;
    }
  }
}

class DoorSensor extends Equipment {
  constructor(name, type, id, zone, currentStatus, position) {
    super(name, type, id, zone, currentStatus);
    this.status = { ...this.status, position };
  }
  async updateSensorStatus(name, newState, message) {
    const newPosition = this.status.position === "Closed" ? "Open" : "Closed";
    this.status.position = newPosition;
    await this.logActivity({ log: `${name} ${message}` });
    if (this.status.position === "Open") {
      return true;
    }
    return false;
  }
}

class Camera extends Equipment {
  constructor(name, type, id, zone, currentStatus) {
    super(name, type, id, zone, currentStatus);
    this.status.lastRecording = null;
  }
  async storeFootage(timeOfTrigger) {
    const durationOfStoredFootageInSeconds = 60;
    const startOfStoredFootage = new Date(
      timeOfTrigger.getTime() - (durationOfStoredFootageInSeconds * 1000) / 2
    );

    const endOfStoredFootage = new Date(
      timeOfTrigger.getTime() + (durationOfStoredFootageInSeconds * 1000) / 2
    );
    await this.logActivity({
      log: `Footage from ${
        this.status.name
      } Stored: Start: ${startOfStoredFootage.toLocaleString()} - End: ${endOfStoredFootage.toLocaleTimeString()}`,
    });

    this.status.lastRecording = endOfStoredFootage;
  }
  updateCameraStatus = () => {
    this.status.currentStatus = "Recording";
  };
}

class Keypad extends Equipment {
  constructor(name, type, id, zone, currentStatus) {
    super(name, type, id, zone, currentStatus);
  }
  async checkKeypadEntry(enteredCode, securitySystemCode) {
    if (enteredCode.join() === securitySystemCode.join()) {
      await this.logActivity({
        log: `Code Entered Correctly, preparing to reset alarm system`,
      });
    } else {
      await this.logActivity({
        log: `Incorrect Code Entered`,
      });
    }
    return enteredCode.join() === securitySystemCode.join();
  }
}

class Alarm extends Equipment {
  constructor(name, type, id, zone, currentStatus) {
    super(name, type, id, zone, currentStatus);
  }
  async alert() {
    await this.logActivity({
      log: `ALERT ${this.status.name} has been triggered.`,
    });
  }
  updateAlarmStatus = () => {
    this.status.currentStatus = "Alert";
  };
  async resetAlarm() {
    this.status.currentStatus = "Ready";
    await this.logActivity({ log: `Resetting ${this.status.name}` });
    await this.logActivity({
      log: `Alarm reset process complete for ${this.status.name}`,
    });
  }
}
module.exports = {
  Sensor,
  Camera,
  DoorSensor,
  Keypad,
  Alarm,
};
