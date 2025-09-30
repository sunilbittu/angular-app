import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { employees } from 'src/app/models/Employee.model';
import { environment } from 'src/environments/environment';
import { GlobalConstantsComponent } from '../../../constants/global-constants/global-constants.component';
import { countryList } from '../../models/CountryList.mode';


@Injectable({
  providedIn: 'root'
})
export class AddEmployeeService {

  public global_URL: string = environment.BASE_URL;


  constructor(private http: HttpClient) { }


  //register Employee
  public addEmployee(Object: FormGroup) {

    return this.http.post(this.global_URL + "employee", Object);

  }



  //register Employee
  public updateEmployee(Object: FormGroup, id:number) {

    return this.http.post(this.global_URL + "employee/"+id, Object);

  }


  //get All Employees
  public getAllEmployees(id: number): Observable<employees[]> {
    return this.http.get<employees[]>(this.global_URL + 'employee/list_company/' + id + '')
  }


  //get EmployeeById
  public getEmployeeById(id: number) {
    return this.http.get(this.global_URL + "employee/" + id + "");
  }

  //get Reporting Employees ById
  public getReportingEmployeeById(id: number,companyId:number) {
    return this.http.get(this.global_URL + "employee/list_employee/" + id + "/"+companyId+"");
  }


  //Employee Personal Details
  public PostEmployeePersonalDetails(Object: any) {
    return this.http.post(this.global_URL + "employeepersonaldetail", Object);
  }




  //get Employee Personal Details By EmployeeId
  public getEmployeePersonalDetailsById(id: number) {
    return this.http.get(this.global_URL + "employeepersonaldetail/list_by_employee/" + id + "");
  }



  //update Employee Personal Details
  public UpdateEmployeePersonalDetails(id: number, Object: any) {
    return this.http.put(this.global_URL + "employeepersonaldetail/" + id + "", Object);
  }



  //employee qualification service
  //get All qualifications
  public getEmployeeQualifications(id: number) {
    return this.http.get(this.global_URL + "qualificationmaster/list_company/" + id + "?search=&page=&size=10");
  }


  //post Qualifications Details
  public postEmployeeQualificationsDetails(Object: any) {
    return this.http.post(this.global_URL + "employeequalificationdetail", Object);
  }

  //get Qualification Details
  public getQualificationDetails(id: number) {
    return this.http.get(this.global_URL + "employeequalificationdetail/list_by_employee/" + id + "");
  }

  //get Qualification Details By Id
  public getEmployeeQualificationById(id: number) {
    return this.http.get(this.global_URL + "employeequalificationdetail/" + id + "");
  }

  //update EmployeeQualifications
  public updateEmployeeQualificationsDetails(id: number, Object: any) {
    return this.http.put(this.global_URL + "employeequalificationdetail/" + id + "", Object);
  }

  //delete EmployeeQualification By Id
  public deleteEmployeeQualificationById(id: number) {
    return this.http.delete(this.global_URL + "employeequalificationdetail/" + id + "");
  }


  //post employeeFamilyDetails
  public postEmployeeFamilyDetails(Object: any) {
    return this.http.post(this.global_URL + "employeefamilydetail", Object);
  }

  //update employeeFamilyDetails
  public updateEmployeeFamilyDetails(id: number, Object: any) {
    return this.http.put(this.global_URL + "employeefamilydetail/" + id + "", Object);
  }

  //get employeeFamilyDetailsList
  public getEmployeeFamilyDetailsById(id: number) {
    return this.http.get(this.global_URL + "employeefamilydetail/" + id + "");
  }


  //get employeeFamilyDetailsList
  public getEmployeeFamilyListDetails(id: number) {
    return this.http.get(this.global_URL + "employeefamilydetail/list_by_employee/" + id + "");
  }

  //get employeeFamilyDetailsList
  public deleteEmployeeFamilyDetailsById(id: number) {
    return this.http.delete(this.global_URL + "employeefamilydetail/" + id + "");
  }

  //post employeePassport Details 
  //post employeePassport Details 
  //post employeePassport Details 
  //post employeePassport Details 
  //post employeePassport Details 
  public postEmployeePassportDetails(Object: any) {
    return this.http.post(this.global_URL + "employeepassportdldetail", Object);
  }

  public fetchSalaryMapping(deptId: number, branchId: number, companyId: number) {
    return this.http.get(this.global_URL + "salarymapping/find-by-dept?deptId=" + deptId + "&branchId=" + branchId + "&companyId=" + companyId);
  }

  saveSalaryStructure(formObj: any) {
    return this.http.post(this.global_URL + "employeesalarystructure", formObj);
  }

  //get Employee Passport Details By EmployeeId
  public getEmployeePassportDetailsById(id: number) {
    return this.http.get(this.global_URL + "employeepassportdldetail/list_by_employee/" + id + "");
  }

  //update employeePassport Details 
  public updateEmployeePassportDetails(id: number, Object: any) {
    return this.http.put(this.global_URL + "employeepassportdldetail/" + id + "", Object);
  }

  //getEmployeesByFilter
  public getEmployeesByFilter(filterObj: any) {

    return this.http.post(this.global_URL + "employee/getEmployeesByFilter" + "", filterObj);

  }
  public getFilterData(filterObj: any) {
    return this.http.post(this.global_URL + "employee/getFilterData" + "", filterObj);
  }
  public getEmployeesByFilterForPayroll(filterObj: any) {
    let payslipObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": sessionStorage.getItem("selectedPayslipMonth"), "employeeIds": filterObj };
    return this.http.post(this.global_URL + "employee/getEmployeesByFilterForPayroll" + "", payslipObj);

  }
  public getEmployeesByFilterForPayrollGenerate(filterObj: any) {
    let payslipObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": sessionStorage.getItem("selectedPayslipMonth"), "employeeIds": filterObj };
    return this.http.post(this.global_URL + "employee/getEmployeesByFilterForPayrollGenerate" + "", payslipObj);

  }
  public getEmployeesByFilterForPayrollGenerateMultipleMonth(filterObj: any, months:any) {
    let payslipObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": months, "employeeIds": filterObj };
    return this.http.post(this.global_URL + "employee/getEmployeesByFilterForPayrollGenerate" + "", payslipObj);

  }

  public getEmployeesByFilterForPayrollGeneratedMultipleMonth(filterObj: any, months:any) {
    let payslipObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": months, "employeeIds": filterObj };
    return this.http.post(this.global_URL + "employee/getEmployeesByFilterForPayrollGenerated" + "", payslipObj);

  }
  fetchSalaryStructureById(id: number) {
    return this.http.get(this.global_URL + `employeesalarystructure/find-by-emp/${id}`);
  }

  public updateSalaryStructure(id: number, data: any) {
    return this.http.put(this.global_URL + `employeesalarystructure/${id}`, data);
  }

  //get All Employees by Reporting Head
  public getAllEmployeesByManager(id: number): Observable<employees[]> {
    return this.http.get<employees[]>(this.global_URL + 'employee/findEmployeeListByManager/' + id + '')
  }

  saveCandidateSalaryStructure(formObj: any) {
    return this.http.post(this.global_URL + "OnBoardingCandidetSalaryDetails", formObj);
  }

  public updateCandidateSalaryStructure(id: number, data: any) {
    return this.http.put(this.global_URL + `OnBoardingCandidetSalaryDetails/${id}`, data);
  }

  public fetchCandidateSalaryMapping(deptId: number, branchId: number, companyId: number, candidetId:number) {
    return this.http.get(this.global_URL + "OnBoardingCandidetSalaryDetails/find-by-dept?deptId=" + deptId + "&branchId=" + branchId + "&companyId=" + companyId+ "&candidetId=" + candidetId);
  }
}
