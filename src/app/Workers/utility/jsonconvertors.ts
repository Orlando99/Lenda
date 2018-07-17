import { JsonProperty, JsonObject, JsonConverter, JsonCustomConvert } from "json2typescript";

@JsonConverter
export class StringConverter implements JsonCustomConvert<String> {
    serialize(value:string): any {
        return value;
    }
    deserialize(value: any): string {
        if(value==undefined || value==null){
            return "";
        }
        else{
            return value.toString();
        }
    }
}

@JsonConverter
export class ArrayConverter implements JsonCustomConvert<Array<any>> {
    serialize(value:Array<any>): any {
        
        return value;
    }
    deserialize(value: any): Array<any> {
     
        if(value==undefined || value==null){
            return new Array<any>();
        }
        else{
            return value;
        }
    }
}
@JsonConverter
export class IntConverter implements JsonCustomConvert<number> {
    serialize(value:number): any {
        return value;
    }
    deserialize(value: any): number {
        if(value==undefined || value==null){
            return 0;
        }
        else{
            return parseFloat(value);
        }
    }
}
