const Joi = require('joi');
const { forCreateOrUpdate } = require('../../utils/schemaHelper');
const customMessages = require('../../utils/customMessages');
const { getFieldLabel } = require('../../utils/fieldLabels');

const baseUserSchema = Joi.object({
  fullName: Joi.string().min(3).max(150).required().messages(customMessages(getFieldLabel('fullName'))),
  placeBirth: Joi.string().min(3).max(100).messages(customMessages(getFieldLabel('placeBirth'))),
  dateBirth: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).messages(customMessages(getFieldLabel('dateBirth'))),
  gender: Joi.valid('0', '1').required().messages(customMessages(getFieldLabel('gender'))),
  email: Joi.string().max(100).email().required().messages(customMessages(getFieldLabel('email'))),
  password: Joi.string().min(6).required().messages(customMessages(getFieldLabel('password'))),
  status: Joi.required().valid('0', '1').required().messages(customMessages(getFieldLabel('status'))),
});

function userSchema(mode = 'create') {
  const schema = forCreateOrUpdate(baseUserSchema, [
    'fullName',
    'placeBirth',
    'dateBirth',
    'gender',
    'email',
    'password',
    'status',
  ], mode);

  if (mode === 'update') return schema.fork(['password'], () => Joi.forbidden().messages(customMessages(getFieldLabel('password'))));

  return schema;
}

module.exports = { userSchema };
