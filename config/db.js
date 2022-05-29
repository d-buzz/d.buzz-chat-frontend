const mongoose = require("mongoose");
const config = require("config");

let db;
if (process.env.mongoURI) {
  db = process.env.mongoURI;
} else {
  db = config.get("mongoURI");
}

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
    });
    console.log(mongoose.connection.host);
    console.log(mongoose.connection.port);
    console.log("mongoose.connection.readyState");
    console.log(mongoose.connection.readyState);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
