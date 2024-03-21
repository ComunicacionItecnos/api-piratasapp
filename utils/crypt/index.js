const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const config = require('../../config/config');
const iv = crypto.randomBytes(16); // debe tener 16 bytes

function encrypt(text) {
  const keyCrypto = config.keyCrypto;
  // El tamaño de la clave debe ser de 32 bytes
  const cipher = crypto.createCipheriv(algorithm, config.keyCrypto, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
}

function decrypt(hash) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    config.keyCrypto,
    Buffer.from(hash.iv, 'hex'),
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
}

module.exports = { encrypt, decrypt };
