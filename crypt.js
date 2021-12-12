import crypt from 'crypto';

const algorithm = 'aes-256-ctr';
const iv = 'AIQ232C904M524P7';

const length = 32;

export const crypto = crypt;

export const encrypt = (text, secretKey) => {
    secretKey = (secretKey + '').padStart(length, '0').substring(0, length);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return encrypted.toString('hex');
};

export const decrypt = (text, secretKey) => {
    secretKey = (secretKey + '').padStart(length, '0').substring(0, length);

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(text, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

export const keygen = () => {
    return crypto.randomBytes(32).toString('hex');
}

export const hash = (key, password) => {
    return crypto.createHmac('sha256', `${key}${password}`).digest('hex');
}

export const hexToAscii = (hex) => {
    return Buffer.from(hex, 'hex').toString('ascii');
}

export const displayKey = (input) => {
    return input.match(/.{1,4}/g).join('-').toUpperCase();
}

export const normalizeKey = (input) => {
    return input.toLowerCase().split('-').join('');
}