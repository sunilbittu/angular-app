import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {

  public headers: any = ["Category Code", "Category Name", "Live Employees"];
  public headersCount: any = ["Employee Code", "Employee Name", "Category Code", "Category Name"];
  public companyId!: number;
  public categoryId!: number;
  public employeesCategoryList: any;
  public employeesCategoryCountList: any;

  p: number = 1;

   constructor(private crureService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }


  ngOnInit(): void {

    this.fetchEmployeesListByCategory();
  }

onModelClose(){
    this.p = 1;
  }


  fetchEmployeesListByCategory() {

    //spinner show
    this.spinner.show();

    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));

    let api: any = "employee/find_employee_master_categoryList/" + this.companyId

    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesCategoryList = data.data;
        //spinner hide
        this.spinner.hide();

      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
        this.spinner.hide();
        })

  }


  fetchEmployeesCountListByCategory(categoryId: number) {

    this.categoryId = categoryId;
    //spinner show
    this.spinner.show();


    //clear array data
    this.employeesCategoryCountList = [];

    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));

    let api: any = "employee/employee_master_category_employeeList/" + categoryId + "/" + this.companyId

    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesCategoryCountList = data.data;
        //spinner hide
        this.spinner.hide();
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
        this.spinner.hide();
        })

  }



  exportTable(type: string) {

    //spinner show
    this.spinner.show();


    var fileType = '';
    let fileName='category-report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = "reports/live_employees_by_category/" + type + "?companyId=" + this.companyId;
    this.crureService.downloadDocument(api)
      .subscribe((response: any) => {
        //spinner hide
        this.spinner.hide();

        let blob: any = new Blob([response], { type: fileType });
        const url = window.URL.createObjectURL(blob);
        if(type!='EXCEL'){
          window.open(url);
        }
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


  exportInnerTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName = 'Employee_CostCenter_Report';
    if (type == 'EXCEL') {
      fileName = fileName + '.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileType = 'application/pdf';
      fileName = fileName + '.pdf'
    }
    let api: any = "reports/live_employees_by_category_id/" + type + "?companyId=" + this.companyId + "&categoryId=" + this.categoryId;
    this.crureService.downloadDocument(api)
      .subscribe((response: any) => {
        //spinner hide
        this.spinner.hide();
        let blob: any = new Blob([response], { type: fileType });
        const url = window.URL.createObjectURL(blob);
        if (type != 'EXCEL') {
          window.open(url);
        }
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


}
