require('dotenv').config();

const crypto = require('crypto');

const aesKey = process.env.AES_KEY;
const aesIV = process.env.AES_IV;

const key = crypto
  .createHash('sha512')
  .update(aesKey)
  .digest('hex')
  .substring(0, 32);

const encryptionIV = crypto
  .createHash('sha512')
  .update(aesIV)
  .digest('hex')
  .substring(0, 16);

const encryptData = (data) => {
  const cipher = crypto.createCipheriv(
    process.env.ENCRYPTION_METHOD,
    key,
    encryptionIV
  );
  return Buffer.from(
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64');
};

const decryptData = (encryptedData) => {
  const buff = Buffer.from(encryptedData, 'base64');
  const decipher = crypto.createDecipheriv(
    process.env.ENCRYPTION_METHOD,
    key,
    encryptionIV
  );
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  );
};

module.exports = { encryptData, decryptData };
