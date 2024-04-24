const validString = (input) => {
    
    if (typeof(input) !== 'string' || !input){
        throw `${input || 'Provided variable'} is not a string`;
    }
    else {
        let inputTrim = input.trim();
        if (inputTrim.length === 0) {
            throw 'Provided variable is not a string';
        }
        return inputTrim;
    }
     
}


export{validString};