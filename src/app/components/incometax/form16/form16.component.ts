import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-form16',
  templateUrl: './form16.component.html',
  styleUrls: ['./form16.component.css']
})
export class Form16Component implements OnInit {

  constructor(public crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }
  public investmentYear: any = [];
  public yearModel: any = "";
  public filePath: any = "";
  ngOnInit(): void {
    this.spinner.show();
    let companyId = Number(sessionStorage.getItem("companyId"))
    let url = "financialyear/list-by/" + companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.investmentYear = data.data.content;
    },
      (error) => {
        this.spinner.hide();
      })
  }

  getForm16() {
    // employeeform16/list_by_employee
    let empId = Number(sessionStorage.getItem("empId"));
    let url = "employeeform16/list_by_employee/" + empId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.filePath = data.data.content[0].filePath;
      console.log(this.filePath);

      // this.investmentYear=data.data.content;
    });
  }
  generateForm16() {
    // let url="employeeform16/employeeform16download?filePath="+"C:/home/user1/EmployeeForm16/Company_Id_1/Payslip-Datadot_JAN2021_Bharath Kumar_1_23-05-2021_01-08-29.pdf";
    // this.crudOperationsService.getList(url).subscribe((data:any)=>{
    //   console.log(data);
    //   let blob:any = new Blob([data], { type: "application/pdf" });
    // 	const url = window.URL.createObjectURL(blob);
    // 	window.open(url);
    // const a = document.createElement('a');
    //   a.href = URL.createObjectURL(data);
    //   // a.download = title;
    //   document.body.appendChild(a);
    //   a.click();
    // });
    let downloadApi = 'employeeform16/employeeform16download?filePath=' + this.filePath;
    this.crudOperationsService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: "application/octet-stream" }); // must match the Accept type
        const filename = this.filePath;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        console.log(this.filePath)
        anchor.download = filename;
        anchor.href = url;
        anchor.click();
      }
      )
  }
}
