var CryptoJS = require("crypto-js");

const generatePassword = () => {
    let password = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYabcdefghilkmnopqrstuvwxyz0123456789@#$';

    for (i = 1; i <= 8; i++) {
        let char = Math.floor(Math.random() * str.length + 1);
        password += str.charAt(char)
    }
    return password;
}

const encrypt = (value) => {
    return CryptoJS.AES.encrypt(value, 'SiSaleSA_').toString();
}

module.exports = {
    generatePassword,
    encrypt,
}
