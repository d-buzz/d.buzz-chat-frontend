const express = require("express");
const app = express();
const { signup, login, changeUser } = require("./src/user");
const hive = require("@hiveio/hive-js");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const Message = require("./models/message");
const req = require("express/lib/request");

app.use(bodyParser.json());
const port = 3030;
const server = app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

connectDB();
console.log(Message.find());

app.post("/message", async function (req, res) {
  let data = JSON.parse(req.body.operations[0][1].json);

  let { fromAccount, toAccount, message, createdAt, fromPubKey, toPubKey } =
    data;

  const newMessage = new Message({
    fromAccount,
    toAccount,
    message,
    createdAt,
    fromPubKey,
    toPubKey,
    transaction: JSON.stringify(req.body),
  });
  newMessage.save().then((msg) => {
    res.send(msg);
  });
});

app.get("/messages", async function (req, res) {
  let { fromAccount, toAccount } = req.query;

  let messages = await Message.find();

  res.send(messages);
});
