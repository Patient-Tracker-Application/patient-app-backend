const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  try {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  } catch (error) {
    throw new Error("Failed to generate access token");
  }
};

const generateRefreshToken = (userId) => {
  try {
    return jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
  } catch (error) {
    throw new Error("Failed to generate refresh token");
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
