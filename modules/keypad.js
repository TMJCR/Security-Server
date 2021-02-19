module.exports = class Keypad {
  constructor(passcode) {
    this.passcode = passcode;
  }
  enterPasscode(enteredPasscode) {
    const response =
      enteredPasscode === this.passcode
        ? "Passcode Accepted"
        : "Incorrect Passcode";
    return response;
  }
  resetAlarm(alarm) {
    alarm.reset();
  }
};
