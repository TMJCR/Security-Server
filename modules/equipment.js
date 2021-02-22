class Equipment {
  constructor(name, id, type, status) {
    this.status = {
      name,
      id,
      type,
      status,
    };
  }

  reportStatus() {
    console.log(this.status);
    return this.status;
  }
}

class Sensor extends Equipment {
  constructor(name, id, type, status, range = 1, sensitivity = 50) {
    super(name, id, type, status);
    this.status = { ...this.status, configuration: { range, sensitivity } };
  }
}

module.exports = {
  Sensor,
};
