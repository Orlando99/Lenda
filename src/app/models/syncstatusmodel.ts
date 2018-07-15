
export enum status{
    NOCHANGE = 0,
    EDITED = 1,
    ADDORDELETE = 2,
}
export interface ModelStatus {
    Status_Farm : status;
    Status_Crop_Practice : status;
    Status_Insurance_Policies:status
}

