export const objDeepClone = (obj) => {
    // const res = {};

    // for (const key in obj) {
    //     res[key] = typeof obj[key] === 'object' ? objDeepClone(obj[key]) : obj[key];
    // }

    // return res;
    return JSON.parse(JSON.stringify(obj));
};

export const guid = () => {
    const S4 = () =>  {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

export const convert = (num) => {
    return num <= 26 ? 
         String.fromCharCode(num + 64) : convert(~~((num - 1) / 26)) + convert(num % 26 || 26);
};