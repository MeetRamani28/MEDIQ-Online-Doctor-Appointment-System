const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development:mongoose");

mongoose
  .connect(`${config.get("MONGODB_URI")}/MEDIQ`)
  .then(() => {
    dbgr("Database Connected SuccessFully");
  })
  .catch((err) => {
    dbgr("Database Connection Error!", err);
  });

module.exports = mongoose.connection;