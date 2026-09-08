const customMessages = (field) => ({
  'any.required': `${field} is required`,
  'any.only': `${field} is not valid`,
  'string.base': `${field} can only text`,
  'string.empty': `${field} is required`,
  'string.min': `${field} min {#limit} characters`,
  'string.max': `${field} max {#limit} characters`,
  'string.email': `${field} can only valid email`,
  'string.pattern.base': `${field} format is not valid`,
  'any.unknown': `${field} is not allowed`,
});

module.exports = customMessages;
