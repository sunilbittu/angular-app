import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-manage-leaves',
  templateUrl: './manage-leaves.component.html',
  styleUrls: ['./manage-leaves.component.css']
})
export class ManageLeavesComponent implements OnInit {

  constructor(private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService, private notification: NotifierService) { }
  public headers1 = ["Leave Type", "Start Date", "End Date", "No of Days", "Status","Remarks", "Status Changed By", "Status Changed Date"];

  public headers2 = ["Emp No.", "Emp Name", "Leave Type", "Start Date", "End Date", "No of Days", "Status", "Remarks", "Download", "Action"];
  public leavesList: any = [];
  public viewleavesList: any = [];
  public ManageleavesList: any = [];
  public employeeId: any = sessionStorage.getItem("empId");
  public statusModel: any = "";
  public toggleStatus: boolean = true;
  public hideStatus: any = undefined;
  public manager: any = "";
  public toggleApprovedList: boolean = false;
  public remarksModel: any = '';
  public searchModel: any = '';
  public companyId: any = Number(sessionStorage.getItem('companyId'));

  public p: number = 1;

  public yearModel: any = "";
  public leaveYear: any = [];

  //pagination
  itemsPerPage: any = 20;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;

  ngOnInit(): void {
    this.getLeaveYearList();
  }

  public getLeaveYearList() {
    this.spinner.show();
    let api = 'leaveyear/list/' + this.companyId + '?page=0&size=100';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.leaveYear = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  apply() {
    this.getListEmployee();
    this.getListEmployeeByManager();
    this.getLeaveTypeList();
  }
  getLeaveTypeList() {
    this.viewleavesList = [];
    this.crudOperationsService.getList('leavemasterindividual/list_by_employee_individual/'
      + this.employeeId + '/' + this.yearModel).subscribe((data: any) => {
        this.spinner.hide();
        if (data.data == null) {
          //this.notification.notify('warning', 'Warning! Leaves not assigned to employee ' + firstName + ' ' + lastName + ' for Leave year ' + this.yearModel);
        } else {
          this.viewleavesList = data.data.leaveTypeInfo;
          window.scrollTo(0, 0);
        }
      });
  }
  getListEmployeeByManager() {
    this.crudOperationsService.getList('leaveapplication/list_of_employee_by_manager/' +
      this.employeeId + '?year=' + this.yearModel+'&search='+this.searchModel).subscribe((data: any) => {
        this.spinner.hide();
        this.ManageleavesList = data.data;
        if (this.ManageleavesList.length == 0) {
          //this.toggleApprovedList = false;
        }
        else {
          this.toggleApprovedList = true;
          this.handlePagination(data);
        }
      }, (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      });
  }
  handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 20;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.itemsPerPage;
    this.showingFrom = (data.data.pageable.pageNumber * this.itemsPerPage) + 1;
    const to = (data.data.pageable.pageNumber + 1) * this.itemsPerPage;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.getListEmployeeByManager();
  }
  pageChange() {
    //alert(id);
    this.getListEmployeeByManager();
  }

  getListEmployee() {
    this.spinner.show();
    this.crudOperationsService.getList('leaveapplication/list_by_employee/' +
      this.employeeId + '?year=' + this.yearModel).subscribe((data: any) => {
        this.spinner.hide();
        this.leavesList = data.data;
        this.getEmployeeNames();
        this.manager = this.leavesList[0].firstName;
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        });
  }

  getEmployeeNames() {
    if (!this.leavesList || this.leavesList.length === 0) return;
  
    this.spinner.show();
    let url = 'employee/search-list/' + this.companyId + '?search=&page=&size=';
  
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
  
      if (data.data && data.data.content) {
        let employeeList = data.data.content;
  
        this.leavesList.forEach((leave: any) => {
          let employee = employeeList.find((emp: any) => emp.employeeCode === leave.modifiedBy);
          if (employee) {
            leave.modifiedBy = `${employee.firstName} ${employee.lastName}`;
          }
        });
      }
    },
    (error) => {
      this.spinner.hide();
      console.log(error);
    });
  }

  changeStatus(i: any) {
    this.toggleStatus = true;
    this.hideStatus = i;
  }
  updateStatus(leaveId: any) {
    this.spinner.show();
    this.toggleStatus = false;
    this.hideStatus = undefined;
    this.crudOperationsService.updateStatus('leaveapplication/leave_status_update/' + leaveId + '/' +
      this.employeeId + '?status=' + this.statusModel + '&remarks=' + this.remarksModel, '').subscribe((data: any) => {
        // this.leaveHeader=data.data;
        // this.epmloyeeList=data.data.content;
        this.notification.notify('success', 'Status Updated Successfully!');
        this.remarksModel = '';
        this.spinner.hide();
        this.getListEmployeeByManager();
      }, (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      });
  }

  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = 'leaveapplication/jobresourcedownload?filePath=' + filePath;
    this.crudOperationsService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: "application/octet-stream" }); // must match the Accept type
        const filename = fileName;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        console.log(fileName)
        anchor.download = filename;
        anchor.href = url;
        anchor.click();
      },
        (error) => {
          this.notification.notify('error', 'File not Attached!');
        }
      )
  }

  handleStatus() {
    if (this.statusModel != 'Approved') {
      (<any>$('#add-1')).modal('show');
    }
  }

  resetTheForm() {
    this.remarksModel = '';
  }

  exportTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName='leave_report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName = fileName + '.pdf'
      fileType = 'application/pdf';
    }
    let api: any = "reports/leave_report/" + type + "?employeeId=" + this.employeeId + '&year=' + this.yearModel;
    this.crudOperationsService.downloadDocument(api)
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
