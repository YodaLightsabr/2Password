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

export class Safe {
	constructor (key, password) {
		this.key = key;
		this.password = password;
	}

	static fromDisplay (display, password) {
		return new Safe(normalizeKey(display), password);
	}

	get hash () {
		return hash(this.key, this.password);
	}

	set hash (value) {
		if (value !== hash(this.key, this.password)) throw new Error('Cannot set hash that does not match key and password.')
	}

	get displayKey () {
		return displayKey(this.key);
	}

	set displayKey (key) {
		this.key = normalizeKey(key);
	}

	encrypt (text) {
		return encrypt(text, this.hash);
	}

	decrypt (text) {
		return decrypt(text, this.hash);
	}

	static generateKey () {
		return keygen();
	}

	static fromDummy () {
		return new Safe(Safe.generateKey(), '123456');
	}
}

export default Safe;
