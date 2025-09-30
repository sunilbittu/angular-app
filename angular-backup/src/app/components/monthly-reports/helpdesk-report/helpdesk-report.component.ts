import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-helpdesk-report',
  templateUrl: './helpdesk-report.component.html',
  styleUrls: ['./helpdesk-report.component.css']
})
export class HelpdeskReportComponent implements OnInit {

  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public resignationReportList: any = [];
  public branchDetailsList!: any[];
  public departmentsList: any;
  public branchModel: any = '';
  public departmentModel: any = '';
  public statusModel: any = '';
  public isStatusSelected:Boolean=false;
  public isDepartmentHeadSelected:Boolean=false;
  public departmentId: any;
  public employeeDetails: any=[];
  public submitted: any = false;
  public asigneeId:any;
  public formData: any = {};
  public resignationList: any = ['Open', 'In Progress', 'Resolved' ,'Rejected'];
  p: number = 1;
  public headers: any = ["Ticket Id", "Problem", "Created By", "Department", "HOD", "Status", "Remarks"];

  constructor(private crudOperationsService: CrudOperationsService, private employeMasterService: EmployeeMastersService
    , private notification: NotifierService, private spinner: NgxSpinnerService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.fetchBranchDetailsList();

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

  getDepartmentheadsDetails() {
    this.crudOperationsService.getList('employee/departmentheads/' + this.departmentModel)
      .subscribe((data: any) => {
        this.employeeDetails = data.data;
      });
  }

  selectingDepartmentHead(){
    this.isDepartmentHeadSelected=true;
  }

  selectingStatus(){
    this.isStatusSelected=true;
  }

  exportTable(type: string) {
    var fileType = '';
    let fileName = 'Helpdesk_Report';
    if (type == 'EXCEL') {
      fileName = fileName + '.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileType = 'application/pdf';
      fileName = fileName + '.pdf'
    }
    this.spinner.show();
    let api: any = "reports/hepldeskReport/" + this.companyId + "/" + type;
    this.formData={
      'status':this.statusModel,
      'departmentId':this.departmentModel,
      'depHeadId':this.asigneeId
    }
    this.crudOperationsService.downloadDocumentExpenseReport(api, this.formData)
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

  submit() {
    this.submitted = true;
    if(this.departmentModel && this.branchModel){
    if (!this.isDepartmentHeadSelected && !this.isStatusSelected ) {
      this.spinner.show();
      let api = "helpdesk_ticket/helpdeskreport/" + this.departmentModel;
      this.crudOperationsService.getList( api).subscribe((data: any) => {
        this.resignationReportList = data.data;
        this.spinner.hide();
        this.submitted = false;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        });
    }else if(this.isDepartmentHeadSelected && !this.isStatusSelected ){
      this.spinner.show();
      let api = "helpdesk_ticket/helpdeskreport/" + this.departmentModel +"?depHeadId="+this.asigneeId;
      this.crudOperationsService.getList( api).subscribe((data: any) => {
        this.resignationReportList = data.data;
        this.spinner.hide();
        this.submitted = false;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        });
    }else if(!this.isDepartmentHeadSelected && this.isStatusSelected){
      this.spinner.show();
      let api = "helpdesk_ticket/helpdeskreport/" + this.departmentModel +"?status="+this.statusModel;
      this.crudOperationsService.getList( api).subscribe((data: any) => {
        this.resignationReportList = data.data;
        this.spinner.hide();
        this.submitted = false;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        });
      }else if(this.isDepartmentHeadSelected && this.isStatusSelected){
        this.spinner.show();
        let api = "helpdesk_ticket/helpdeskreport/" + this.departmentModel +"?status="+this.statusModel+"&depHeadId="+this.asigneeId;
        this.crudOperationsService.getList( api).subscribe((data: any) => {
          this.resignationReportList = data.data;
          this.spinner.hide();
          this.submitted = false;
        },
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
            //spinner hide
            this.spinner.hide();
          });
        }
      }
  }
  
  clear() {
    this.resignationReportList = [];
    this.branchModel = '';
    this.departmentModel = '';
    this.statusModel = '';
    this.submitted = false;
    this.isDepartmentHeadSelected=false;
    this.isStatusSelected=false;
    this.asigneeId='';
  }


}
