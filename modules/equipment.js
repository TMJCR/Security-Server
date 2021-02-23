const { v4: uuidv4 } = require("uuid");

class Equipment {
  constructor(name, type) {
    this.status = {
      name,
      type,
      id: uuidv4(),
      currentStatus: "inactive",
    };
  }

  reportStatus() {
    // console.log(this.status);
    return this.status;
  }
}

class Sensor extends Equipment {
  constructor(name, type, range = 2, sensitivity = 50) {
    super(name, type);
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
