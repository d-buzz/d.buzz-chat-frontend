const express = require("express");
const Gun = require("gun");
const app = express();
const SEA = require("gun/sea");
const { signup, login, changeUser } = require("./src/user");
const port = 3030;
app.use(Gun.serve);
const server = app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
Gun({ web: server });
// (async () => {
//     const port = 3030;
//     // Gun({ web: server });
//     const server = app.listen(port, () => {
//         console.log(`listening at http://localhost:${port}`);
//     });
//     const gun = new Gun({
//         web: server,
//         peers: ["http://localhost:3030/gun"],
//         verify: {
//             check: (params) => {
//                 console.log("verify check params");

//                 console.log(params);
//             },
//         },
//     });
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
