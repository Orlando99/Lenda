import { isNumber } from "util";


//Numeric cell editor config
export function getAlphaNumericCellEditor() {
    function isCharAlphaNumeric(charStr) {
     
      //for alphaNumeric
      return /^[a-z0-9 ]+$/i.test(charStr);
    
    }
   
    function isKeyPressedAlphaNumeric(event) {
      
      var charCode = getCharCodeFromEvent(event);
      var charStr = String.fromCharCode(charCode);
      return isCharAlphaNumeric(charStr);
    }

    function getCharCodeFromEvent(event) {
      event = event || window.event;
      return typeof event.which === "undefined" ? event.keyCode : event.which;
    }
    function AlphaNumericCellEditor() { }
    AlphaNumericCellEditor.prototype.init = function (params) {
      
      this.focusAfterAttached = params.cellStartedEdit;
      this.eInput = document.createElement("input");
      this.eInput.style.width = "100%";
      this.eInput.style.height = "100%";

      this.eInput.addEventListener("change", function(event) {
        event.srcElement.parentElement.className=event.srcElement.parentElement.className.replace("editable-color","edited-color")
      });
     debugger;
      this.eInput.value = (params.charPress && isCharAlphaNumeric(params.charPress)) ? params.charPress : params.value;
      var that = this;

      this.eInput.addEventListener("keypress", function(event) {
        if (!isKeyPressedAlphaNumeric(event)) {
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
    AlphaNumericCellEditor.prototype.getGui = function () {
      return this.eInput;
    };
    AlphaNumericCellEditor.prototype.afterGuiAttached = function () {
      if (this.focusAfterAttached) {
        this.eInput.focus();
        this.eInput.select();
      }
    };
    AlphaNumericCellEditor.prototype.isCancelBeforeStart = function () {
      return this.cancelBeforeStart;
    };
    AlphaNumericCellEditor.prototype.isCancelAfterEnd = function () { };
    AlphaNumericCellEditor.prototype.getValue = function () {
      return this.eInput.value;
    };
    AlphaNumericCellEditor.prototype.focusIn = function () {
      var eInput = this.getGui();
      eInput.focus();
      eInput.select();
      console.log("AlphaNumericCellEditor.focusIn()");
    };
    AlphaNumericCellEditor.prototype.focusOut = function () {
      console.log("AlphaNumericCellEditor.focusOut()");
    };
    return AlphaNumericCellEditor;
  }
  
// export function numberValueSetter(params) {
//   
//     if(params.newValue==undefined || params.newValue==null||params.newValue=="")         
//     params.newValue=0;    
//     var data=parseFloat(params.newValue);
//     params.data[params.colDef.field]=data;
//     return true;
//   }

//   export function numberWithOneDecPrecValueSetter(params) {
//     
//       if(params.newValue==undefined || params.newValue==null||params.newValue=="")         
//       params.newValue=0;    
//       var data=parseFloat(params.newValue);
//       data =  Math.round( data * 10 ) / 10;
//       params.data[params.colDef.field]=data;
//       return true;
//     }
  
  
  //Numeric cell editor config Ends