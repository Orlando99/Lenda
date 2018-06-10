import { isNumber } from "util";

// States

var refdata = JSON.parse('[' + window.localStorage.getItem("ng2-webstorage|refdata") + ']')[0];
export function extractStateValues(mappings) {
    var obj = [];
    mappings.forEach(element => {
        obj[element.State_ID] = element.State_Abbrev;
    });
    return obj;
}

export function lookupStateValue(mappings, key) {

    return mappings[key];
}

export function Statevaluesetter(params) {

    var state = params.newValue;
    var values = params.colDef.cellEditorParams.values;
    for (var key in values) {
        var value = values[key];
        if (value == params.newValue) {
            params.data[params.colDef.field] = parseInt(key);
        }
    }
    return true;
}
// Ends Here   

// County

export function extractCountyValues(mappings) {
    debugger
    var obj = [];
    mappings.forEach(element => {
        obj[element.County_ID] = element.County_Name;
    });
    debugger
    return obj;
}

export function lookupCountyValue(key) {
    if (key != undefined && key != "") {
        if (isNumber(key))
            return refdata.CountyList.find(p => p.County_ID == key).County_Name;
        else {

        }
    }
}

export function Countyvaluesetter(params) {
    var county = params.newValue;
    var values = refdata.CountyList;
    for (var key in values) {
        var value = values[key].County_Name;
        if (value == params.newValue) {
            params.data[params.colDef.field] = parseInt(values[key].County_ID);
        }
    }
    return true;
}

export function getfilteredcounties(params) {

    var selectedstate = params.data.Farm_State_ID;
    var allowedCounties = refdata.CountyList.filter(p => p.State_ID == selectedstate);
    return { values: extractCountyValues(allowedCounties) };
}
 // Ends Here   