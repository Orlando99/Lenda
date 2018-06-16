import { isNumber } from "util";

//Numeric cell editor config
export function getNumericCellEditor() {
    function isCharNumeric(charStr) {
      if(parseFloat(charStr)!=NaN)
      return true;
      else
      return false;
    }
    
    function isKeyPressedNumeric(event) {
      
      var charCode = getCharCodeFromEvent(event);
      var charStr = String.fromCharCode(charCode);
      return isCharNumeric(charStr);
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
      this.eInput.value = params.value;
      var that = this;
      this.eInput.addEventListener("input", function (event) {
        
        if (parseFloat(event.srcElement.value)!=NaN) {
          if(event.srcElement.value.indexOf('.') > -1 && parseFloat(event.srcElement.value).toString().indexOf('.') <=-1)
          event.srcElement.value=parseFloat(event.srcElement.value)+'.';
          else{
            event.srcElement.value=parseFloat(event.srcElement.value);
          }
          that.eInput.focus();
          if (event.preventDefault) event.preventDefault();
        }
        else{
          
          event.srcElement.value=0;
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
      return this.eInput.value;
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
    if(params.newValue==undefined || params.newValue==null)
    params.newValue=0;
    var data=parseFloat(params.newValue);
    params.data[params.colDef.field]=data;
    return true;
  }
  
  //Numeric cell editor config Ends