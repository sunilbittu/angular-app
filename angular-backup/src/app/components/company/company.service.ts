import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  
  private COMPANY_BASE_URL = environment.BASE_URL + 'company';
  private COMPANY_LOGO_BASE_URL = environment.BASE_URL + 'companylogo';
  private COMPANY_DOCUMENT_BASE_URL = environment.BASE_URL + 'companydocument';
  private COMPANY_SETTING_BASE_URL = environment.BASE_URL + 'companyconfiguration';
  private COMPANY_ADV_SETTING_BASE_URL = environment.BASE_URL + 'companyconfigurations1';
  
  constructor(public http: HttpClient) { }

  fetchCompanies(search: any) {
    return this.http.get(this.COMPANY_BASE_URL + '/list?search='+search);
  }
  uploadLogoPath(formData: any) {
    let options =  {headers: new  HttpHeaders({ })};
    const path = '/abc';
    return this.http.post(this.COMPANY_LOGO_BASE_URL + '/upload-logo',formData, options);
  }

  updateLogoPath(formData: any) {
    let options =  {headers: new  HttpHeaders({ })};
    const path = '/abc';
    return this.http.post(this.COMPANY_LOGO_BASE_URL + `/update-logo`,formData, options);
  }

  fetchCompaniesLogo(id: any) {
    return this.http.get(this.COMPANY_LOGO_BASE_URL + `/dropdownList_other/${id}`);
  }

  saveDocument(formData: any) {
    let options =  {headers: new  HttpHeaders({ })};
    return this.http.post(this.COMPANY_DOCUMENT_BASE_URL + '/save',formData, options);
  }

  fetchDocuments(id: any) {
    return this.http.get(this.COMPANY_DOCUMENT_BASE_URL + `/list-by/${id}`);
  }

  saveAdvSetting(formData: any) {
    let options =  {headers: new  HttpHeaders({ })};
    return this.http.post(this.COMPANY_ADV_SETTING_BASE_URL, formData, options);
  }
  updateAdvSetting(id: number, formData: any) {
    let options =  {headers: new  HttpHeaders({ })};
    return this.http.put(this.COMPANY_ADV_SETTING_BASE_URL+ `/${id}`, formData, options);
  }
  fetchAdvSetting(id: any) {
    return this.http.get(this.COMPANY_ADV_SETTING_BASE_URL + `/list-by/${id}`);
  }
}
