export const Preferred_Contact_Ind_Options = [{
    key : '1',
    value : 'Phone'
},
{
    key : '2',
    value : 'Email'
},
{
    key : '3',
    value : 'Text'
},
{
    key : '4',
    value : 'Email & Text'
},
{
    key : '5',
    value : 'Mail'
}];

export function PreferredContactFormatter (params) {
    if(params.value){
        let matchedPrefContact = Preferred_Contact_Ind_Options.find(p=>p.key == params.value);
        return matchedPrefContact ? matchedPrefContact.value : '';
    }else{
        return '';
    }
    
}
