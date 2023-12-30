import moment from "moment";

export const registerValidation = (data) => {
  const errors = [];

  if (!data.fullname || data.fullname.trim() === "") {
    errors.push("Fullname is required");
  }

  if (!data.placeBirth || data.placeBirth.trim() === "") {
    errors.push("Place Birth is required");
  }

  if (!data.dateBirth || data.dateBirth.trim() === "") {
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

  if (!data.email || data.email.trim() === "") {
    errors.push("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.push("Email not valid");
  }

  if (!data.password || data.password.trim() === "") {
    errors.push("Password is required");
  }

  if (data.password.length < 6) {
    errors.push("Password min 6 characters");
  }

  return errors;
};

export const loginValidation = (data) => {
  const errors = [];

  if (!data.email || data.email.trim() === "") {
    errors.push("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.push("Email not valid");
  }

  if (!data.password || data.password.trim() === "") {
    errors.push("Password is required");
  }

  return errors;
};
