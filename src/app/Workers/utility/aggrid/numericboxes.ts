import { isNumber } from "util";


//Numeric cell editor config
export function getNumericCellEditor() {
    function isCharNumeric(charStr) {
      // return !!/\d/.test(charStr);
      //for decimals
      return /^\d*\.?\d*$/.test(charStr);

    }
    function isCharDot(charStr) {
      
      return charStr === '.';
    
    }
    
    function isKeyPressedNumeric(event) {

      var charCode = getCharCodeFromEvent(event);
      var charStr = String.fromCharCode(charCode);
      return isCharNumeric(charStr);
    }

    function isKeyPressedDot(event) {
      
      var charCode = getCharCodeFromEvent(event);
      var charStr = String.fromCharCode(charCode);
      return isCharDot(charStr);
    }
    function getCharCodeFromEvent(event) {
      event = event || window.event;
      return typeof event.which === "undefined" ? event.keyCode : event.which;
    }
    function NumericCellEditor() { }
    NumericCellEditor.prototype.init = function (params) {

      this.focusAfterAttached = params.cellStartedEdit;
      this.eInput = document.createElement("input");
      this.eInput.style.width = "100%";
      this.eInput.style.height = "100%";
      this.eInput.addEventListener("change", function(event) {

        event.srcElement.parentElement.className=event.srcElement.parentElement.className.replace("editable-color","edited-color")
      });
      // this.eInput.value = params.value;
      // var that = this;
      // this.eInput.addEventListener("input", function (event) {

      //   //if (parseFloat(event.srcElement.value)!=NaN) {
      //     if (isCharNumeric(event.srcElement.value)) {
      //     if(event.srcElement.value.indexOf('.') > -1 && parseFloat(event.srcElement.value).toString().indexOf('.') <=-1)
      //     event.srcElement.value=parseFloat(event.srcElement.value)+'.';
      //     else{
      //       event.srcElement.value=parseFloat(event.srcElement.value);
      //     }
      //     that.eInput.focus();
      //     if (event.preventDefault) event.preventDefault();
      //   }
      //   else{

      //    // event.srcElement.value=0;
      //   }
      // });

      this.eInput.value = (isCharNumeric(params.charPress) ? params.charPress : params.value)==undefined ?0:(isCharNumeric(params.charPress) ? params.charPress : params.value);
      var that = this;
      this.eInput.addEventListener("keypress", function(event) {

        //this.eInput
        //this.eInput.addClass('lenda-cellEdit-color')
        if (!isKeyPressedNumeric(event) && !isKeyPressedDot(event)) {
          that.eInput.focus();
          if (event.preventDefault) event.preventDefault();
        }
      });
      this.eInput.addEventListener("blur", function(event) {

        if(params.newValue==undefined || params.newValue==null||params.newValue=="") {

         return this.classList.add("error");

        }
        //this.eInput
        //this.eInput.addClass('lenda-cellEdit-color')

      });
    };
    NumericCellEditor.prototype.getGui = function () {
      return this.eInput;
    };
    NumericCellEditor.prototype.afterGuiAttached = function () {
      if (this.focusAfterAttached) {
        this.eInput.focus();
        this.eInput.select();
      }
    };
    NumericCellEditor.prototype.isCancelBeforeStart = function () {
      return this.cancelBeforeStart;
    };
    NumericCellEditor.prototype.isCancelAfterEnd = function () { };
    NumericCellEditor.prototype.getValue = function () {
      
      return this.eInput.value==""?0:this.eInput.value;
    };
    NumericCellEditor.prototype.focusIn = function () {
      var eInput = this.getGui();
      eInput.focus();
      eInput.select();
      console.log("NumericCellEditor.focusIn()");
    };
    NumericCellEditor.prototype.focusOut = function () {
      console.log("NumericCellEditor.focusOut()");
    };
    return NumericCellEditor;
  }

  export function numberValueSetter(params) {
     
    if(params.newValue==undefined || params.newValue==null||params.newValue==""){
      params.newValue=0;
    }else{
      var data=parseFloat(params.newValue);
      params.data[params.colDef.field]=data;
    }
    
    return true;
  }

export function numberWithOneDecPrecValueSetter(params) {
    if(params.newValue==undefined || params.newValue==null||params.newValue=="")         
    params.newValue=0;    
    var data=parseFloat(params.newValue);
    data = parseFloat(data.toFixed(1));
    params.data[params.colDef.field]=data;
    return true;
  }

export function yieldValueSetter(params) {
  if(!params.newValue || params.newValue == 0){
    params.newValue=null;
    params.data[params.colDef.field]=data;
  }else{
    var data=parseFloat(params.newValue);
    params.data[params.colDef.field]=data;
  }
  
  return params.newValue;
}


export function formatPhoneNumber(params) {
  var val = (""+params.value).replace(/\D/g, '');
  var num = val.match(/^(\d{3})(\d{3})(\d{4})$/);
  return (!num) ? null : "(" + num[1] + ") " + num[2] + "-" + num[3];
}

export function getPhoneCellEditor() {
  debugger
  function isCharNumeric(charStr) {
    return !!/\d/.test(charStr);
  }
  
  function isKeyPressedNumeric(event) {

    var charCode = getCharCodeFromEvent(event);
    var charStr = String.fromCharCode(charCode);
    console.log('charStr', charStr);
    return isCharNumeric(charStr) && event.srcElement.value.length <= 9;
  }

  function getCharCodeFromEvent(event) {
    event = event || window.event;
    return typeof event.which === "undefined" ? event.keyCode : event.which;
  }
  function NumericCellEditor() { }

  NumericCellEditor.prototype.init = function (params) {
    this.focusAfterAttached = params.cellStartedEdit;
    this.eInput = document.createElement("input");
    this.eInput.style.width = "100%";
    this.eInput.style.height = "100%";
    this.eInput.addEventListener("change", function(event) {
      event.srcElement.parentElement.className=event.srcElement.parentElement.className.replace("editable-color","edited-color")
    });

    this.eInput.value = (isCharNumeric(params.charPress) ? params.charPress : params.value)==undefined ?0:(isCharNumeric(params.charPress) ? params.charPress : params.value);
    var that = this;
    this.eInput.addEventListener("keypress", function(event) {
      if ((!isKeyPressedNumeric(event))) {
        that.eInput.focus();
        if (event.preventDefault) event.preventDefault();
      }
    });
    this.eInput.addEventListener("blur", function(event) {

      if(params.newValue==undefined || params.newValue==null||params.newValue=="") {
        return this.classList.add("error");
      }
    });
  };
  NumericCellEditor.prototype.getGui = function () {
    return this.eInput;
  };
  NumericCellEditor.prototype.afterGuiAttached = function () {
    if (this.focusAfterAttached) {
      this.eInput.focus();
      this.eInput.select();
    }
  };
  NumericCellEditor.prototype.isCancelBeforeStart = function () {
    return this.cancelBeforeStart;
  };
  NumericCellEditor.prototype.isCancelAfterEnd = function () { };
  NumericCellEditor.prototype.getValue = function () {
    
    return this.eInput.value==""?0:this.eInput.value;
  };
  NumericCellEditor.prototype.focusIn = function () {
    var eInput = this.getGui();
    eInput.focus();
    eInput.select();
    console.log("NumericCellEditor.focusIn()");
  };
  NumericCellEditor.prototype.focusOut = function () {
    console.log("NumericCellEditor.focusOut()");
  };
  console.log('Numeric',NumericCellEditor);
  return NumericCellEditor;
}
  
 
  //Numeric cell editor config Ends
