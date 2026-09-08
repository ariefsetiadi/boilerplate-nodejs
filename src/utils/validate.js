const { ValidationError } = require('./errors');

async function validate(schema, data) {
  try {
    return await schema.validateAsync(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    if (error.isJoi) {
      const errors = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));

      throw new ValidationError('Validation failed', errors);
    }

    throw error;
  }
}

module.exports = validate;
