const ActivityModel = require("../models/activityLog");

class Equipment {
  constructor(name, type, id, currentStatus = "Ready") {
    this.status = {
      name,
      type,
      id,
      currentStatus,
    };
  }
  logActivity(activity) {
    const newLog = new ActivityModel(activity);
    console.log(activity.log);
    newLog.save();
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
    currentStatus,
    range = 2,
    sensitivity = 50,
    connectedCamera = null
  ) {
    super(name, type, id, currentStatus);
    const configuration = { configuration: { range, sensitivity } };
    this.status = { ...this.status, ...configuration, connectedCamera };
  }
  async detectionMethod(name, currentState) {
    this.status.currentStatus = currentState;
    await this.logActivity({ log: `${name} was Triggered` });

    //  Check if this should trigger Alarm
    return true;
  }
}

class DoorSensor extends Equipment {
  constructor(name, type, id, currentStatus) {
    super(name, type, id, currentStatus);
  }
  async detectionMethod(name, currentState) {
    const openOrClosed =
      this.status.currentStatus === "Closed" ? "Open" : "Closed";
    this.status.currentStatus = openOrClosed;
    await this.logActivity({ log: `${name} was Triggered` });
    return true;
  }
}

class Camera extends Equipment {
  constructor(name, type, id, currentStatus) {
    super(name, type, id, currentStatus);
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
      log: `Camera Footage Stored: Start: ${startOfStoredFootage.toLocaleString()} - End: ${endOfStoredFootage.toLocaleTimeString()}`,
    });

    this.status.lastRecording = endOfStoredFootage;
  }
}

class Keypad extends Equipment {
  constructor(name, type, id, currentStatus) {
    super(name, type, id, currentStatus);
    this.passcode = "1234";
  }
  async checkKeypadEntry(enteredCode) {
    console.log(enteredCode, this.passcode);
    if (enteredCode === this.passcode) {
      await this.logActivity({
        log: `Code Entered Correctly, preparing to reset alarm system`,
      });
    } else {
      await this.logActivity({
        log: `Incorrect Code Entered`,
      });
    }
    return enteredCode === this.passcode;
  }
  updatePasscode(newPasscode) {
    this.passcode = newPasscode;
  }
}

class Alarm extends Equipment {
  constructor(name, type, id, currentStatus) {
    super(name, type, id, currentStatus);
  }
  async alert() {
    await this.logActivity({
      log: `ALERT ${this.status.name} has been triggered.`,
    });
  }
  async resetAlarm() {
    await this.logActivity({ log: `Resetting ${this.status.name}` });
    this.status.currentStatus = "Ready";
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
