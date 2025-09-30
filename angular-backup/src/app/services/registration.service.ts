import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { GlobalConstantsComponent } from '../../constants/global-constants/global-constants.component';
import { countryList } from '../models/CountryList.mode';


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  public global_URL:string = GlobalConstantsComponent.globalURL;


  constructor(private http : HttpClient) { }


  //register organisation
  public registerOrganisation(Object:FormGroup){

    return this.http.post(this.global_URL+"org/register",Object);
    
  }


//getting country list
  public getCountryList():Observable<countryList[]>{

    return this.http.get<countryList[]>(this.global_URL+"master/countryList");
  }


  //getting states values based on country-id
  public getStatesListByCountryId(id:number){

    return this.http.get(this.global_URL+"master/stateDropDownList/"+id+"");
  }


   //getting cities values based on state-id
   public getCitiesListByStatesId(id:number){
    return this.http.get(this.global_URL+"master/cityDropDownList/"+id+"");
  }


  //check email exits/not
  public checkEmailExits(emailId: string){
    return this.http.get(this.global_URL+"org/email_verification?email="+emailId+"");
  }


  //check username exits/not
  public checkUsernameExits(username: string){
    return this.http.get(this.global_URL+"org/userName_verification?userName="+username+"");
  }


  //check Contactemail exits/not
  public checkContactEmailExits(contactEmail: string){
    return this.http.get(this.global_URL+"org/contactEmail_verification?contactEmail="+contactEmail+"");
  }

   //check Contactemail exits/not
   public checkContactNumberExits(contactNumber: string){
    return this.http.get(this.global_URL+"org/contactNumber_verification?contactNumber="+contactNumber+"");
  }

}
