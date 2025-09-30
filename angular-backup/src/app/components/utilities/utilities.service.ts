import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  private SALARY_BASE_URL = environment.BASE_URL + 'salarycomponentmaster';
  private CTC_BASE_URL = environment.BASE_URL + 'ctccomponent';
  private SALARY_MAPPING_BASE_URL = environment.BASE_URL + 'salarymapping';
  private DEPARTMENT_BASE_URL = environment.BASE_URL + 'department';

  constructor(public http: HttpClient) { }

  saveSalaryComponent(formData: any) {
    return this.http.post(this.SALARY_BASE_URL, formData);
  }

  fetchSalaryComponent(id: any) {
    return this.http.get(this.SALARY_BASE_URL + `/list-by/${id}`);
  }

  updateSalaryComponent(formData: any, id: number) {
    return this.http.put(this.SALARY_BASE_URL + `/${id}`, formData);
  }

  saveCtcComponent(formData: any) {
    return this.http.post(this.CTC_BASE_URL, formData);
  }

  fetchCtcComponent(id: any) {
    return this.http.get(this.CTC_BASE_URL + `/list-by/${id}`);
  }

  updateCtcComponent(formData: any, id: number) {
    return this.http.put(this.CTC_BASE_URL + `/${id}`, formData);
  }

  saveSalaryMapping(formData: any) {
    return this.http.post(this.SALARY_MAPPING_BASE_URL, formData);
  }

  fetchSalaryMapping(id: any) {
    return this.http.get(this.SALARY_MAPPING_BASE_URL + `/list-by/${id}`);
  }

  updateSalaryMapping(formData: any, id: number) {
    return this.http.put(this.SALARY_MAPPING_BASE_URL + `/${id}`, formData);
  }

  fetchDepartmentsByBranch(id: any) {
    return this.http.get(this.DEPARTMENT_BASE_URL + `/dropdownList_other/${id}`);
  }
}
