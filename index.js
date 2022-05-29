const express = require("express");
const app = express();
const { signup, login, changeUser } = require("./src/user");
const hive = require("@hiveio/hive-js");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const Message = require("./models/message");

app.use(bodyParser.json());
const port = 3030;
const server = app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

connectDB();
console.log(Message.find());

app.post("/message", async function (req, res) {
  // console.log("req.body");
  // console.log(req.body);
  // console.log(Message.find());

  // const message = new Message({ ...req.body });
  // message.save().then((res) => console.log(res));
  res.send("POST request to the homepage");
});

// (async () => {
//     const port = 3030;
//     // Gun({ web: server });
//     const server = app.listen(port, () => {
//         console.log(`listening at http://localhost:${port}`);
//     });
// const gun = new Gun({
//     web: server,
//     peers: ["http://localhost:3030/gun"],
//     verify: {
//         check: (params) => {
//             console.log("verify check params");

//             console.log(params);
//         },
//     },
// });
//     gun.on((params) => {
//         console.log(params);
//     });
//     const user = gun.user().recall({ sessionStorage: true });

//     app.use(Gun.serve);

//     changeUser(user);
//     login("username", "password");
//     gun.get("key").put({ hello: "world" }, (ack) => {
//         console.log(ack);
//     });
// })();
