const { v4: uuidv4 } = require("uuid");

class Equipment {
  constructor(name, type, currentStatus = "inactive") {
    this.status = {
      name,
      type,
    };
  }

  reportStatus() {
    // console.log(this.status);
    return this.status;
  }
}

class Sensor extends Equipment {
  constructor(name, type, currentStatus, range = 2, sensitivity = 50) {
    super(name, type, currentStatus);
    this.status = { ...this.status, configuration: { range, sensitivity } };
  }
}

class Camera extends Equipment {
  constructor(name, type, range = 2, sensitivity = 50) {
    super(name, type);
  }
}

class DoorSensor extends Equipment {
  constructor(name, type) {
    super(name, type);
  }
}

class Keypad extends Equipment {
  constructor(name, type) {
    super(name, type);
  }
}

class Alarm extends Equipment {
  constructor(name, type) {
    super(name, type);
  }
}
module.exports = {
  Sensor,
  Camera,
  DoorSensor,
  Keypad,
  Alarm,
};
