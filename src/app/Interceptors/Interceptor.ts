import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudOperationsService } from '../services/crud-operations.service';


@Injectable()
export class HttpCalIInterceptor implements HttpInterceptor {
    constructor(private injector: Injector,private crudOperationsService: CrudOperationsService) {}


    public contentType:any='application/json';
    

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {        
        console.log('Intercepted request' + request.url);
        const token =localStorage.getItem('token');
       // const campusname=localStorage.getItem('campusName');
       // const tenentId=localStorage.getItem('tenentId');

        if(localStorage.getItem('token') !== "" && localStorage.getItem('type') == "" ){
          this.contentType=this.crudOperationsService.header;
             let httpHeaders = new HttpHeaders({
                
                 //'content-type' :this.contentType,
               //  'Accept': 'application/pdf',
                 'Authorization':  'Bearer ' +localStorage.getItem('token')
    
               });
              
             // let httpHeaders = new HttpHeaders({'content-type' : 'application/json'}); 
             let authreq=request.clone({ headers: httpHeaders});
    
            console.log('auth req1',authreq);
            return next.handle(authreq);
           
        }else if(localStorage.getItem('type') == "pdf"){
          let httpHeaders = new HttpHeaders({
                
            'content-type' : 'application/json',
            'Accept': 'application/pdf',
            'Authorization':  'Bearer ' +localStorage.getItem('token')

          });
         
        // let httpHeaders = new HttpHeaders({'content-type' : 'application/json'}); 
        let authreq=request.clone({ headers: httpHeaders});

       console.log('auth req1',authreq);
       return next.handle(authreq);  
           
        }else{
          //alert("not secure");
            let httpHeaders = new HttpHeaders({});  
             let authreq=request.clone({ headers: httpHeaders});
    
            console.log('auth req1',authreq);
            return next.handle(authreq);   
        }

    }
}