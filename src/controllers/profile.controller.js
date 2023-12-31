import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import moment from "moment";

import { changePasswordValidation } from "../validators/profile.validator.js";

export const myProfile = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(404).json({
        success: true,
        message: "Token not valid",
      });
    }

    const decode = jwt.decode(token);
    const getUser = await User.findOne({
      where: {
        id: decode.id,
      },
    });

    const user = {
      id: getUser.id,
      fullname: getUser.fullname,
      placeBirth: getUser.placeBirth,
      dateBirth: moment(getUser.dateBirth).format("DD MMM YYYY"),
      gender: getUser.gender === true ? "Male" : "Female",
      isAdmin: getUser.isAdmin === true ? "Yes" : "No",
      email: getUser.email,
    };

    return res.status(200).json({
      success: true,
      message: "Profile is found",
      data: user,
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: error,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(404).json({
        success: true,
        message: "Token not valid",
      });
    }

    const decode = jwt.decode(token);
    const user = await User.findOne({
      where: {
        id: decode.id,
      },
    });

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check Validation
    const error = changePasswordValidation({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (error.length) {
      return res.status(422).json({
        success: false,
        message: error[0],
      });
    }

    // Check currentPassword match or not
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(422).json({
        success: false,
        message: "Current Password is invalid",
      });
    }

    // Check currentPassword match or not
    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      return res.status(422).json({
        success: false,
        message: "New Password must be different from Current Password",
      });
    }

    // Update Password
    const hashing = await bcrypt.hash(newPassword, 10);
    user.password = hashing;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Change Password is success",
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: "Change Password is failed",
    });
  }
};
