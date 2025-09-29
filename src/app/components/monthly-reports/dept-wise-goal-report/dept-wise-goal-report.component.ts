import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../../configuration/configuration.service';

@Component({
  selector: 'app-dept-wise-goal-report',
  templateUrl: './dept-wise-goal-report.component.html',
  styleUrls: ['./dept-wise-goal-report.component.css']
})
export class DeptWiseGoalReportComponent implements OnInit {
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
  public dropdownSettingsDepartment: any;
  public selectedItemsDepartment: any = [];
  public goalReportList: any = {};
  public employeeId: any = sessionStorage.getItem("empId");
  p: number = 1;
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
  deptId: any;

  constructor(private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService
    , private notification: NotifierService, private crureService: CrudOperationsService, public configurationService: ConfigurationService) { }

  ngOnInit(): void {
    this.fetchDeptList();
    this.fetchFinancialYear();
    this.dropdownSettingsDepartment = {
      singleSelection: false,
      idField: 'departmentId',
      textField: 'departmentName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false,
    };
  }
  fetchFinancialYear() {
    this.configurationService.fetchFinancialYear(this.companyId).subscribe((res: any) => {
      this.financialYearList = res.data.content;
    },
      (error: any) => {
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  public goalHeaders: any = ['S.No', 'Department Name', 'Employee Id', 'Employee Name', 'Set Goal'];
  public headers: any = ['S.No', 'Department Name', 'No of Employees (Goal set)', 'Avg Goal Set', 'Avg grade by Manager', 'Attainment %'];
  fetchTenureReport(id: number) {
    let api = 'employee/tenurereport/' + this.companyId + '/' + this.departmentModel;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      console.log(data, '===data');
      this.tenureReportList = data.data;
    })
  }

  fetchDeptList() {
    let api: any = "department/list_company/"+this.companyId+"?search=&page=&size=10";
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.departmentsList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  submit() {
    this.spinner.show();
    let departmentIds = this.getDepartmentIds();
    let api = 'employeegoalsetting/department_wise_goals_and_avarages/' + this.companyId +
      '?departmentIds=' + departmentIds + '&financialYearId=' + this.financialYearModel+ '&page=' + this.pageNumber + '&size=10';
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.empGoalReportList = data.data.content;
        this.empGoalReportList.map(function (obj: any) {
          obj.attainment = (obj.managerAvg - obj.employeeAvg).toFixed(2);
        })
        this.handlePagination(data);
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
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
    this.submit();
  }
  getDepartmentIds() {
    let arr = [];
    for (let i = 0; i < this.selectedItemsDepartment.length; i++) {
      arr.push(this.selectedItemsDepartment[i].departmentId);
    }
    return arr;
  }
  back() {
    this.showGoalNotSetEmp = false;
  }
  handleEmployeeCount(deptId: any) {
    this.deptId = deptId;
    this.goalReportList = [];
    this.showGoalNotSetEmp = true;
    this.spinner.show();
    let api = 'employeegoalsetting/departmentwise_employee_goal_settings/' + this.companyId + '/' + this.employeeId +
      '?departmentIds=' + deptId + '&financialYearId=' + this.financialYearModel+ '&page=' + this.pageNumber2 + '&size=10';
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.goalReportList = data.data;
        this.handlePagination2(data);
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  handlePagination2(data: any) {
    this.totalElements2 = data.data.totalElements;
    this.itemsPerPage = 10;
    this.currentPage2 = data.data.pageable.pageNumber + 1;
    this.totalItems2 = (data.data.totalPages) * this.itemsPerPage;
    this.showingFrom2 = (data.data.pageable.pageNumber * 10) + 1;
    const to2 = (data.data.pageable.pageNumber + 1) * 10;
    if (this.totalElements2 >= to2) {
      this.showingTo2 = to2;
    } else {
      this.showingTo2 = this.totalElements2;
    }
  }
  pageChanged2(event: any) {
    this.pageNumber2 = event - 1;
    this.handleEmployeeCount(this.deptId);
  }
  onItemSelectDepartment(data: any) { }
  onSelectAllDepartment(event: any) { }
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

  }

  exportTable(type: string) {


    var fileType = '';
    let fileName='department-wise-report';
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

}
