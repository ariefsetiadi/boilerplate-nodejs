const moment = require("moment");

const createValidation = async (data) => {
  const errors = [];

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

  if (typeof data.isAdmin !== "boolean") {
    errors.push("isAdmin not valid");
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

const updateValidation = async (data) => {
  const errors = [];

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

  if (typeof data.isAdmin !== "boolean") {
    errors.push("isAdmin not valid");
  }

  if (data.email === null || data.email === "" || data.email.trim() === "") {
    errors.push("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.push("Email not valid");
  }

  return errors;
};

const resetPasswordValidation = async (data) => {
  const errors = [];

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

module.exports = {
  createValidation,
  updateValidation,
  resetPasswordValidation,
};
