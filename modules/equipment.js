const { v4: uuidv4 } = require("uuid");

class Equipment {
  constructor(name, type, id, currentStatus = "Ready") {
    this.status = {
      name,
      type,
      id,
      currentStatus,
    };
  }
  reportStatus() {
    // console.log(this.status);
    return this.status;
  }
}

class Sensor extends Equipment {
  constructor(name, type, id, currentStatus, range = 2, sensitivity = 50) {
    super(name, type, id, currentStatus);
    this.status = { ...this.status, configuration: { range, sensitivity } };
  }
  detectMovement(name, currentState) {
    this.status.currentStatus = currentState;
    return console.log(`Sensor named ${name} was Triggered`);
  }
}

class Camera extends Equipment {
  constructor(name, type, id, currentStatus) {
    super(name, type, id, currentStatus);
  }
}

class DoorSensor extends Equipment {
  constructor(name, type, id, currentStatus) {
    super(name, type, id, currentStatus);
  }
  detectOpenClose(name, currentState) {
    const openOrClosed =
      this.status.currentStatus === "Closed" ? "Open" : "Closed";
    this.status.currentStatus = openOrClosed;
    return console.log(`Sensor named ${name} was Triggered`);
  }
}

class Keypad extends Equipment {
  constructor(name, type, id, currentStatus) {
    super(name, type, id, currentStatus);
    this.passcode = "1234";
  }
  checkKeypadEntry(enteredCode) {
    console.log(enteredCode, this.passcode);
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
  alert() {
    console.log("Alarm Triggered");
  }
  resetAlarm() {
    this.status.currentStatus = "Ready";
  }
}
module.exports = {
  Sensor,
  Camera,
  DoorSensor,
  Keypad,
  Alarm,
};
