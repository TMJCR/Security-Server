module.exports = inventory = {
  sensors: [
    {
      name: "Sensor1",
      type: "sensor",
    },
    {
      name: "Sensor2",
      type: "sensor",
      range: 1.5,
      sensitivity: 80,
    },
  ],
  cameras: [
    {
      name: "Camera1",
      type: "camera",
    },
    {
      name: "Camera2",
      type: "camera",
    },
  ],
  doorSensors: [
    { name: "DoorSensor1", type: "doorSensor" },
    { name: "DoorSensor2", type: "doorSensor" },
  ],
  keypads: [{ name: "Keypad1", type: "keypad" }],
  alarms: [{ name: "Alarm1", type: "alarm" }],
};
