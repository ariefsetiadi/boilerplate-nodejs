const fieldLabels = {
  id: 'ID',
  fullName: 'Fullname',
  placeBirth: 'Place of Birth',
  dateBirth: 'Date of Birth',
  gender: 'Gender',
  email: 'Email',
  password: 'Password',
  defaultPassword: 'Default Password',
  status: 'Status',
  currentPassword: 'Current Password',
  newPassword: 'New Password',
  confirmNewPassword: 'Confirm New Password',
};

const getFieldLabel = (field) => {
  return fieldLabels[field] || field;
};

module.exports = {
  fieldLabels,
  getFieldLabel,
}
