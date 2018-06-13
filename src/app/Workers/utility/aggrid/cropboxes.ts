import { isNumber } from "util";

// States


export function extractCropValues(mappings) {
    debugger
    var obj = [];
    mappings.forEach((element,index) => {
        if(obj.findIndex(p=>p.key==element.Crop_Code)==-1)
        obj[obj.length] = {key:element.Crop_Code,value:element.Crop_Name}
    });
    return obj;
}

export function lookupCropValue(mappings, key) {
debugger
    return mappings.find(p=>p.key.toLowerCase()==key.toLowerCase()).value;
}

export function Cropvaluesetter(params) {
debugger
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

export function extractCropTypeValues(mappings) {
    debugger
    var obj = [];
    mappings.forEach(element => {
        obj[element.County_ID] = element.County_Name;
    });
    debugger
    return obj;
}

export function lookupCropTypeValue(key) {
    var refdata = JSON.parse('[' + window.localStorage.getItem("ng2-webstorage|refdata") + ']')[0];
    if (key != undefined && key != "") {
        if (isNumber(key))
            return refdata.CountyList.find(p => p.County_ID == key).County_Name;
        else {

        }
    }
}


export function CropTypevaluesetter(params) {
    var refdata = JSON.parse('[' + window.localStorage.getItem("ng2-webstorage|refdata") + ']')[0];
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

export function getfilteredCropType(params) {
    var refdata = JSON.parse('[' + window.localStorage.getItem("ng2-webstorage|refdata") + ']')[0];
    var selectedstate = params.data.Farm_State_ID;
    var allowedCounties = refdata.CountyList.filter(p => p.State_ID == selectedstate);
    return { values: extractCropTypeValues(allowedCounties) };
}
 // Ends Here   