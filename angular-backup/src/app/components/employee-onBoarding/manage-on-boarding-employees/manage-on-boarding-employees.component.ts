import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-manage-on-boarding-employees',
  templateUrl: './manage-on-boarding-employees.component.html',
  styleUrls: ['./manage-on-boarding-employees.component.css']
})
export class ManageOnBoardingEmployeesComponent implements OnInit {

  constructor(public crudOperationsService: CrudOperationsService, public router: Router, private spinner: NgxSpinnerService) { }
  public companyId: any = sessionStorage.getItem("companyId");
  public employeesList: any = [];
  public documentsList: any = [];
  public togglrList: boolean = false;
  public fName: any = "";

  ngOnInit(): void {
    this.spinner.show();
    let api = "onboardingemployee/list/" + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.employeesList = data.data.content;
    },
      (_error) => {
        this.spinner.hide();
      })
  }
  close() {
    this.togglrList = false;
  }
  downloadFile(filpath: any) {
    let downloadApi = 'onboardingemployeedocuments/on_board_employee_doc_download?filePath=' + filpath;
    this.crudOperationsService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: "application/octet-stream" }); // must match the Accept type
        const filename = filpath;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.download = filename;
        anchor.href = url;
        anchor.click();
      }
      )
  }
  getDocuments(fname: any, id: any) {
    console.log(id)
    this.togglrList = true;
    this.fName = fname;
    let api1 = 'onboardingemployeedocuments/list/' + id;
    this.crudOperationsService.getList(api1).subscribe((data: any) => {
      this.documentsList = data.data.content;

    })
  }
  intakeEmployee(data: any) {
    sessionStorage.setItem('jobId', data.jobId);
    sessionStorage.setItem('fromOnBoardingPage', "true");
    sessionStorage.setItem('onBoardingEmployeeId', data.onBoardingEmployeeId.toString());
    this.router.navigateByUrl('HRMS/Master/add-employee');
  }
}
