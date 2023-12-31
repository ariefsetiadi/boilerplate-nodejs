import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/user.model.js";

import {
  createValidation,
  updateValidation,
  resetPasswordValidation,
} from "../validators/user.validator.js";

export const getAll = async (req, res) => {
  try {
    const query = await User.findAll();

    if (!query.length) {
      return res.status(404).json({
        success: true,
        message: "User is empty",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User is found",
      data: query,
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: error,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      fullname,
      placeBirth,
      dateBirth,
      gender,
      isAdmin,
      email,
      password,
    } = req.body;
    const error = createValidation({
      fullname,
      placeBirth,
      dateBirth,
      gender,
      isAdmin,
      email,
      password,
    });

    if (error.length) {
      return res.status(422).json({
        success: false,
        message: error[0],
      });
    }

    const checkUser = await User.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (checkUser) {
      return res.status(401).json({
        success: true,
        message: "Email already used",
      });
    }

    const user = new User({
      fullname: fullname,
      placeBirth: placeBirth,
      dateBirth: dateBirth,
      gender: gender,
      isAdmin: isAdmin,
      email: email.toLowerCase(),
      password: password,
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Create User is success",
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: "Create User is failed",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const query = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!query) {
      return res.status(404).json({
        success: true,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User is found",
      data: query,
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: error,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const query = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!query) {
      return res.status(404).json({
        success: true,
        message: "User not found",
      });
    }

    const { fullname, placeBirth, dateBirth, gender, isAdmin, email } =
      req.body;

    const error = updateValidation({
      fullname,
      placeBirth,
      dateBirth,
      gender,
      isAdmin,
      email,
    });

    if (error.length) {
      return res.status(422).json({
        success: false,
        message: error[0],
      });
    }

    // Check Unique Email
    const allUser = await User.findAll({
      where: {
        id: {
          [Op.not]: req.params.id,
        },
        email: email.toLowerCase(),
      },
    });

    if (allUser.length) {
      return res.status(422).json({
        success: false,
        message: "Email already used",
      });
    }

    query.fullname = fullname;
    query.placeBirth = placeBirth;
    query.dateBirth = dateBirth;
    query.gender = gender;
    query.isAdmin = isAdmin;
    query.email = email.toLowerCase();
    await query.save();

    return res.status(200).json({
      success: false,
      message: "Update User is success",
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: "Update User is failed",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    const decode = jwt.decode(token);

    const query = await User.findOne({
      where: {
        id: {
          [Op.not]: decode.id,
        },
        id: req.params.id,
      },
    });

    if (!query) {
      return res.status(404).json({
        success: true,
        message: "User not found",
      });
    }

    await User.destroy({
      where: {
        id: {
          [Op.not]: decode.id,
        },
        id: req.params.id,
      },
    });

    return res.status(200).json({
      success: false,
      message: "Delete User is success",
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: "Delete User is failed",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: true,
        message: "User not found",
      });
    }

    const { password } = req.body;

    // Check Validation
    const error = resetPasswordValidation({
      password,
    });

    if (error.length) {
      return res.status(422).json({
        success: false,
        message: error[0],
      });
    }

    const hashing = await bcrypt.hash(password, 10);
    user.password = hashing;
    await user.save();

    return res.status(200).json({
      success: false,
      message: "Reset Password is success",
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: "Reset Password is failed",
    });
  }
};
