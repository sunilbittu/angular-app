import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../../configuration/configuration.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-emp-wise-goal-report',
  templateUrl: './emp-wise-goal-report.component.html',
  styleUrls: ['./emp-wise-goal-report.component.css']
})
export class EmpWiseGoalReportComponent implements OnInit {
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  tenureReportList: any;
  public departmentsList: any;
  public departmentModel = '';
  public departmentId: any;
  public financialYearList: any = [];
  public financialYearModel = '';
  public toggleLoader: boolean = false;
  public empGoalReportList: any = [];
  public empGoalNotSetReportList: any = [];
  public showGoalNotSetEmp: boolean = false;
  public employeeId: any = sessionStorage.getItem("empId");
  public goalReportData: any = {};
  p = 1;
  public numberOfEntitesToShow: number = 20;
  public kpaTableData : any=[];
  //pagination
  itemsPerPage: any;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  public pageNumber2: Number = 0;
  itemsPerPage2: any;
  totalItems2: any;
  currentPage2: any;
  totalElements2: number = 0;
  showingFrom2: number = 0;
  showingTo2: number = 0;
  validationText: string = '';
  public isdepselected: boolean=false;
  public idfyselected: boolean=false;
  public submitted:boolean=false;

  constructor(private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService
    , private notification: NotifierService, private crureService: CrudOperationsService, public configurationService: ConfigurationService) { }

  ngOnInit(): void {
    this.fetchDeptList();
    this.fetchFinancialYear();
  }
  fetchFinancialYear() {
    this.configurationService.fetchFinancialYear(this.companyId).subscribe((res: any) => {
      this.financialYearList = res.data.content;
    },
      (error: any) => {
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  public headers: any = ['S.No', 'Department Name', 'Employee Id', 'Employee Name', 'Set Goal', 'Action'];
  public goalNotSetHeaders: any = ['S.No', 'Employee Id', 'Employee Name', 'Email', 'Contact Number', 'Action'];
  fetchTenureReport(id: number) {
    let api = 'employee/tenurereport/' + this.companyId + '/' + this.departmentModel;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      console.log(data, '===data');
      this.tenureReportList = data.data;
    })
  }

  fetchDeptList() {
    let api = 'department/list_company/' + this.companyId;
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.departmentsList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  submit() {
    this.submitted=true;
    if(this.idfyselected && this.isdepselected){
    
    this.spinner.show();
    let api = 'employeegoalsetting/departmentwise_employee_goal_settings/' + this.companyId + '/' + this.employeeId +
      '?departmentIds=' + this.departmentModel + '&financialYearId=' + this.financialYearModel + '&page=' + this.pageNumber + '&size=10';
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.submitted=false;
        this.isdepselected=false;
        this.idfyselected=false;
        this.goalReportData = data.data;
        this.empGoalReportList = data.data.pmsReportDTO;
        // this.handlePagination2(data.data.pmsReportDTO);
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })}
  }
  handlePagination2(data: any) {
    this.totalElements2 = data.totalElements;
    this.itemsPerPage = 10;
    this.currentPage2 = data.pageable.pageNumber + 1;
    this.totalItems2 = (data.totalPages) * this.itemsPerPage;
    this.showingFrom2 = (data.pageable.pageNumber * 10) + 1;
    const to2 = (data.pageable.pageNumber + 1) * 10;
    if (this.totalElements2 >= to2) {
      this.showingTo2 = to2;
    } else {
      this.showingTo2 = this.totalElements2;
    }
  }
  pageChanged2(event: any) {
    this.pageNumber2 = event - 1;
    this.submit();
  }
  handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 10;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.itemsPerPage;
    this.showingFrom = (data.data.pageable.pageNumber * 10) + 1;
    const to = (data.data.pageable.pageNumber + 1) * 10;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.showGoalNotSet();
  }
  showGoalNotSet() {
    //spinner show
    this.spinner.show();
    this.showGoalNotSetEmp = true;
    let api = 'employeegoalsetting/departmentwise_employee_goals_not_setted/' + this.companyId + '/' + this.employeeId +
      '?departmentIds=' + this.departmentModel + '&financialYearId=' + this.financialYearModel + '&page=' + this.pageNumber + '&size=10';
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.empGoalNotSetReportList = data.data.content;
        this.empGoalNotSetReportList.map(function (obj: any) {
          obj.selected = false;
        })
        this.handlePagination(data);
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  back() {
    this.showGoalNotSetEmp = false;
  }

  onClickCheckBox(id: any) {
    this.validationText = '';
    const i = this.empGoalNotSetReportList.findIndex((obj: any) => obj.employeeId == id);
    this.empGoalNotSetReportList[i].selected = !this.empGoalNotSetReportList[i].selected;
  }



  empGoalReminderMail() {
    const eItems = this.empGoalNotSetReportList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      this.spinner.show();
      let employeeIdList = [];
      for (let i = 0; i < this.empGoalNotSetReportList.length; i++) {
        if (this.empGoalNotSetReportList[i].selected) {
          employeeIdList.push(this.empGoalNotSetReportList[i].employeeId);
          let api = 'employeegoalsetting/employees_goals_reminder_mail?employeeIds=' + employeeIdList;
          this.crureService.getList(api)
            .subscribe((data: any) => {
              this.spinner.hide();
              this.notification.notify('success', 'Email sent successfully!');
              this.empGoalNotSetReportList = data.data.content;
              this.empGoalNotSetReportList.map(function (obj: any) {
                obj.selected = false;
              })
              this.handlePagination(data);
            },
              (error) => {
                this.spinner.hide();
                this.notification.notify('error', 'Something Went Worng');
              })
        }
      }
    } else {
      this.validationText = 'Please select atlease 1 employee(s).';
    }
  }
  //calling departmments based on branchId
  onchangeBranch(id: any) {

    this.fetchEmployeesDePartments(id);
  }

  //get Department List 
  fetchEmployeesDePartments(id: number) {
    //get companyId
    let api: any = 'department/dropdownList_departments/' + id;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {

        this.departmentsList = data.data;

      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }

  onDepartmentChange() {
    // this.fetchTenureReport(this.departmentModel);
this.isdepselected=true;
  }

  onFYChange(){
    this.idfyselected=true;
  }

  exportTable(type: string) {


    var fileType = '';
    let fileName='employee goal report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = 'reports/employee_tenure_report/' + type + '?companyId=' + this.companyId + '&' + 'departmentId=' + this.departmentModel;
    this.crureService.downloadDocument(api)
      .subscribe((response: any) => {


        let blob: any = new Blob([response], { type: fileType });
        const url = window.URL.createObjectURL(blob);
        if(type!='EXCEL'){
          window.open(url);
        }
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;

        anchor.click();        //window.location.href = response.url;
        //this._FileSaverService.save(blob,'Employee_Branch_Report');
      },

        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide

        }

      )
  }
  public employeeKPAGoalsList: any = [];
  public toggleLoader2: boolean = false;
  view(employeeId: number) {
    this.employeeKPAGoalsList = [];
    let url = 'employeegoalsetting/list_employee_financialyear/' + employeeId + '/' + this.financialYearModel;
    this.crudOperationsService.getList(url).subscribe((res: any) => {
      // this.notification.notify('success', res.message);
      this.toggleLoader2 = false;
      this.employeeKPAGoalsList = res.data;
    },
      (error) => {
        this.toggleLoader2 = false;
        this.notification.notify('error', 'Something went wrong!');
      })
  }
}
