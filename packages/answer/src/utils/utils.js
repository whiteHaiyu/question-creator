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

export const getQueryVariable = (variable) => {
   let query = window.location.search.substring(1);
   let vars = query.split("&");
   for (let i=0;i<vars.length;i++) {
           let pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return null;
}