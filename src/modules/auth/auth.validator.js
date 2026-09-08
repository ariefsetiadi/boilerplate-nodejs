const Joi = require('joi');
const customMessages = require('../../utils/customMessages');
const { getFieldLabel } = require('../../utils/fieldLabels');

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages(customMessages(getFieldLabel('email'))),
  password: Joi.string().required().messages(customMessages(getFieldLabel('password'))),
});

const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(3).max(150).required().messages(customMessages(getFieldLabel('fullName'))),
  placeBirth: Joi.string().min(3).max(100).messages(customMessages(getFieldLabel('placeBirth'))),
  dateBirth: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).messages(customMessages(getFieldLabel('dateBirth'))),
  gender: Joi.valid('0', '1').required().messages(customMessages(getFieldLabel('gender'))),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages(customMessages(getFieldLabel('currentPassword'))),
  newPassword: Joi.string().min(6).required().messages(customMessages(getFieldLabel('newPassword'))),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    ...customMessages(getFieldLabel('confirmNewPassword')),
    'any.only': `${getFieldLabel('confirmNewPassword')} does not match`,
  }),
});

module.exports = {
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
};
