export function PriceFormatter(price) {
    if(price==null || price==undefined)
    {
        return "$ 0";
    }
    else
return "$ "+price.toString();
}
export function PercentageFormatter(perce) {
    if(perce==null || perce==undefined)
    {
        return  "0 %";
    }
    else
return perce.toString() +" %";
}