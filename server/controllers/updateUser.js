import { getToken } from "../helpers/getUserDetailsFromToken.js";
import User from "../models/userModel.js";

export const updateUser = async (req, res) => {
  try {
    const token = req.cookies.token || "";

    const user = await getToken(token);

    const { name, profile_pic } = req.body;

    const updateUser = await User.updateOne(
      { _id: user._id },
      {
        name,
        profile_pic,
      }
    );

    const userInfomation = await User.findById(user._id);

    return res.json({
      message: "user update successfully",
      data: userInfomation,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
