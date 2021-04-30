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
  async logActivity(log) {
    const { activity, type } = log;
    const newLog = new ActivityModel({ log: activity, type });
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
  async updateSensorStatus(name, newState, message, type) {
    this.status.currentStatus = newState;
    await this.logActivity({
      activity: `${name} ${message}`,
      type,
    });
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
  async updateSensorStatus(name, newState, message, type) {
    const newPosition = this.status.position === "Closed" ? "Open" : "Closed";
    this.status.position = newPosition;
    await this.logActivity({
      activity: `Alert: ${name} ${message}`,
      type,
    });
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
      activity: `Footage from ${
        this.status.name
      } Stored: Start: ${startOfStoredFootage.toLocaleString()} - End: ${endOfStoredFootage.toLocaleTimeString()}`,
      type: "Success",
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
        activity: `Code Entered Correctly, preparing to reset alarm system`,
        type: "Success",
      });
    } else {
      await this.logActivity({
        activity: `ALERT: Incorrect Code Entered`,
        type: "Alert",
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
      activity: `ALERT: ${this.status.name} has been triggered.`,
      type: "Alert",
    });
  }
  updateAlarmStatus = () => {
    this.status.currentStatus = "Alert";
  };
  async resetAlarm() {
    this.status.currentStatus = "Ready";
    await this.logActivity({
      activity: `Resetting ${this.status.name}`,
      type: "Warning",
    });

    await this.logActivity({
      activity: `Alarm reset process complete for ${this.status.name}`,
      type: "Success",
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
