export function PriceFormatter(price) {
    
    if(price==null || price==undefined)
    {
        return "$ 0";
    }
    else
        return "$ "+price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
export function PercentageFormatter(perce) {
    
    if(perce==null || perce==undefined)
    {
        return  "0 %";
    }
    else
return perce.toFixed(2) +" %";
}


export function numberWithOneDecPrecValueFormatter(params) {
    
    if(params.value==undefined || params.value==null||params.value=="")         
    params.value=0;    
    var data=parseFloat(params.value);
    //return (Math.round( data * 10 ) / 10).toFixed(1);
    return data.toFixed(1);
  }
