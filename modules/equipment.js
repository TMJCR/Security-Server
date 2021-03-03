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

  updateCurrentStatus(newStatus) {
    this.status.currentStatus === "newStatus";
  }
}

class Sensor extends Equipment {
  constructor(name, type, currentStatus, range = 2, sensitivity = 50) {
    super(name, type, currentStatus);
    this.status = { ...this.status, configuration: { range, sensitivity } };
  }
  detectMovement(name, currentState) {
    this.status.currentStatus = currentState;
    console.log(`Sensor named ${name} was Triggered`);
  }
}

class Camera extends Equipment {
  constructor(name, type, currentStatus) {
    super(name, type, currentStatus);
  }
}

class DoorSensor extends Equipment {
  constructor(name, type, currentStatus) {
    super(name, type, currentStatus);
  }
}

class Keypad extends Equipment {
  constructor(name, type, currentStatus) {
    super(name, type, currentStatus);
  }
}

class Alarm extends Equipment {
  constructor(name, type, currentStatus) {
    super(name, type, currentStatus);
  }
  alert() {
    console.log("Alarm Triggered");
  }
}
module.exports = {
  Sensor,
  Camera,
  DoorSensor,
  Keypad,
  Alarm,
};
