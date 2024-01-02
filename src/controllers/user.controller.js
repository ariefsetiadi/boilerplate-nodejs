const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");

const User = require("../models/user.model");

const {
  createValidation,
  updateValidation,
  resetPasswordValidation,
} = require("../validators/user.validator");

const getAll = async (req, res) => {
  try {
    const query = await User.findAll();

    if (!query.length) {
      return res.status(404).json({
        success: true,
        message: "User is empty",
      });
    }

    const users = [];
    for (const row of query) {
      const data = {
        id: row.id,
        fullname: row.fullname,
        placeBirth: row.placeBirth,
        dateBirth: moment(row.dateBirth).format("DD MMM YYYY"),
        gender: row.gender === true ? "Male" : "Female",
        isAdmin: row.isAdmin === true ? "Yes" : "No",
        email: row.email,
      };
      users.push(data);
    }

    return res.status(200).json({
      success: true,
      message: "User is found",
      data: users,
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: error,
    });
  }
};

const createUser = async (req, res) => {
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

    const error = await createValidation({
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

const getById = async (req, res) => {
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

    const user = {
      id: query.id,
      fullname: query.fullname,
      placeBirth: query.placeBirth,
      dateBirth: moment(query.dateBirth).format("DD MMM YYYY"),
      gender: query.gender === true ? "Male" : "Female",
      isAdmin: query.isAdmin === true ? "Yes" : "No",
      email: query.email,
    };

    return res.status(200).json({
      success: true,
      message: "User is found",
      data: user,
    });
  } catch (error) {
    return res.status(405).json({
      success: false,
      message: error,
    });
  }
};

const updateUser = async (req, res) => {
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

    const error = await updateValidation({
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

const deleteUser = async (req, res) => {
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

const resetPassword = async (req, res) => {
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
    const error = await resetPasswordValidation({
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

module.exports = {
  getAll,
  createUser,
  getById,
  updateUser,
  deleteUser,
  resetPassword,
};
