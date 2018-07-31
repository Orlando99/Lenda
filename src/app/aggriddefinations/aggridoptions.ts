export function setgriddefaults(gridapi:any,columnapi:any){
    
    toggletoolpanel(false,gridapi)
    removeHeaderMenu(gridapi);
    autoSizeAll(columnapi); //call in last always
    
}


export function autoSizeAll(gridColumnApi:any) {
  gridColumnApi.columnController.autoSizeAllColumns("contextMenu")
  }

export function toggletoolpanel(toggle:boolean,gridapi:any){
     var elem=gridapi.gridCore.eGridDiv;
     settoolpanelhidden(elem);
     
}  

function settoolpanelhidden(Ele){
  Ele.getElementsByClassName("ag-tool-panel")[0].style.display = "none";
}

export function removeHeaderMenu(gridapi:any){
  
var coldefs=gridapi.gridCore.gridOptions.columnDefs;
coldefs.forEach(function(column) {
  column.suppressMenu=true;
  column.suppressSorting=true;
});
gridapi.setColumnDefs(coldefs);
gridapi.gridCore.gridOptions.enableSorting=false;
}
  

