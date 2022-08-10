export const deepClone = (obj) => {
    if (typeof obj !== 'object') return
    let newObj = obj instanceof Array ? [] : {}  
    for (let key in obj) {    
       if (typeof obj[key] === 'object') {      
         newObj[key] = deepClone(obj[key])    
       } else {      
          newObj[key] = obj[key]    
       }  
     }
     return newObj
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