module.exports = class Sensor {
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
  }
};
