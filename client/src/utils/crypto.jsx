import CryptoJS from 'crypto-js';

export const aesEncrypt = (str) =>
    CryptoJS.AES.encrypt(str, process.env.REACT_APP_SECRET_KEY).toString();

export const aesDecrypt = (encryptedStr) => {
    try {
        return CryptoJS.AES.decrypt(encryptedStr, process.env.REACT_APP_SECRET_KEY).toString(
            CryptoJS.enc.Utf8
        );
    } catch (err) {
        // Return empty string when failed to decrypt the data.
        return '';
    }
};
