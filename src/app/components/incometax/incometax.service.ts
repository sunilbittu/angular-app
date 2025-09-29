import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncometaxService {

  constructor(public http: HttpClient) { }
  private TDS_YEAR_BASE_URL = environment.BASE_URL + 'tdsyear';
  private TAX_PROJECTION_BASE_URL = environment.BASE_URL + 'taxprojection';
  private EMPLOYEE_INVESTMENT_BASE_URL = environment.BASE_URL + 'employeeinvestment';

  // TDS Year
  fetchTdsYear(companyId: any) {
    return this.http.get(this.TDS_YEAR_BASE_URL + `/list-by/${companyId}`)
  }
  saveTdsYear(value: any) {
    return this.http.post(this.TDS_YEAR_BASE_URL, value);
  }
  updateTdsYear(id: number, value: any) {
    return this.http.put(this.TDS_YEAR_BASE_URL + `/${id}`, value)
  }

  calculateTaxProjection(companyId: any, formObj: any) {
    return this.http.post(this.TAX_PROJECTION_BASE_URL + `/tax-calculation/${companyId}`, formObj);
  }

  public getEmployeesByFilter(filterObj: any) {
    return this.http.post(this.TAX_PROJECTION_BASE_URL + "/employee_investment_filter_list", filterObj);
  }

  saveTds(value: any, month: number) {
    return this.http.post(this.TAX_PROJECTION_BASE_URL + "/tds-save?month=" + month, value);
  }

  fetchTaxProjections(companyId: any) {
    return this.http.get(this.TAX_PROJECTION_BASE_URL + `/list/${companyId}`)
  }
}
