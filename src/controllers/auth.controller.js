const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const Token = require("../models/token.model");

const {
  registerValidation,
  loginValidation,
} = require("../validators/auth.validator");

const register = async (req, res) => {
  try {
    const { fullname, placeBirth, dateBirth, gender, email, password } =
      req.body;

    // Check field validation
    const error = await registerValidation({
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
      email: email.toLowerCase(),
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
      message: "Register is failed",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check field validation
    const error = await loginValidation({
      email,
      password,
    });

    if (error.length) {
      return res.status(422).json({
        success: false,
        message: error[0],
      });
    }

    // Check User by Email
    const checkUser = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!checkUser) {
      return res.status(401).json({
        success: false,
        message: "Email or Password is invalid",
      });
    }

    // Compare Password
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "Email or Password is invalid",
      });
    }

    const user = {
      id: checkUser.id,
      email: checkUser.email,
      isAdmin: checkUser.isAdmin,
    };

    // Expired in token
    const expiresInToken = "1d";

    // Sign Jwt Token
    const token = jwt.sign(user, process.env.JWT_KEY, {
      expiresIn: expiresInToken,
    });

    // Get expired token
    const decodeToken = jwt.decode(token);
    const expIso = new Date(decodeToken.exp * 1000);

    // Save token to database
    const saveToken = new Token({
      userId: checkUser.id,
      accessToken: token,
      expiresAt: expIso,
    });
    await saveToken.save();

    return res.status(200).json({
      success: true,
      message: "Login is success",
      token: token,
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: "Login is failed",
    });
  }
};

const logout = async (req, res) => {
  try {
    const getToken = await Token.findOne({
      where: {
        accessToken: req.headers?.authorization?.split(" ")[1],
      },
    });

    if (!getToken) {
      return res.status(404).json({
        success: true,
        message: "Token not valid",
      });
    }

    await Token.destroy({
      where: {
        accessToken: getToken.accessToken,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Logout is success",
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: "Logout is failed",
    });
  }
};

module.exports = { register, login, logout };
