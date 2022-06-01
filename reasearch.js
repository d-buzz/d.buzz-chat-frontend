const hive = require("@hiveio/hive-js");
const hived = require("@hiveio/dhive");
const signature = require("@hiveio/hive-js/lib/auth/ecc");
(async () => {
  const signMessage = (message, privateKey) => {
    let buf;
    try {
      const o = JSON.parse(message, (k, v) => {
        if (
          v !== null &&
          typeof v === "object" &&
          "type" in v &&
          v.type === "Buffer" &&
          "data" in v &&
          Array.isArray(v.data)
        ) {
          return Buffer.from(v.data);
        }
        return v;
      });
      if (Buffer.isBuffer(o)) {
        buf = o;
      } else {
        buf = message;
      }
    } catch (e) {
      buf = message;
    }
    let signed = signature.Signature.signBuffer(buf, privateKey).toHex();
    console.log("signed");
    console.log(signed);

    return signed;
  };
  signMessage("testing", "privatekey");
})();
