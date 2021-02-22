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

module.exports = {
  Sensor,
};
