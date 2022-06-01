import * as Hive from "@hiveio/dhive";
const getPublicKeyFromPrivateKeyString = (privateKeyS) => {
  try {
    const privateKey = Hive.PrivateKey.fromString(privateKeyS);
    const publicKey = privateKey.createPublic();
    return publicKey.toString();
  } catch (e) {
    return null;
  }
};

export const KeysUtils = {
  getPublicKeyFromPrivateKeyString,
};
