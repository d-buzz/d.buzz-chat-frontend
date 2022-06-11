import hive from "@hiveio/hive-js";
import signature from "@hiveio/hive-js/lib/auth/ecc";
import {
  Client,
  BlockHeader,
  SignedBlock,
  SignedTransaction,
  AppliedOperation,
  DynamicGlobalProperties,
  PrivateKey,
} from "@hiveio/dhive";

const nodes = [
  "https://api.hive.blog",
  "https://api.deathwing.me",
  "https://api.openhive.network",
];
const client = new Client(nodes, {
  failoverThreshold: nodes.length,
  timeout: 1,
});

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

  let privateKeyObject = PrivateKey.fromString(privateKey);
  let stx = client.broadcast.sign(operation, privateKeyObject);
  return stx;
};

export const KeysUtils = {
  signMessage,
  signCustomJsonMessage,
};
