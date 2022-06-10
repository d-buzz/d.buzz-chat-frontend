const hive = require("@hiveio/hive-js");
const hived = require("@hiveio/dhive");
const signature = require("@hiveio/hive-js/lib/auth/ecc");
(async () => {
  const client = new hived.Client("https://api.hive.blog");
  hive.api.getAccounts(["igormuba"], (err, res) => {
    console.log(res);
  });

  // const dynamicGlobalProperties =
  //   await client.database.getDynamicGlobalProperties();

  // let data = {
  //   required_auths: ["igormuba"],
  //   required_posting_auths: [],
  //   id: "sting_private_text_message",
  //   json: JSON.stringify({
  //     fromAccount: "igormuba",
  //     toAccount: "igormuba",
  //     message: "teste",
  //     createdAt: 1654274887779,
  //     fromPubKey: "dasdqa",
  //     toPubKey: "4123ed3",
  //   }),
  // };

  // let operation = {
  //   ref_block_num: dynamicGlobalProperties.head_block_number,
  //   ref_block_prefix: Buffer.from(
  //     dynamicGlobalProperties.head_block_id,
  //     "hex"
  //   ).readUInt32LE(4),
  //   expiration: new Date(Date.now() + 1).toISOString().slice(0, -5),
  //   extensions: [],
  //   operations: [["custom_json", data]], //content of your json
  // };

  // let privateKey = hived.PrivateKey.fromString("privkey");
  // stx = client.broadcast.sign(operation, privateKey);
  // console.log("stx");
  // console.log(stx);

  // const signMessage = (message, privateKey) => {
  //   let buf;
  //   try {
  //     const o = JSON.parse(message, (k, v) => {
  //       if (
  //         v !== null &&
  //         typeof v === "object" &&
  //         "type" in v &&
  //         v.type === "Buffer" &&
  //         "data" in v &&
  //         Array.isArray(v.data)
  //       ) {
  //         return Buffer.from(v.data);
  //       }
  //       return v;
  //     });
  //     if (Buffer.isBuffer(o)) {
  //       buf = o;
  //     } else {
  //       buf = message;
  //     }
  //   } catch (e) {
  //     buf = message;
  //   }
  //   let signed = signature.Signature.signBuffer(buf, privateKey).toHex();
  //   console.log("signed");
  //   console.log(signed);

  //   return signed;
  // };
  // const signedMessage = {
  //   fromAccount: "igormuba",
  //   toAccount: "igormuba",
  //   message: "teste",
  //   createdAt: 1654274887779,
  //   fromPubKey: "dasdqa",
  //   toPubKey: "4123ed3",
  //   signed:
  //     "2047126cf942245d438638627c9e66bb974deae69b1641187877ed4026d3d9557e736006f72fdbd464c5dd4b481d00a6792ca37006fdbdb2831938517235e0448b",
  // };
})();
