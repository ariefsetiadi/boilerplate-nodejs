export const changePasswordValidation = (data) => {
  const errors = [];

  if (!data.currentPassword || data.currentPassword.trim() === "") {
    errors.push("Current Password is required");
  }

  if (!data.newPassword || data.newPassword.trim() === "") {
    errors.push("New Password is required");
  }

  if (data.newPassword.length < 6) {
    errors.push("New Password min 6 characters");
  }

  if (!data.confirmPassword || data.confirmPassword.trim() === "") {
    errors.push("Confirm Password is required");
  }

  if (data.newPassword !== data.confirmPassword) {
    errors.push("New Password and Confirm Password not match");
  }

  return errors;
};
