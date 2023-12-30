import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  registerValidation,
  loginValidation,
} from "../validation/register.validation.js";

export const register = async (req, res) => {
  try {
    const users = await User.findAll();

    // Check users is empty or not
    if (users.length) {
      return res.status(405).json({
        success: false,
        message: "User is not empty, please add user from menu user",
      });
    }

    const { fullname, placeBirth, dateBirth, gender, email, password } =
      req.body;

    // Check field validation
    const error = registerValidation({
      fullname,
      placeBirth,
      dateBirth,
      gender,
      email,
      password,
    });

    if (error.length) {
      return res.status(422).json({
        success: false,
        message: error[0],
      });
    }

    const registerUser = new User({
      fullname: fullname,
      placeBirth: placeBirth,
      dateBirth: dateBirth,
      gender: gender,
      isAdmin: true,
      email: email,
      password: password,
    });
    await registerUser.save();

    return res.status(201).json({
      success: true,
      message: "Register is success",
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check field validation
    const error = loginValidation({
      email,
      password,
    });

    if (error.length) {
      return res.status(422).json({
        success: false,
        message: error[0],
      });
    }

    // Check User
    const checkUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!checkUser) {
      return res.status(401).json({
        success: true,
        message: "Email or Password is invalid",
      });
    }

    // Check Password
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      return res.status(401).json({
        success: true,
        message: "Email or Password is invalid",
      });
    }

    const user = {
      id: checkUser.id,
      email: checkUser.email,
      isAdmin: checkUser.isAdmin,
    };

    const token = jwt.sign(user, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Login is success",
      token: token,
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: error,
    });
  }
};
