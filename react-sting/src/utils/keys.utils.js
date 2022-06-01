import * as Hive from "@hiveio/dhive";
import hive from "@hiveio/hive-js";
import signature from "@hiveio/hive-js/lib/auth/ecc";

const getPublicKeyFromPrivateKeyString = (privateKeyS) => {
  try {
    const privateKey = Hive.PrivateKey.fromString(privateKeyS);
    const publicKey = privateKey.createPublic();
    return publicKey.toString();
  } catch (e) {
    return null;
  }
};
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

export const KeysUtils = {
  getPublicKeyFromPrivateKeyString,
  signMessage,
};
