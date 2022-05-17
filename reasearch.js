const Gun = require("gun");
const SEA = require("gun/sea");
(async () => {
  const gun = Gun({
    peers: ["http://localhost:3030/gun"],
  });
  gun.on((params) => {
    console.log(params);
  });
  login("username", "password");
  gun
    .get("igor")
    .put(
      {
        fromAccount: "igor",
        toAccount: m.toAccount,
        message: m.message,
        createdAt: m.createdAt,
      },
      (ack) => {
        console.log(ack);
      }
    );
})();
