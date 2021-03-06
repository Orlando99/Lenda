import { lchmod } from "fs";

export function setNetMktValue (params) {
    return params.data.Market_Value - params.data.Prior_Lien_Amount;
}

export function setMktValue (params) {
    return params.data.Qty * params.data.Price;
}

export function setDiscValue (params) {
    return (params.data.Market_Value - (params.data.Market_Value * (1/params.data.Disc_CEI_Value)));
}

export function currencyFormatter (params) {
    if(params.value == '-'){
        return params.value;
    }else if(params.value == ''){
        return '-';
    }else{
        var withDecimals = params.value % 1;
        if(withDecimals){
            var usdFormate = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
            });
        }else{
            var usdFormate = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
            });
        }
        return usdFormate.format(params.value);
    }
   
}


function formatNumber(number) {
    // this puts commas into the number eg 1000 goes to 1,000,
    // i pulled this from stack overflow, i have no idea how it works
    return Math.floor(number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
export function discFormatter(params){
    return formatNumber(params.value) + "%";
}







