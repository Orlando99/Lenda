import { isNumber } from "util";
export function lookupCountyValue(key) {
  var refdata = JSON.parse('[' + window.localStorage.getItem("ng2-webstorage|refdata") + ']')[0];
  if (key) {
  
      return refdata.CountyList.find(p => p.County_ID == parseInt(key)).County_Name;
    
  }
}
export function lookupStateRefValue(key) {
    var refdata = JSON.parse('[' + window.localStorage.getItem("ng2-webstorage|refdata") + ']')[0];
    if (key) {
    
        return refdata.StateList.find(p => p.State_ID == parseInt(key)).State_Name;
      
    }
  }
// States
//

export function extractStateValues(mappings) {
    var obj = [];
    mappings.forEach(element => {
        //obj[element.State_ID] = element.State_Abbrev;
        obj.push({key : element.State_ID,value : element.State_Abbrev})
    });
    return obj;
}

export function lookupStateValue(mappings, key) {
    if(key){
        let test = mappings.find(p=>p.key===key).value;
        return test
    }else{
        return mappings[0].value;
    }
    
}

export function Statevaluesetter(params) {

    params.data[params.colDef.field] = parseInt(params.newValue);
    // var state = params.newValue;
    // var values = params.colDef.cellEditorParams.values;
    // for (var key in values) {
    //     var value = values[key];
    //     if (value == params.newValue) {
    //         params.data[params.colDef.field] = parseInt(key);
    //     }
    // }
    return true;
}
// Ends Here

// County

export function extractCountyValues(mappings) {
    var obj = [];
    mappings.forEach(element => {
        //obj[element.County_ID] = element.County_Name;
        obj.push({key: element.County_ID, value : element.County_Name});
    });
    return obj;
}




export function Countyvaluesetter(params) {
    params.data[params.colDef.field] =params.newValue;
    // var refdata = JSON.parse('[' + window.localStorage.getItem("ng2-webstorage|refdata") + ']')[0];
    // var county = params.newValue;
    // var values = refdata.CountyList;
    // for (var key in values) {
    //     var value = values[key].County_Name;
    //     if (value == params.newValue) {
    //         params.data[params.colDef.field] = parseInt(values[key].County_ID);
    //     }
    // }
    return true;
}

export function getfilteredcounties(params) {
    var refdata = JSON.parse('[' + window.localStorage.getItem("ng2-webstorage|refdata") + ']')[0];
    var selectedstate = params.data.Farm_State_ID;
    var allowedCounties = refdata.CountyList.filter(p => p.State_ID == selectedstate);
    return { values: extractCountyValues(allowedCounties) };
}
 // Ends Here
