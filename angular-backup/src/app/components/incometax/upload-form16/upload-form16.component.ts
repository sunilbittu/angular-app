import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';

@Component({
  selector: 'app-upload-form16',
  templateUrl: './upload-form16.component.html',
  styleUrls: ['./upload-form16.component.css']
})
export class UploadForm16Component implements OnInit {

  constructor(private employeeService: AddEmployeeService, public crudOperationsService: CrudOperationsService,
    private spinner: NgxSpinnerService) { }
  public headers: any = ["Code", "Name", "Branch", "Department", "Designation", "Division", "Grade", "Category", "Project", "Action"];
  public companyId: any;
  public employeeList: any = [];
  public selectedFile: any = '';
  public empData: any = [];
  public investmentYear: any = [];
  public yearModel: Number = 0;
  public submittedDoc = false;
  ngOnInit(): void {
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.crudOperationsService.getList('employee/emp_list_company/' + Number(sessionStorage.getItem('companyId'))).subscribe((data: any) => {
      // this.leaveHeader=data.data;
      this.spinner.hide();
      this.employeeList = data.data.content;
      console.log('emp', this.employeeList)
    },
      (error) => {
        this.spinner.hide();
      })
    this.getEmployees();
    let companyId = Number(sessionStorage.getItem("companyId"))
    let url = "financialyear/list-by/" + companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log(data);
      this.investmentYear = data.data.content;
    });
  }
  getEmployees() {
    let url = "employeeform16/list/" + this.companyId;
    this.crudOperationsService.getList(url)
      .subscribe((data: any) => {
        this.empData = data.data.content;
        console.log(this.employeeList);
      })
  }
  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('file', this.selectedFile);
  }
  public employeeId: Number = 0;
  uploadform(id: any) {
    this.employeeId = id;
  }
  public evidanceModel: any = '';
  getTdsInvestmentList() {

  }
  saveForm16() {
    this.submittedDoc = true;
    if (this.evidanceModel && this.yearModel != 0) {
      let obj = {
        company: { "companyId": 1 },
        employee: { "employeeId": Number(this.employeeId) },
        financialYear: { "financialYearId": Number(this.yearModel) }
      }
      let str = JSON.stringify(obj)

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('form16', str);
      this.crudOperationsService.uploadeDocument1('employeeform16', formData).subscribe((data) => {
        (<any>$('#myModal-add')).modal('hide');
        this.submittedDoc = false;
        this.evidanceModel = "";
        this.getEmployees();
      })
    }
  }
}
