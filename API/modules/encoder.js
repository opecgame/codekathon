const config = require("../config");
/**
 * @param {string} text
 * @returns {string}
 */
module.exports.encode = (text) => {
    const key_to_base64 = Buffer.from(config.secret, 'utf-8').toString('base64');
    const text_to_hex = Buffer.from(text, 'utf-8').toString('hex');
    const hex_to_base64 = Buffer.from(text_to_hex, 'utf-8').toString('base64');
    const result_chars = [];
    for (let i = 0; i < hex_to_base64.length; i++) {
        result_chars.push(hex_to_base64[i]);
        if (i % 2 === 0) {
            const k = key_to_base64[i / 2];
            if (k) {
                result_chars.push(k);
            }
        }
    }
    const result = result_chars.join("");
    return result;
}

/**
 * 
 * @param {string} text 
 * @returns { string }
 */
module.exports.decode = (text) =>{
    const key_to_base64 = Buffer.from(config.secret, 'utf-8').toString('base64');
    const keepIndexes = [];
    let keyCount = 0;
    for (let i = 1; i < text.length; i += 3) {
        keepIndexes.push(i);
        keyCount++
        if (keyCount === key_to_base64.length) {
            break;
        }
    }
    const real_text_array = [];
    for (let i = 0; i < text.length; i++) {
        if (!keepIndexes.includes(i)) {
            real_text_array.push(text[i]);
        }
    }
    const real_text = real_text_array.join("");
    const text_to_hex = Buffer.from(real_text, 'base64').toString('utf-8');
    const hex_to_base64 = Buffer.from(text_to_hex, 'hex').toString('utf-8');
    return hex_to_base64;
}