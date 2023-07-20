import crypto from "crypto";
import fs from "fs";
const algorithm = "aes-256-cbc";

if (fs.existsSync(`${process.env.ENCRYPT_PATH}/key.txt`)) {
  console.log("use existing key");
} else {
  console.log("creating new key");
  fs.writeFileSync(
    `${process.env.ENCRYPT_PATH}/key.txt`,
    crypto.randomBytes(32)
  );
}

const key = fs.readFileSync(`${process.env.ENCRYPT_PATH}/key.txt`);

export const encrypt = (data) => {
  const iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "base32"), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

export const decrypt = (encryptedData) => {
  let iv = Buffer.from(encryptedData.iv, "hex");
  let encryptedText = Buffer.from(encryptedData.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, "base32"),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
