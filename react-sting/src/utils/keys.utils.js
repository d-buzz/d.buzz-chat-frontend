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
  return signed;
};
const signCustomJsonMessage = async (newMessage, privateKey) => {
  const client = new Hive.Client("https://api.hive.blog");
  const dynamicGlobalProperties =
    await client.database.getDynamicGlobalProperties();
  let data = {
    required_auths: [newMessage.fromAccount],
    required_posting_auths: [],
    id: "sting_private_text_message",
    json: JSON.stringify(newMessage),
  };

  let operation = {
    ref_block_num: dynamicGlobalProperties.head_block_number,
    ref_block_prefix: Buffer.from(
      dynamicGlobalProperties.head_block_id,
      "hex"
    ).readUInt32LE(4),
    expiration: new Date(Date.now() + 1).toISOString().slice(0, -5),
    extensions: [],
    operations: [["custom_json", data]], //content of your json
  };

  let privateKeyObject = Hive.PrivateKey.fromString(privateKey);
  let stx = client.broadcast.sign(operation, privateKeyObject);
  return stx;
};

export const KeysUtils = {
  getPublicKeyFromPrivateKeyString,
  signMessage,
  signCustomJsonMessage,
};
