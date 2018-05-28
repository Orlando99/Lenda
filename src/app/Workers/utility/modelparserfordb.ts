export function modelparserfordb(obj:any):any{
    let retobj:any={};
    let props=Object.getOwnPropertyNames(obj);
    props.forEach(element => {
        if(element.indexOf("FC_")==-1)
        {
            retobj[element]=obj[element];
        }
    });
    return retobj;
}