export function setNetMktValue (params) {
    return params.data.Market_Value - params.data.Prior_Lien_Amount;
}

export function setMktValue (params) {
    return params.data.Qty * params.data.Price;
}

export function setDiscValue (params) {
    return (params.data.Market_Value - (params.data.Market_Value * (params.data.Disc_CEI_Value/100.0)));
}

export function currencyFormatter (params) {
    return "$ " + params.value;
}

export function insuredFormatter (params) {
    if(params.cellEditorparams){
        return params.cellEditorparams.values[1].value;
    }else{
        if(params.value === 1){
            return 'Yes';
        }else{
            return 'No';
        }
    }
    
}
