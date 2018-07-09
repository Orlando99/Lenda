
//Date cell editor config
export function getDateCellEditor() {
    function isCharDate(charStr) {
     
      //for alphaNumeric
      return /^[0-9\/]+$/i.test(charStr);
    
    }
   
    function isKeyPressedDate(event) {
      
      var charCode = getCharCodeFromEvent(event);
      var charStr = String.fromCharCode(charCode);
      return isCharDate(charStr);
    }

    function getCharCodeFromEvent(event) {
      event = event || window.event;
      return typeof event.which === "undefined" ? event.keyCode : event.which;
    }
    function DateCellEditor() { }
    DateCellEditor.prototype.init = function (params) {
      
      this.focusAfterAttached = params.cellStartedEdit;
      this.eInput = document.createElement("input");
      this.eInput.placeholder = "mm/dd/yyyy",
      this.eInput.style.width = "100%";
      this.eInput.style.height = "100%";

      this.eInput.addEventListener("change", function(event) {
          
        event.srcElement.parentElement.className=event.srcElement.parentElement.className.replace("editable-color","edited-color")
      });
     
      this.eInput.value = (params.charPress && isCharDate(params.charPress)) ? params.charPress : params.value;
      var that = this;

      this.eInput.addEventListener("keypress", function(event) {
        if (!isKeyPressedDate(event)) {
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
    DateCellEditor.prototype.getGui = function () {
      return this.eInput;
    };
    DateCellEditor.prototype.afterGuiAttached = function () {
      if (this.focusAfterAttached) {
        this.eInput.focus();
        this.eInput.select();
      }
    };
    DateCellEditor.prototype.isCancelBeforeStart = function () {
      return this.cancelBeforeStart;
    };
    DateCellEditor.prototype.isCancelAfterEnd = function () { };
    DateCellEditor.prototype.getValue = function () {
      return this.eInput.value;
    };
    DateCellEditor.prototype.focusIn = function () {
      var eInput = this.getGui();
      eInput.focus();
      eInput.select();
      console.log("DateCellEditor.focusIn()");
    };
    DateCellEditor.prototype.focusOut = function () {
      console.log("DateCellEditor.focusOut()");
    };
    return DateCellEditor;
  }

  export function getDateValue(params){
    let backendDateFormatRegEx = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/;
    let currentValue = params.data[params.column.colId];
    if(backendDateFormatRegEx.test(currentValue)){
        let date = new Date(currentValue);
        return { value : (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()};
    }else{
        return { value : currentValue};
    }
  }

  export function formatDateValue(params) {
    if(params.value){
      var date = new Date(params.value);
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
      
    }else{
      return '';
    }
    
  }
  