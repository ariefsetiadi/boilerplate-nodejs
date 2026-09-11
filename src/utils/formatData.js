const capitalizeWords = (text) => {
  return text.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

const lowerCase = (text) => text.toLowerCase();

const upperCase = (text) => text.toUpperCase();

const formatUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  placeBirth: user.placeBirth,
  dateBirth: user.dateBirth,
  gender: user.gender,
  email: user.email,
  status: user.status,
});

module.exports = {
  capitalizeWords,
  lowerCase,
  upperCase,
  formatUser,
};
