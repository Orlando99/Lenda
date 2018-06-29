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

export function numberFormatter(params){
     return formatNumber(params.value);
}

export function discFormatter(params){
    return formatNumber(params.value) + "%";
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

export function totalMarketValue(loanCollateral) {
    var total = 0;
    loanCollateral.forEach(lc => {
        total += Number(lc.Market_Value);
    });

    return total;
}

export function totalDiscValue(loanCollateral) {
    var total = 0;
    loanCollateral.forEach(lc => {
        total += Number(lc.Disc_CEI_Value);
    });

    return total;
}

export function totalPriorLien(loanCollateral) {
    var total = 0;
    loanCollateral.forEach(lc => {
        total += Number(lc.Prior_Lien_Amount);
    });

    return total;
}

export function totalNetMktValue(loanCollateral) {
    var total = 0;
    loanCollateral.forEach(lc => {
        total += Number(lc.Net_Market_Value);
    });
    return total;
}

export function totalQty(loanCollateral) {
    var total = 0;
    loanCollateral.forEach(lc => {
        total += Number(lc.Qty);
    });
    return total;
}

export function totalPrice(loanCollateral) {
    var total = 0;
    loanCollateral.forEach(lc => {
        total += Number(lc.Price);
    });
    return total;
}

function formatNumber(number) {
    // this puts commas into the number eg 1000 goes to 1,000,
    // i pulled this from stack overflow, i have no idea how it works
    return Math.floor(number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
