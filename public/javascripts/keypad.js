module.exports = class Keypad {
  constructor(passcode) {
    this.passcode = passcode;
  }
  login() {
    const response =
      this.passcode === "1234" ? "Code Matches" : "Incorrect Code";
    return response;
  }
};
