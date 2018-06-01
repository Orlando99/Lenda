import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { Observable } from 'rxjs/Observable';
import { ResponseModel } from '../../models/resmodels/reponse.model';

@Injectable()
export class NamingConventionapiService {

  constructor(private apiservice: ApiService) { }

  getNamingConventionList(): Observable<ResponseModel> {
        const route = '/api/NamingConvention/GetNamingConvention';
        return this.apiservice.get(route).map(res => res);
    }

    addEditNamingConvention(params): Observable<ResponseModel> {
        const route = '/api/NamingConvention/AddEditNamingConvention';
        return this.apiservice.post(route, params).map(res => res);
    }

    deleteNamingConvention(params): Observable<ResponseModel> {
        const route = 'api/NamingConvention/DeleteNamingConvention?id='+params;
        return this.apiservice.delete(route).map(res => res);
    }

}
