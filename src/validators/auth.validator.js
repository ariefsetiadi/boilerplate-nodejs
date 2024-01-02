const moment = require("moment");

const User = require("../models/user.model");

const registerValidation = async (data) => {
  const errors = [];

  const users = await User.findAll();

  // Check users is empty or not
  if (users.length) {
    errors.push("User is not empty, please add user from menu user");
  }

  if (
    data.fullname === null ||
    data.fullname === "" ||
    data.fullname.trim() === ""
  ) {
    errors.push("Fullname is required");
  }

  if (
    data.placeBirth === null ||
    data.placeBirth === "" ||
    data.placeBirth.trim() === ""
  ) {
    errors.push("Place Birth is required");
  }

  if (
    data.dateBirth === null ||
    data.dateBirth === "" ||
    data.dateBirth.trim() === ""
  ) {
    errors.push("Date Birth is required");
  }

  const format = "YYYY-MM-DD";
  const valid = moment(data.dateBirth, format, true).isValid();

  if (!valid) {
    errors.push("Date Birth not valid");
  }

  if (typeof data.gender !== "boolean") {
    errors.push("Gender not valid");
  }

  if (data.email === null || data.email === "" || data.email.trim() === "") {
    errors.push("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.push("Email not valid");
  }

  if (
    data.password === null ||
    data.password === "" ||
    data.password.trim() === ""
  ) {
    errors.push("Password is required");
  }

  if (data.password && data.password.length < 6) {
    errors.push("Password min 6 characters");
  }

  return errors;
};

const loginValidation = async (data) => {
  const errors = [];

  if (data.email === null || data.email === "" || data.email.trim() === "") {
    errors.push("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.push("Email not valid");
  }

  if (
    data.password === null ||
    data.password === "" ||
    data.password.trim() === ""
  ) {
    errors.push("Password is required");
  }

  return errors;
};

module.exports = { registerValidation, loginValidation };
