import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
@Component({
  selector: 'app-employee-vacination-report',
  templateUrl: './employee-vacination-report.component.html',
  styleUrls: ['./employee-vacination-report.component.css']
})
export class EmployeeVacinationReportComponent implements OnInit {
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public vaccinationReportList: any = [];
  public filteredVaccinationReportList: any = [];
  public branchDetailsList!: any[];
  public departmentsList: any;
  public branchModel: any = '';
  public departmentModel: any = '';
  public vaccinationModel: any = '';
  public departmentId: any;
  public vaccinationList: any = [];
  p: number = 1;
  public headers: any = ["S.No", "Employee Code", "Employee Name", "Vaccination Name", "Date", "Dose", "Remarks", "Branch Name", "Dept Name"];

  constructor(private crudOperationsService: CrudOperationsService, private employeMasterService: EmployeeMastersService
    , private notification: NotifierService, private spinner: NgxSpinnerService, private sanitizer: DomSanitizer,
    private crureService: CrudOperationsService) { }

  ngOnInit(): void {
    this.fetchBranchDetailsList();
    this.fetchVaccinationReportt();
    this.fetchVaccinationList();
  }

  fetchVaccinationList() {
    this.employeMasterService.getVaccinationList(this.companyId)
      .subscribe((data: any) => {
        this.vaccinationList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  fetchVaccinationReportt() {
    let api = "employee/vaccinationReport?companyId=" + this.companyId + "&branchId=" +
      this.branchModel + "&departmentId=" + this.departmentModel + "&vaccineName=" + this.vaccinationModel;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.vaccinationReportList = data.data;
      this.filteredVaccinationReportList = data.data;
    })
  }
  fetchBranchDetailsList() {
    this.spinner.show();
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.branchDetailsList = data.data.content;
      }
        ,
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //calling departmments based on branchId
  onchangeBranch(id: any) {
    this.fetchEmployeesDePartments(id);
  }
  //get Department List 
  fetchEmployeesDePartments(id: number) {
    //get companyId
    let api: any = "department/dropdownList_departments/" + id;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.departmentsList = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  exportTable(type: string) {
    var fileType = '';
    let fileName = 'Employee_Vaccinaion_Report';
    if (type == 'EXCEL') {
      fileName = fileName + '.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileType = 'application/pdf';
      fileName = fileName + '.pdf'
    }
    this.spinner.show();
    let api: any = "reports/employee_vaccination_report/" + type;
    this.crureService.exportFile(api, this.filteredVaccinationReportList)
      .subscribe((response: any) => {
        this.spinner.hide();
        let blob: any = new Blob([response], { type: fileType });
        let url = window.URL.createObjectURL(blob);
        this.sanitizer.bypassSecurityTrustUrl(url);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;

        anchor.click();
        //window.location.href = response.url;
        //this._FileSaverService.save(blob,'Employee_Branch_Report');
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        }
      )
  }

  submit(branch: any, department: any, vaccinationName: String) {
    this.spinner.show();
    let temp: any = [];
    if (branch && department && vaccinationName) {
      temp = this.vaccinationReportList.filter((s: any) => s.companyBranchDetailsId == branch && s.departmentId == department && s.vaccineName == vaccinationName);
    } else if (branch && vaccinationName) {
      temp = this.vaccinationReportList.filter((s: any) => s.companyBranchDetailsId == branch && s.vaccineName == vaccinationName);
    } else if (department && vaccinationName) {
      temp = this.vaccinationReportList.filter((s: any) => s.departmentId == department && s.vaccineName == vaccinationName);
    } else if (branch && department) {
      temp = this.vaccinationReportList.filter((s: any) => s.departmentId == department && s.companyBranchDetailsId == branch);
    } else if (vaccinationName) {
      temp = this.vaccinationReportList.filter((s: any) => s.vaccineName == vaccinationName);
    } else {
      temp = this.vaccinationReportList;
    }
    this.filteredVaccinationReportList = temp;
    this.spinner.hide();
  }
  clear() {
    this.filteredVaccinationReportList = this.vaccinationReportList;
    this.branchModel = '';
    this.departmentModel = '';
    this.vaccinationModel = '';
  }
}
