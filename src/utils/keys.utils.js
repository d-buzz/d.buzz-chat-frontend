const Hive = require("@hiveio/dhive");
const HiveD = require("@hiveio/dhive");
const hive = require("@hiveio/hive-js/lib/api");
const getPublicKeyFromPrivateKeyString = (privateKeyS) => {
  try {
    const privateKey = Hive.PrivateKey.fromString(privateKeyS);
    const publicKey = privateKey.createPublic();
    return publicKey.toString();
  } catch (e) {
    return null;
  }
};
const verifyTransaction = async (stx) => {
  const client = new Hive.Client("https://api.hive.blog");
  const rv = await client.database.verifyAuthority(stx);
  return rv;
};

exports.getPublicKeyFromPrivateKeyString = getPublicKeyFromPrivateKeyString;
exports.verifyTransaction = verifyTransaction;
