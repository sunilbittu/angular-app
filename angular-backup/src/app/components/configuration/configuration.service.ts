import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(public http: HttpClient) { }

  private COMPANY_BASE_URL = environment.BASE_URL + 'company';
  private COUNTRY_BASE_URL = environment.BASE_URL + 'country';
  private STATE_BASE_URL = environment.BASE_URL + 'state';
  private CITY_BASE_URL = environment.BASE_URL + 'city';
  private NATIONALITY_BASE_URL = environment.BASE_URL + 'nationality';
  private RELIGION_BASE_URL = environment.BASE_URL + 'religion';
  private RACE_BASE_URL = environment.BASE_URL + 'race';
  private FINANCIAL_YEAR_BASE_URL = environment.BASE_URL + 'financialyear';
  private SOURCE_CHANNEL_BASE_URL = environment.BASE_URL + 'sourcechannel';
  

  saveCompany(value: any) {
    return this.http.post(this.COMPANY_BASE_URL, value);
  }
  
  //Country

  createCountry(value:any) {
    return this.http.post(this.COUNTRY_BASE_URL , value);
  }
 
  fetchCountries() {
    return this.http.get(this.COUNTRY_BASE_URL + '/list?search='+''+'&page=&size=10');
  }

  
  updateCountry(id:number , value:any) {
    return this.http.put(this.COUNTRY_BASE_URL +`/${id}` ,value);
  }

  deleteCountry(id:number){
    return this.http.delete(this.COUNTRY_BASE_URL+ `/${id}`)
  }

   // States


   createState(value:any) {
    return this.http.post(this.STATE_BASE_URL , value);
  }

  fetchStates(id: any) {
    return this.http.get(this.STATE_BASE_URL + `/dropdownList_other/${id}`);
  }

  fetchAllStates(search: any,pageNumber:Number = 0){
    return this.http.get(this.STATE_BASE_URL + '/list?search='+search+'&page='+pageNumber+'&size=10');
  }


  updateState(id:number , value:any) {
    return this.http.put(this.STATE_BASE_URL +`/${id}` ,value);
  }

  deleteState(id:number){
    return this.http.delete(this.STATE_BASE_URL+ `/${id}`)
  }

 


  // Cities

  createCity(value:any) {
    return this.http.post(this.CITY_BASE_URL , value);
  }

  fetchCities(id: any) {
    return this.http.get(this.CITY_BASE_URL + `/dropdownList_other/${id}`);
  }

  fetchAllCities(search: any,pageNumber:Number = 0){
    return this.http.get(this.CITY_BASE_URL + '/list?search='+search+'&page='+pageNumber+'&size=10');
  }



  updateCity(id:number , value:any) {
    return this.http.put(this.CITY_BASE_URL +`/${id}` ,value);
  }

  deleteCity(id:number){
    return this.http.delete(this.CITY_BASE_URL+ `/${id}`)
  }


  

  // Companies

  fetchCompanyById(id: any) {
    return this.http.get(this.COMPANY_BASE_URL + `/${id}`);
  }

  fetchCompanies(search: any) {
    return this.http.get(this.COMPANY_BASE_URL + '/list?search='+search);
  }

  updateCompany(id: number, value: any) {
    return this.http.put(this.COMPANY_BASE_URL + `/${id}`, value);
  }

  //Nationality

  createNationality(value:any){
    return this.http.post(this.NATIONALITY_BASE_URL, value);
    }
    
  fetchNationalites(){
    return this.http.get(this.NATIONALITY_BASE_URL + '/list/?search='+''+'&page=&size=10');
    }
 
  updateNationality(id: number, value: any){
    return this.http.put(this.NATIONALITY_BASE_URL + `/${id}`, value)
  }

  deleteNationality(id:number ){
    return this.http.delete(this.NATIONALITY_BASE_URL+ `/${id}`)
  }

  //NotificationSettings

  updateNotificationSettings(value:any){
    return this.http.post(environment.BASE_URL+"notification/updateNotificationSettings", value);
    }

    fetchNotificationSettings(){
      return this.http.get(environment.BASE_URL + 'notification/getAllNotificationSettings');
      }

  // Race

  createRace(value:any){
    return this.http.post(this.RACE_BASE_URL, value);
    }
    
  fetchRace(){
    return this.http.get(this.RACE_BASE_URL + '/list?search='+''+'&page=&size=10');
    }
 
  updateRace(id: number, value: any){
    return this.http.put(this.RACE_BASE_URL + `/${id}`, value)
  }

  deleteRace(id:number ){
    return this.http.delete(this.RACE_BASE_URL+ `/${id}`)
  }

  // Religion
  createReligion(value:any){
    return this.http.post(this.RELIGION_BASE_URL, value);
    }
    
  fetchReligion(){
    return this.http.get(this.RELIGION_BASE_URL + '/list?search='+''+'&page=&size=10');
    }
 
  updateReligion(id: number, value: any){
    return this.http.put(this.RELIGION_BASE_URL + `/${id}`, value)
  }

  deleteReligion(id:number ){
    return this.http.delete(this.RELIGION_BASE_URL+ `/${id}`)
  }

  // Financial Year
  fetchFinancialYear(companyId: any) {
    return this.http.get(this.FINANCIAL_YEAR_BASE_URL+ `/list-by/${companyId}`)
  }
  saveFinancialYear(value:any){
    return this.http.post(this.FINANCIAL_YEAR_BASE_URL, value);
  }
  updateFinancialYear(value: any, id: number){
    return this.http.put(this.FINANCIAL_YEAR_BASE_URL + `/${id}`, value)
  }

  saveSourceChannel(value:any){
    return this.http.post(this.SOURCE_CHANNEL_BASE_URL, value);
  }
  updateSourceChannel(value: any, id: number){
    return this.http.put(this.SOURCE_CHANNEL_BASE_URL + `/${id}`, value)
  }
}
