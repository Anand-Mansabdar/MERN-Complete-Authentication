import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: `Invalid token`,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id) {
      req.userId = decoded.id;
    } else {
      return res.status(400).json({
        success: false,
        message: `Not authorized`,
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

export default userAuth;
