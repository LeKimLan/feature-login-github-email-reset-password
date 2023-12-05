import CryptoJS from 'crypto-js'
export default {
    createToken: function (data, privateKey = import.meta.env.VITE_PRIVATE_KEY) {
        return CryptoJS.AES.encrypt(JSON.stringify(data), privateKey).toString();
    },
    decodeToken: function (token, key = import.meta.env.VITE_PRIVATE_KEY, privateKey = import.meta.env.VITE_PRIVATE_KEY) {
        try {
            if (privateKey != key) {
                return false
            }
            const decryptedData = CryptoJS.AES.decrypt(token, privateKey)
                .toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedData)
        } catch {
            return false
        }
    },
    generateOTP: () => {
        var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let OTP = '';
        var len = string.length;
        for (let i = 0; i < 6; i++) {
            OTP += string[Math.floor(Math.random() * len)];
        }
        return OTP;
    }
}
//json - web - token