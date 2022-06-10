const express = require("express");
const app = express();
const { signup, login, changeUser } = require("./src/user");
const hive = require("@hiveio/hive-js");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const Message = require("./models/message");
const req = require("express/lib/request");
const { verifyTransaction } = require("./src/utils/keys.utils");

app.use(bodyParser.json());
const port = 3030;
const server = app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

connectDB();

app.post("/message", async function (req, res) {
  let rv = await verifyTransaction(req.body);
  console.log(rv);
  // let data = JSON.parse(req.body.operations[0][1].json);
  // console.log("data");
  // console.log(data);

  // let { fromAccount, toAccount, message, createdAt, fromPubKey, toPubKey } =
  //   data;
  // let transaction = JSON.parse(req.body.transaction);

  // const newMessage = new Message({
  //   fromAccount,
  //   toAccount,
  //   message,
  //   createdAt,
  //   fromPubKey,
  //   toPubKey,
  //   transaction,
  // });
  // console.log("newMessage");
  // console.log(newMessage);
  // newMessage.save().then((msg) => {
  //   res.send(msg);
  // });
});

app.get("/messages", async function (req, res) {
  let { fromAccount, toAccount } = req.query;

  let messages = await Message.find();

  res.send(messages);
});
