const capitalizeWords = (text) => {
  return text.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

const lowerCase = (text) => text.toLowerCase();

const upperCase = (text) => text.toUpperCase();

module.exports = {
  capitalizeWords,
  lowerCase,
  upperCase,
};
