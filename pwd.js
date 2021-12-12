#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import createPrompt from './prompt.js';
import url from 'url';
import { encrypt as keyEncrypt, decrypt as keyDecrypt, hash, crypto, keygen, hexToAscii, displayKey, normalizeKey, encrypt } from './crypt.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const prompt = createPrompt();

console.log('                                             ');
console.log('              2 P a s s w o r d              ');
console.log('  Zero-dependency local password management  ');
console.log('                                             ');

export function readKeyFile (path) {
    let fileData = fs.readFileSync(path, 'utf8');
    if (!fileData.startsWith(`--------------------------- [ begin 2password key ] ---------------------------`)) return false;
    if (!fileData.endsWith(`---------------------------- [ end 2password key ] ----------------------------`)) return false;
    if (!(fileData.split('\n').length == 3)) return false;
    let key = fileData.split('\n')[1];
    let normalizedKey = normalizeKey(key);
    return normalizedKey;
}

export function writeKeyFile (path, key) {
    return fs.writeFileSync(path, `--------------------------- [ begin 2password key ] ---------------------------
${displayKey(key)}
---------------------------- [ end 2password key ] ----------------------------`, 'utf8');
}

export function encryptVault (objects, key, password) {
    return keyEncrypt(JSON.stringify(objects), hexToAscii(hash(key, password)));
}

export function decryptVault (vault, key, password) {
    return JSON.parse(keyDecrypt(vault, hexToAscii(hash(key, password))));
}

let vault;
let key;
let globalPwd;
try {
    try {
        key = readKeyFile(path.join(os.homedir(), 'vault.key'));
    } catch (err) {
        key = keygen();
        writeKeyFile(path.join(os.homedir(), 'vault.key'), key);
    }
    let vaultData = fs.readFileSync(path.join(os.homedir(), 'vault.db'), 'utf8');
    let option = prompt("Vault detected! What would you like to do? ([r]emove / [u]nlock): ");
    if (option == 'r') {
        fs.unlinkSync(path.join(os.homedir(), 'vault.key'));
        fs.unlinkSync(path.join(os.homedir(), 'vault.db'));
        console.log("Vault and key files unlinked from system.");
        process.exit(0);
    }
    if (option !== 'u') {
        console.log("Unknown option.");
        process.exit(1);
    }
    let pwd = prompt("To decrypt your vault, enter your master password: ");
    globalPwd = pwd;
    try {
        vault = decryptVault(vaultData, key, pwd);
    } catch (err) {
        console.log('Invalid password. Please try again.');
        process.exit();
    }
} catch (err) {
    console.log("You don't have a ~/vault.db file. This file holds all of your encrypted passwords. Creating one now...");
    let pwd = prompt("You also don't have a master password. Please enter one now: ");
    try {
        key = readKeyFile(path.join(os.homedir(), 'vault.key'));
    } catch (err) {
        key = keygen();
        writeKeyFile(path.join(os.homedir(), 'vault.key'), key);
    }
    vault = { name: "New Vault", items: [] };
    fs.writeFileSync(path.join(os.homedir(), 'vault.db'), encryptVault(vault, key, pwd), 'utf8');
}

console.log("Vault opened!");
console.log("Name: " + vault.name);
let pwd = globalPwd;
console.log('\nItems:');
vault.items.forEach((item, i) => console.log(`(${i}) ${item.name}:
    Username: ${item.username}
    Password: ${item.password}`));

let option = prompt('\nWhat would you like to do? ([c]lose / [e]dit / [a]dd / [r]emove): ');
if (option !== 'c' && option !== 'e' && option !== 'a' && option !== 'r') {
    console.log('Unknown option.');
    process.exit(1);
}
if (option == 'c') {
    console.log("Closing vault.");
    process.exit(0);
}
if (option == 'e') {
    let num = +prompt('What number? ');
    if (!vault.items[num]) {
        console.log('Unknown item.');
        process.exit(1);
    }
    let o = prompt('What would you like to edit? ([n]ame / [u]sername / [p]assword): ');
    if (o !== 'n' && o !== 'u' && o !== 'p') {
        console.log('Unknown option.');
        process.exit(1);
    }
    if (o == 'n') {
        vault.items[num].name = prompt('Enter a new name: ');
    }
    if (o == 'u') {
        vault.items[num].username = prompt('Enter a new username: ');
    }
    if (o == 'p') {
        vault.items[num].password = prompt('Enter a new password: ');
    }
    fs.writeFileSync(path.join(os.homedir(), 'vault.db'), encryptVault(vault, key, pwd), 'utf8');
    console.log('Success.');
}
if (option == 'a') {
    let num = vault.items.length;
    vault.items.push({});
    vault.items[num].name = prompt('Enter a name: ');
    vault.items[num].username = prompt('Enter a username: ');
    vault.items[num].password = prompt('Enter a password: ');
    console.log('Success.');
    fs.writeFileSync(path.join(os.homedir(), 'vault.db'), encryptVault(vault, key, pwd), 'utf8');
}
if (option == 'r') {
    let num = +prompt('What number? ');
    if (!vault.items[num]) {
        console.log('Unknown item.');
        process.exit(1);
    }
    vault.items.splice(num, 1);
    console.log('Removed.');
}