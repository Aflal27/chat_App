import { getToken } from "../helpers/getUserDetailsFromToken.js";

export const userDetails = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const user = await getToken(token);
    return res.status(200).json({
      message: "user details",
      data: user,
    });
  } catch (error) {
    console.log("userDetailsError", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
