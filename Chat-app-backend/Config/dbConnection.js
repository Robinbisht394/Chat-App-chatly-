const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected ");
  } catch (err) {
    console.log("db connection failed ", err);
  }
};

module.exports = { dbConnection };
