import { isNumber } from "util";

//Numeric cell editor config
export function getTextCellEditor() {
    function isCharNumeric(charStr) {      
      return !!/\d/.test(charStr);     
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
    function TextCellEditor() { }
    TextCellEditor.prototype.init = function (params) {
      this.focusAfterAttached = params.cellStartedEdit;
      this.eInput = document.createElement("input");
      this.eInput.style.width = "100%";
      this.eInput.style.height = "100%";
      
      this.eInput.value = isCharNumeric(params.charPress) ? params.charPress : params.value;
      var that = this;
      this.eInput.addEventListener("keypress", function(event) {        
        //this.eInput
        //this.eInput.addClass('lenda-cellEdit-color')
        this.classList.remove("error");
        if (!isKeyPressedNumeric(event)) {
          that.eInput.focus();
          if (event.preventDefault) event.preventDefault();
        }
      });

    this.eInput.addEventListener("blur", function(event) {
        
         if(params.newValue==undefined || params.newValue==null||params.newValue=="") { 
          //return          this.classList.add("error");
         }
         //this.eInput
         //this.eInput.addClass('lenda-cellEdit-color')
         
       });
    };
    TextCellEditor.prototype.getGui = function () {
      return this.eInput;
    };
    TextCellEditor.prototype.afterGuiAttached = function () {
      if (this.focusAfterAttached) {
        this.eInput.focus();
        this.eInput.select();
      }
    };
    TextCellEditor.prototype.isCancelBeforeStart = function () {
      return this.cancelBeforeStart;
    };
    TextCellEditor.prototype.isCancelAfterEnd = function () { };
    TextCellEditor.prototype.getValue = function () {
      return this.eInput.value;
    };
    TextCellEditor.prototype.focusIn = function () {
      var eInput = this.getGui();
      eInput.focus();
      eInput.select();
      console.log("TextCellEditor.focusIn()");
    };
    TextCellEditor.prototype.focusOut = function () {
      console.log("TextCellEditor.focusOut()");
    };
    return TextCellEditor;
  }
  
export function textValueSetter(params) {
  debugger
    //this.localStorage.setItem('oldcolValue', params.oldValue);
    if(params.newValue==undefined || params.newValue==null||params.newValue=="")      
    
    params.newValue=0;    
    var data=parseFloat(params.newValue);
    params.data[params.colDef.field]=data;
    return true;
  }
  
  
  //Numeric cell editor config Ends