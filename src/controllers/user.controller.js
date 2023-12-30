import User from "../models/user.model.js";

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
