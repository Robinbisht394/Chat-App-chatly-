const UserModel = require("../Model/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// signup or register api for user
const signup = async (req, res) => {
  const { name, email, password, pic } = req.body;

  try {
    // check if user already exist
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exist" });
    } else {
      const hashed = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        name: name,
        email: email,
        password: hashed,
        pic,
      });
      await newUser.save();

      // generating token for new user
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      // res.cookie("token", token);
      newUser.token = token;
      return res.status(201).json({ message: "User created", user: newUser });
      // return res.status(201).json({ msg: "User created", userId: newUser._id });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// login api for existing user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if such user exist
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: "USER_NOT_FOUND",
        message: "User not Found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({
        status: "error",
        code: "INVALID ID_PASSWORD",
        message: "email or password is wrong",
      });

    // generating token while login
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: true,
    // });
    return res.status(200).json({
      status: "Success",
      message: "Logged in successfully",
      user: { user, token },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

// api/user?search
const getAllUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const user = await UserModel.find(keyword);
  res.status(200).json(user);
};

module.exports = { signup, login, getAllUsers };
