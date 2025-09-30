import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-expense-report',
  templateUrl: './expense-report.component.html',
  styleUrls: ['./expense-report.component.css']
})
export class ExpenseReportComponent implements OnInit {

  public years: any = [];
  public selectedYear = '';
  public months: any = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  public headers: any = ["Employee Id","Name", "Expense Type", "Approved Date","Approved Amount","Approved By"];

  public selectedMonth: any = '';
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public role: any;
  public errorMsg = 'Can\'t be blank.';
  public employeeObjForexport:any;
  public monthAndYearValidationText: string = '';
  public monthValidationText: string = '';
  public YearValidationText: string = '';
  public submitProcessing: boolean = false;
  public submitProcessing1: boolean = false;
  public searchValue: any = "";
  public employeesExpenseList:any=[];
  public branchDetailsList: any = [];
  public departmentMasterList: any = [];
  public gradeList: any = [];
  public designationList: any = [];
  public costCenterMasterList: any = [];
  public projectMasterList: any = [];
  public categoryMasterList: any = [];
  public bankMasterList: any = [];
  public selectedItems: any = [];
  public selectedItemsBranch: any = [];
  public selectedItemsGrade: any = [];
  public selectedItemsDepartment: any = [];
  public selectedItemsDesignation: any = [];
  public selectedItemsCostCenter: any = [];
  public selectedItemsProject: any = [];
  public selectedItemsCategory: any = [];
  public selectedItemsBank: any = [];
  public employeeList: any;

  public dropdownSettingsBranch = {
    singleSelection: false,
    idField: 'companyBranchDetailsId',
    textField: 'branchName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };

  public dropdownSettingsGrade = {
    singleSelection: false,
    idField: 'gradeId',
    textField: 'gradeName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsDepartment = {
    singleSelection: false,
    idField: 'departmentId',
    textField: 'departmentName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsDesignation = {
    singleSelection: false,
    idField: 'designationId',
    textField: 'designationName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsCostCenter = {
    singleSelection: false,
    idField: 'costCenterId',
    textField: 'costCenterName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsProject = {
    singleSelection: false,
    idField: 'projectId',
    textField: 'projectName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsCategory = {
    singleSelection: false,
    idField: 'categoryId',
    textField: 'categoryName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsBank = {
    singleSelection: false,
    idField: 'bankId',
    textField: 'bankName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public expenseReportList: any;

  constructor(private employeMasterService: EmployeeMastersService, private sanitizer: DomSanitizer,
    private employeeService: AddEmployeeService,private notification: NotifierService, public crudOperationsService: CrudOperationsService,private spinner: NgxSpinnerService) { }
  //@Input() link: any;
  ngOnInit(): void {
    this.role = sessionStorage.getItem("role");
    (<any>$('#myModal-filter')).modal('show');
    this.fetchBranchDetailsList();
    this.fetchGradeList();
    this.fetchDepartmentList();
    this.fetchDesignationList();
    this.fetchCostCenterList();
    this.fetchProjectList();
    this.fetchCategoryList();
    this.fetchBankList();
    this.applyFilter();
    this.getLeaveYearList();
  }
  public getLeaveYearList() {
    this.spinner.show();
    let api = 'leaveyear/list/' + this.companyId + '?page=0&size=100';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.years = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  fetchBranchDetailsList() {
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {
        this.branchDetailsList = data.data.content;
        console.log(this.branchDetailsList);
      })
  }

  fetchGradeList() {
    this.employeMasterService.getGradeMasterList(this.companyId)
      .subscribe((data: any) => {
        this.gradeList = data.data.content;
        console.log(this.gradeList);
      })
  }

  fetchDepartmentList() {
    return this.employeMasterService.getDepartmentList(this.companyId)
      .subscribe((data: any) => {
        this.departmentMasterList = data.data.content;
      })
  }

  fetchDesignationList() {
    this.employeMasterService.getDesignationList(this.companyId)
      .subscribe((data: any) => {
        this.designationList = data.data.content;
      })
  }

  fetchCostCenterList() {
    this.employeMasterService.getCostCenterMasterList(this.companyId)
      .subscribe((data: any) => {
        this.costCenterMasterList = data.data.content;
      })
  }

  fetchProjectList() {
    this.employeMasterService.getProjectMasterList(this.companyId)
      .subscribe((data: any) => {
        this.projectMasterList = data.data.content;
      })
  }

  fetchCategoryList() {
    this.employeMasterService.getCategoryMasterList(this.companyId)
      .subscribe((data: any) => {
        this.categoryMasterList = data.data.content;
      })
  }

  fetchBankList() {
    this.employeMasterService.getBankMasterList(this.companyId)
      .subscribe((data: any) => {
        this.bankMasterList = data.data.content;
      })
  }

  onItemSelectBranch(data: any) { }
  onItemSelectGrade(data: any) { }
  onItemSelectDepartment(data: any) { }
  onItemSelectDesignation(data: any) { }
  onItemSelectCostCenter(data: any) { }
  onItemSelectProject(data: any) { }
  onItemSelectCategory(data: any) { }
  onItemSelectBank(data: any) { }

  onSelectAllBranch(event: any) { }
  onSelectAllGrade(event: any) { }
  onSelectAllDepartment(event: any) { }
  onSelectAllDesignation(event: any) { }
  onSelectAllCostCenter(event: any) { }
  onSelectAllProject(event: any) { }
  onSelectAllCategory(event: any) { }
  onSelectAllBank(event: any) { }

  applyFilter() {
    var filterJson = {
      "selectedItemsBranch": this.selectedItemsBranch,
      "selectedItemsGrade": this.selectedItemsGrade,
      "selectedItemsDepartment": this.selectedItemsDepartment,
      "selectedItemsDesignation": this.selectedItemsDesignation,
      "selectedItemsCostCenter": this.selectedItemsCostCenter,
      "selectedItemsProject": this.selectedItemsProject,
      "selectedItemsCategory": this.selectedItemsCategory,
      "selectedItemsBank": this.selectedItemsBank,
      "companyId": this.companyId,
      "search": this.searchValue
    }
    
     if(this.role!='ROLE_EMPLOYEE'){
      this.employeeService.getEmployeesByFilter(filterJson)
      .subscribe((data: any) => {
        this.employeeList = data.data;
        this.employeeList.map(function (obj: any) {
          obj.selected = false;
        })
        console.log(this.employeeList);
      })
     }else{
      var n = Number(sessionStorage.getItem("empId"));
       var empObj = [{
        "employeeCode":n,
        "employeeId":n,
        "fullName":localStorage.getItem("userName")
       }]
       this.employeeList = empObj;
       console.log("employee list ===== ",this.employeeList);
     }
    

  }

  resetFilter() {
    this.selectedItemsBranch = [];
    this.selectedItemsGrade = [];
    this.selectedItemsDepartment = [];
    this.selectedItemsDesignation = [];
    this.selectedItemsCostCenter = [];
    this.selectedItemsProject = [];
    this.selectedItemsCategory = [];
    this.selectedItemsBank = [];
    this.searchValue = '';
    this.validationText = '';
    this.applyFilter();
  }

  
  generatedexpenseReport() {
    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    let flag = false;
    if (this.selectedYear == '') {
      this.monthAndYearValidationText = 'Year ' + this.errorMsg;
      flag = true;
    } else {
      // if (this.selectedMonth == '') {
      //   this.monthValidationText = 'Month ' + this.errorMsg;
      //   flag = true;
      // }
      if (this.selectedYear == '') {
        this.YearValidationText = 'Year ' + this.errorMsg;
        flag = true;
      }
    }
    if (eItems.length > 0 && !flag) {
      this.submitProcessing = true;
      let empList = [];
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].selected) {
          empList.push(this.employeeList[i]);
        }
      }

       if (this.selectedMonth == '') {
          //  this.monthValidationText = 'Month ' + this.errorMsg;
          //  flag = true;
          sessionStorage.setItem('selectedPayslipMonth','April');
         }

        this.employeeList = [{ "employeeId": sessionStorage.getItem("empId") }];
        let repObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": sessionStorage.getItem("selectedPayslipMonth"), "employeeIds": empList };
        this.employeeObjForexport=repObj;
        let url='apply_reimbursement/expense_report/'+this.companyId;
        this.crudOperationsService.create(repObj,url).subscribe((resp:any)=>{
          this.expenseReportList=resp.data;
          (<any>$('#myModal-filter')).modal('hide')
          this.submitProcessing = false;
        });
 
    } else {
      if (eItems == 0) {
        this.validationText = 'Please select atlease 1 employee(s).';
      }
    }
  }
  selected() {
    this.monthAndYearValidationText = '';
    this.monthValidationText = '';
    this.YearValidationText = '';
    sessionStorage.setItem("selectedPayslipYear", this.selectedYear);
  }
  selectedMonthForPayslip() {
    this.monthAndYearValidationText = '';
    this.monthValidationText = '';
    this.YearValidationText = '';
    sessionStorage.setItem("selectedPayslipMonth", this.selectedMonth);
  }
  public empIds: any = [];
  public toggleLoader: boolean = false;
  getEmpCode(empId: any) {
    console.log("empId", empId);
    this.empIds.push(empId);
  }
  public validationText: string = '';
  onClickCheckBox(id: any) {
    this.validationText = '';
    const i = this.employeeList.findIndex((obj: any) => obj.employeeId == id);
    this.employeeList[i].selected = !this.employeeList[i].selected;
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    this.employeeList.forEach((item: any) => item.selected = checked);
  }
  ngDestroy(): void {
    (<any>$('#myModal-filter')).modal('hide');
  }

  exportTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName='expense-report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let empList = [];
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].selected) {
          empList.push(this.employeeList[i]);
        }
      }
    this.employeeList = [{ "employeeId": sessionStorage.getItem("empId") }];
    let api: any = "reports/expenseReport/"+this.companyId +"/"+ type ;
    this.crudOperationsService.downloadDocumentExpenseReport(api,this.employeeObjForexport)
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


}
