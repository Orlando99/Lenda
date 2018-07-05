import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from '../../environments/environment.prod';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class ApiService {
    constructor(
        @Inject(Http) private http: Http,
        private router: Router,
        private toaster: ToastsManager,
        private localStorageService: LocalStorageService) { }

    //Amazon Upload Request Header To Make Upload Downloadable
    private setAwsHeaders(): Headers {
        const headersConfig = {
            'Content-Disposition': 'attachment',
        }
        return new Headers(headersConfig);
    };

    private setHeaders(): Headers {
        const headersConfig = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        if (this.localStorageService.retrieve("token")) {
            headersConfig['Authorization'] = this.localStorageService.retrieve("token");
        }
        headersConfig['batchid']="token1234";
        headersConfig['userid']="2";
        return new Headers(headersConfig);
    };
    private formatErrors(error: any) {
        // error=error.json()
        //this.toastr.error(error.Message, 'Error!');
        //let errorMsgStr: string = <string>(error.Message).toLowerCase();
        // if (errorMsgStr == "tokenexpired" || errorMsgStr == "nopermission" || errorMsgStr == "tokennotexist") {
        //   this.router.navigate(['/login']);
        // }
        // else{
        // return Observable.throw(error.json());
        // }
        return Observable.throw(error.json());
    }

    get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
        return this.http.get(`${environment.apiUrl}${path}`, { headers: this.setHeaders(), search: params }
        ).catch(this.formatErrors).map((res: Response) => { return res.json(); });
    }
    put(path: string, body: Object = {}): Observable<any> {
        return this.http.put(
            `${environment.apiUrl}${path}`,
            JSON.stringify(body),
            { headers: this.setHeaders() }
        )
            .catch(this.formatErrors)
            .map((res: Response) => res.json());
    }

    post(path: string, body: Object = {}): Observable<any> {
        return this.http.post(
            `${environment.apiUrl}${path}`,
            JSON.stringify(body),
            { headers: this.setHeaders() }
        )
            .catch(this.formatErrors)
            .map((res: Response) => res.json());
    }

    delete(path): Observable<any> {
        return this.http.delete(
            `${environment.apiUrl}${path}`,
            { headers: this.setHeaders() }
        )
            .catch(this.formatErrors)
            .map((res: Response) => res.json());
    }
}
