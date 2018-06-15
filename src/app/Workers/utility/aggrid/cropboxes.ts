import { isNumber } from "util";

// States


export function extractCropValues(mappings) {

    var obj = [];
    mappings.forEach((element,index) => {

        if(obj.findIndex(p=>p.key==element.Crop_Code)==-1)
        obj[obj.length] = {key:element.Crop_Code,value:element.Crop_Name}
    });
    return obj;
}

export function lookupCropValue(mappings, key) {

    return mappings.find(p=>p.key.toLowerCase()==key.toLowerCase()).value;
}

export function Cropvaluesetter(params) {

    var crop = params.newValue;
    var values = params.colDef.cellEditorParams.values;
    for (let object of values) {
        var value = object.key;
        if (value == params.newValue) {
            params.data[params.colDef.field] = crop;
        }
    }
    return true;
}
// Ends Here

// County

export function extractCropTypeValues(mappings) {

    var obj = [];
    mappings.forEach((element,index) => {

        if(obj.findIndex(p=>p.key==element.Crop_Type_Code)==-1)
        obj[obj.length] = {key:element.Crop_Type_Code,value:element.Crop_Type_Name}
    });
    return obj;
}

export function lookupCropTypeValue(key) {
    debugger
    key=key.trim();
    var refdata = JSON.parse('[' + window.localStorage.getItem("ng2-webstorage|refdata") + ']')[0];
    if (key != undefined && key != "") {
            return refdata.CropList.find(p => p.Crop_Type_Code == key).Crop_Type_Name;
    }
}


export function CropTypevaluesetter(params) {
    var refdata = JSON.parse('[' + window.localStorage.getItem("ng2-webstorage|refdata") + ']')[0];
    var county = params.newValue;
    var values = refdata.CropList;
    for (let object of values) {
        var value = object.Crop_Type_Code;
        if (value == params.newValue) {
            params.data[params.colDef.field] =  object.Crop_Type_Code;
        }
    }
    return true;
}

export function getfilteredCropType(params) {

    var refdata = JSON.parse('[' + window.localStorage.getItem("ng2-webstorage|refdata") + ']')[0];
    var selectedcrop = params.data.Crop_Code;
    var allowedcroptypes = refdata.CropList.filter(p => p.Crop_Code == selectedcrop);
    return { values: extractCropTypeValues(allowedcroptypes) };
}
 // Ends Here
