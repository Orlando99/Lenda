import { extractCropValues, lookupCropValue, lookupCropTypeValue } from "../Workers/utility/aggrid/cropboxes";
import { lookupStateValue, lookupCountyValue } from "../Workers/utility/aggrid/stateandcountyboxes";

//This file contains the centralized methods for all value formatters

//THIS IS CURRENCY FORMATTER
//********************************* */
export function currencyFormatter(params) {
    if(isNaN(params.value))
    {
        params.value=0; 
    }
    return "$" + formatcurrency(params.value);
}
export function formatcurrency(number) {
    return parseFloat(number).toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
//********************************* */
// CURRENCY FORMATTER  

//THIS IS ACRES FORMATTER
//********************************* */
export function acresFormatter(params) {
    
    if(isNaN(params.value))
    {
        params.value=0; 
    }
    return formatacres(params.value);
}
export function formatacres(number) {
    return parseFloat(number).toFixed(1);
}
//********************************* */
// ACRES FORMATTER  

//THIS IS ACRES FORMATTER
//********************************* */
export function percentageFormatter(params, exception?: number) {
    if(isNaN(params.value))
    {
        params.value=0; 
    }
    return formatpercentage(params.value);
}
export function formatpercentage(number, exception?: number) {
    if (exception == null)
        return parseFloat(number).toFixed(1) + " %";
    else
        return parseFloat(number).toFixed(exception) + " %";
}
//********************************* */
// ACRES FORMATTER  


//THIS IS ACRES FORMATTER
//********************************* */
export function UnitperacreFormatter(params) {
    if(isNaN(params.value))
    {
        params.value=1; 
    }
    let selected = [{ key: 1, value: '$/acre' }, { key: 2, value: '$ Total' }].find(v => v.key == params.value);
    return selected ? selected.value : undefined;
}

//********************************* */
// ACRES FORMATTER  

//THIS IS CROP ID to NAME FORMATTER
//********************************* */
export function CropidtonameFormatter(params) {
    let refdata=JSON.parse('[' + window.localStorage.getItem("ng2-webstorage|refdata") + ']')[0];
    let values : Array<any>= extractCropValues(refdata.CropList);
    return lookupCropValue(values, params.value);
}
//********************************* */
// CROP ID to NAME FORMATTER

//THIS IS CROP TYPE ID to NAME FORMATTER
//********************************* */
export function CroptypeidtonameFormatter(params) {
    return lookupCropTypeValue(params.value);
}
//********************************* */
// CROP TYPE ID to NAME FORMATTER

//THIS IS STATE ID to NAME FORMATTER
//********************************* */
export function StateidtonameFormatter(params) {
    return lookupStateValue(params.colDef.cellEditorParams.values, parseInt(params.value));
}
//********************************* */
// STATE ID to NAME FORMATTER

//THIS IS COUNTY ID to NAME FORMATTER
//********************************* */
export function CountyidtonameFormatter(params) {
    return params.value ? lookupCountyValue(params.value) : '';
}
//********************************* */
// COUNTY ID to NAME FORMATTER

//NUMBER FORMATTER
export function numberFormatter(params){
    return formatNumber(params.value);
}

function formatNumber(number) {
   // this puts commas into the number eg 1000 goes to 1,000,
   // i pulled this from stack overflow, i have no idea how it works
   return Math.floor(number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
//NUMBER FORMATTER

//BOOLEAN INSURED FORMATER FOR YES NO
export function insuredFormatter (params) {
    if(params.cellEditorparams){
        return params.cellEditorparams.values[1].value;
    }else{
        if(params.value == 1){
            return 'Yes';
        }else{
            return 'No';
        }
    }
    
}

//BOOLEAN INSURED FORMATER FOR YES NO

//EMPTY FORMATTER
//for Dynamic cases
export function EmptyFormatter(params) {
    return params.value ;
}
//EMPTY FORMATTER