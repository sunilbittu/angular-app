import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstantsComponent } from '../../constants/global-constants/global-constants.component';
import { userResponce } from '../models/LoginResponce';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public global_URL:string = GlobalConstantsComponent.globalURL;


  constructor(private http : HttpClient) { }


  
  public authenticationLogin(Object:FormData):Observable<userResponce>{

    return this.http.post<userResponce>(this.global_URL+"user/login",Object);
    
  }

  validateUser(api: string) {
    return this.http.get(this.global_URL + api);
  }
}
