import { Injectable } from '@angular/core';
//import { Http} from '@angular/http';
// import {HttpClientModule} from '@angular'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
//import { Http, Response, Headers,RequestMethod, RequestOptions,ResponseContentType } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Sort} from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class CrudOperationsService {

  constructor(private http: HttpClient, private oldHttp: HttpClient, private sanitizer: DomSanitizer) { }
  public BASE_URL = environment.BASE_URL;
  public sortedData: any=[];
  getList(api: any) {
    return this.http.get(this.BASE_URL + api);
  }
  create(data: any, api: any) {
    return this.http.post(this.BASE_URL + api, data);
  }
  save(api: any) {
    return this.http.post(this.BASE_URL+ api , null );
  }
  update(data: any, api: any) {
    return this.http.put(this.BASE_URL + api, data);
  }
  updateList(data: any, api: any) {
    return this.http.put(this.BASE_URL + api, data);
  }
  updateStatus(api: any, data: any) {
    return this.http.put(this.BASE_URL + api, data);
  }
  delete(id: any) {
    return this.http.delete(this.BASE_URL + id);
  }
  delete2(id: any,api: any) {
    return this.http.delete(this.BASE_URL +api+ id);
  }
  fetchEmployeeList(data: any, api: any) {
    return this.http.post(this.BASE_URL + api, data);
  }
  getFilterData(data: any, api: any) {
    return this.http.post(this.BASE_URL + api, data);
  }
  getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(this.BASE_URL + imageUrl, { responseType: 'blob' });
  }
  addTeamMembers(employeeList: any, id: any) {
    let obj = { "employeeIds": employeeList, "id": id };
    return this.http.post(this.BASE_URL + "client/addTeamMembers", obj);
  }
  addTeamMembersToJob(employeeList: any, id: any) {
    let obj = { "employeeIds": employeeList, "id": id };
    return this.http.post(this.BASE_URL + "job/addTeamMembers", obj);
  }
  addClientTags(clientList: any, tags: any) {
    let obj = { "clientIds": clientList, "tags": tags };
    return this.http.post(this.BASE_URL + "client/addTags", obj);
  }
  addClientIndividualTags(clientId: any, tags: any) {
    let obj = { "clientId": clientId, "tags": tags };
    return this.http.post(this.BASE_URL + "client/addIndividualTags", obj);
  }
  clientArchive(clientList: any) {
    let obj = { "clientIds": clientList };
    return this.http.post(this.BASE_URL + "client/archive", obj);
  }
  candidateArchive(candidateIds: any) {
    let obj = { "candidateIds": candidateIds };
    return this.http.post(this.BASE_URL + "candidate/archive", obj);
  }
  addCandidateTags(candidateIds: any, tags: any) {
    let obj = { "candidateIds": candidateIds, "tags": tags };
    return this.http.post(this.BASE_URL + "candidate/addTags", obj);
  }
  addCandidateIndividualTags(candidateId: any, tags: any) {
    let obj = { "candidateId": candidateId, "tags": tags };
    return this.http.post(this.BASE_URL + "candidate/addIndividualTags", obj);
  }
  addJobTags(clientList: any, tags: any) {
    let obj = { "jobIds": clientList, "tags": tags };
    return this.http.post(this.BASE_URL + "job/addTags", obj);
  }
  jobArchive(clientList: any) {
    let obj = { "jobIds": clientList };
    return this.http.post(this.BASE_URL + "job/archive", obj);
  }
  addCandidateJobs(jobList: any, id: any) {
    return this.http.post(this.BASE_URL + "candidate/addJobs/"+id, jobList);
  }
  getPayslip(employeeList: any) {
    localStorage.setItem("type", "pdf");
    let payslipObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": sessionStorage.getItem("selectedPayslipMonth"), "employeeIds": employeeList };
    return this.oldHttp.post(this.BASE_URL + "reports/printPayslip", payslipObj, { responseType: 'blob' });
  }
  getPayslips(employeeList: any,months:any) {
    localStorage.setItem("type", "pdf");
    let payslipObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": months, "employeeIds": employeeList };
    return this.oldHttp.post(this.BASE_URL + "reports/printPayslip", payslipObj, { responseType: 'blob' });
  }

  savePayslip(employeeList: any,months:any) {
    let payslipObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": months, "employeeIds": employeeList };
    return this.http.post(this.BASE_URL + "reports/savePayslip", payslipObj);
  }

  deletePayslip(employeeList: any,months:any) {
    let payslipObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": months, "employeeIds": employeeList };
    return this.http.post(this.BASE_URL + "reports/deletePayslip", payslipObj);
  }

  saveAllowPayslip(employeeList: any) {
    let payslipObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": sessionStorage.getItem("selectedPayslipMonth"), "employeeIds": employeeList };
    return this.http.post(this.BASE_URL + "reports/savePayslipAllow", payslipObj);
  }

  viewGeneratedPayslip(employeeList: any,months:any) {
    let payslipObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": months, "employeeIds": employeeList };
    return this.http.post(this.BASE_URL + "reports/viewGeneratedPayslip", payslipObj);
  }
  viewGeneratedPayslipForAlow(employeeList: any) {
    let payslipObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": sessionStorage.getItem("selectedPayslipMonth"), "employeeIds": employeeList };
    return this.http.post(this.BASE_URL + "reports/viewGeneratedPayslip", payslipObj);
  }

  //document attachment file-uploade service
  public header: any = 'application/json';
  uploadeDocument(formData: any) {
    this.header = "";
    const HttpUploadOptions = {
      headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
    }
    return this.http.post(this.BASE_URL + `employeedocumentsattachmentdetail/saveDocument`, formData);
  }

  uploadeDocument1(url: any, formData: any) {
    this.header = "";
    const HttpUploadOptions = {
      headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
    }
    return this.http.post(this.BASE_URL + url, formData);
  }

  updateDocument(url: any, formData: any) {
    this.header = "";
    const HttpUploadOptions = {
      headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
    }
    return this.http.put(this.BASE_URL + url, formData);
  }
  //document attachment file-downloade service
  downloadeDocument(filePath: string): Observable<any> {

    return this.http.get(this.BASE_URL + 'employeedocumentsattachmentdetail/employeeAddDocdownload?filePath=' + filePath, { responseType: 'blob' });
  }


  getLoansByEmployee(employeeId: any,type: any) {
    return this.http.get(this.BASE_URL + "employeeloanadvance/employeeloanadvanceByEmployee?employeeId=" + employeeId + "&type="+type+"");
  }

  downloadDocument(api: string): Observable<any> {
    return this.http.get(this.BASE_URL + api, { responseType: 'blob' });
  }

  downloadDocumentExpenseReport(api: string,data:any): Observable<any> {
    return this.http.post(this.BASE_URL + api, data,{ responseType: 'blob' });
  }

  //pagination function
  getPaginationList(api: any, pageNumber: number) {
    return this.http.get(this.BASE_URL + api + "?page=" + pageNumber);
  }

  exportExcelReport(url: any, fileName: any) {
    return this.http.get(this.BASE_URL + url, { responseType: 'blob' }).pipe(map((data: any) => {
      console.log(data);
      let fileBlob = data;
      let blob = new Blob([fileBlob], {
        type: 'application/octet-stream' // must match the Accept type
      });

      let url = window.URL.createObjectURL(blob);
      this.sanitizer.bypassSecurityTrustUrl(url);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;

      anchor.click();
    })).subscribe((result: any) => {
    });
  }

  exportPDF(url: any, fileName: any) {
    return this.http.get(this.BASE_URL + url, { responseType: 'blob' }).pipe(map((data: any) => {
      let fileBlob = data;
      let blob = new Blob([fileBlob], {
        type: 'application/pdf' // must match the Accept type
      });
      let url = window.URL.createObjectURL(blob);
      this.sanitizer.bypassSecurityTrustUrl(url);
      const anchor = document.createElement('a');
      anchor.href = url;
      window.open(url, '_blank');
      anchor.download = fileName;

      anchor.click();
    })).subscribe((result: any) => {
    });
  } 

  exportExcelReport1(url: any, fileName: any,obj:any) {
    return this.http.post(this.BASE_URL + url,obj, { responseType: 'blob' }).pipe(map((data: any) => {
      console.log(data);
      let fileBlob = data;
      let blob = new Blob([fileBlob], {
        type: 'application/octet-stream' // must match the Accept type
      });

      let url = window.URL.createObjectURL(blob);
      this.sanitizer.bypassSecurityTrustUrl(url);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;

      anchor.click();
    })).subscribe((result: any) => {
    });
  }

  exportPDF1(url: any, fileName: any,obj:any) {
    return this.http.post(this.BASE_URL + url,obj, { responseType: 'blob' }).pipe(map((data: any) => {
      let fileBlob = data;
      let blob = new Blob([fileBlob], {
        type: 'application/pdf' // must match the Accept type
      });
      let url = window.URL.createObjectURL(blob);
      this.sanitizer.bypassSecurityTrustUrl(url);
      const anchor = document.createElement('a');
      anchor.href = url;
      window.open(url, '_blank');
      anchor.download = fileName;

      anchor.click();
    })).subscribe((result: any) => {
    });
  } 

  exportPDF2(url: any, fileName: any,data:any) {
    return this.http.post(this.BASE_URL + url,data, { responseType: 'blob' }).pipe(map((data: any) => {
      let fileBlob = data;
      let blob = new Blob([fileBlob], {
        type: 'application/pdf' // must match the Accept type
      });
      let url = window.URL.createObjectURL(blob);
      this.sanitizer.bypassSecurityTrustUrl(url);
      const anchor = document.createElement('a');
      anchor.href = url;
      window.open(url, '_blank');
      anchor.download = fileName;

      anchor.click();
    })).subscribe((result: any) => {
    });
  }

  exportExcelReport2(url: any, fileName: any,data:any) {
    return this.http.post(this.BASE_URL + url,data, { responseType: 'blob' }).pipe(map((data: any) => {
      console.log(data);
      let fileBlob = data;
      let blob = new Blob([fileBlob], {
        type: 'application/octet-stream' // must match the Accept type
      });

      let url = window.URL.createObjectURL(blob);
      this.sanitizer.bypassSecurityTrustUrl(url);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;

      anchor.click();
    })).subscribe((result: any) => {
    });
  }

  validate(api: any) {
    return this.http.get(this.BASE_URL + api);
  }

  updateData(url: any, formData: any) {
    this.header = "";
    const HttpUploadOptions = {
      headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
    }
    return this.http.put(this.BASE_URL + url, formData, HttpUploadOptions);
  }

  exportFile(api: string, data: any): Observable<any> {
    return this.http.post(this.BASE_URL + api, data, { responseType: 'blob' });
  }

  importFile(file: any, url: any) {
    this.header = "";
    const HttpUploadOptions = {
      headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
    }
    return this.http.post(this.BASE_URL + url, file, HttpUploadOptions);
  }

  compare(a: number | string |boolean, b: number | string | boolean, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  sortData(sort: Sort,sortData: any) {
    debugger
    const data = sortData.slice();

    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return this.sortedData;
    }
  

    this.sortedData = data.sort((a:any, b:any) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(a[sort.active], b[sort.active], isAsc);
        
    });

    return this.sortedData;
    
  }


}
