export default {
    hashText: (str) => {
        let formatStr = `YM_${str}_YM`;
        let hashStr = '';
        for (let i in formatStr) {
            hashStr += formatStr[i].charCodeAt(0)
        }
        return `YaMieu_${String(Math.ceil(Number(hashStr) * 2))}`;
    }
}