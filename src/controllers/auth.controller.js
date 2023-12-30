import User from "../models/user.model.js";
import { registerValidation } from "../validation/register.validation.js";

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
