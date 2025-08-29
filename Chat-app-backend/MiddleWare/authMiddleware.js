const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  // const { token } = req.cookie;
  const token = req.config.headers.authorization;
  token = token.split(" ")[1];
  if (!token) {
    // token not present
    return res.status(401).json({
      status: "error",
      code: "UNAUTHORISED_USER",
      message: "User not authorized",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
    console.log(decoded);
    req.user = decoded; // attach user info
    next(); // call the next fnx
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

module.exports = { authMiddleware };
