import { Component, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-payslip',
  templateUrl: './payslip-allow.component.html',
  styleUrls: ['./payslip-allow.component.css']
})
export class PayslipAllowComponent implements OnInit {
  public years: any = [];
  public selectedYear = '';
  public months: any = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  public selectedMonth: any = '';
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public role: any;
  public errorMsg = 'Can\'t be blank.';
  public monthAndYearValidationText: string = '';
  public monthValidationText: string = '';
  public YearValidationText: string = '';
  public submitProcessing: boolean = false;
  public submitProcessing1: boolean = false;
  public searchValue: any = "";

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
  public employeeList: any = [];
  public allowEmployeeList: any = [];
  public selectedAllowEmployeeCount:any = "";
  public selectedGeneratedEmployeeCount: any = "";

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

  constructor(private employeMasterService: EmployeeMastersService, private sanitizer: DomSanitizer,
    private employeeService: AddEmployeeService,private notification: NotifierService, 
    public crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }
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
    //this.applyFilter();
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
    this.employeeList = [];
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
      this.employeeService.getEmployeesByFilterForPayroll(filterJson)
      .subscribe((data: any) => {
        this.allowEmployeeList = data.data;

        const eAllowItems = this.allowEmployeeList.filter((item: any) => item.payslipAllow === true);
        this.selectedAllowEmployeeCount = eAllowItems.length;
        const eItems = this.allowEmployeeList.filter((item: any) => item.payslipGenerate === true);
        this.selectedGeneratedEmployeeCount = eItems.length;
        // this.employeeList.map(function (obj: any) {
        //   obj.selected = false;
        // })
       // console.log(this.allowEmployeeList);
      })
     }else{
      var n = Number(sessionStorage.getItem("empId"));
       var empObj = [{
        "employeeCode":n,
        "employeeId":n,
        "fullName":localStorage.getItem("userName")
       }]
       this.allowEmployeeList = empObj;
      // console.log("employee list ===== ",this.employeeList);
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
  generatedPayslip(){

    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    let flag = false;
    if (this.selectedYear == '' && this.selectedMonth == '') {
      this.monthAndYearValidationText = 'Month and Year ' + this.errorMsg;
      flag = true;
    } else {
      if (this.selectedMonth == '') {
        this.monthValidationText = 'Month ' + this.errorMsg;
        flag = true;
      }
      if (this.selectedYear == '') {
        this.YearValidationText = 'Year ' + this.errorMsg;
        flag = true;
      }
    }
    if (eItems.length > 0 && !flag) {
     // this.submitProcessing = true;
      let empList = [];
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].selected) {
          empList.push(this.employeeList[i]);
        }
      }
     
        this.crudOperationsService.viewGeneratedPayslipForAlow(empList)
          .subscribe((data: any) => {
          // console.log("data after ======== ",data.data);
           if(data.httpStatus == 'CONFLICT'){
            this.generatePayslip();
           }else{
            this.validationText = 'Payslip is not generated this month';
           }
          })
     
    } else {
      if (eItems == 0) {
        this.validationText = 'Please select atlease 1 employee(s).';
      }
    }

  }
  generatePayslip() {
    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    let flag = false;
    if (this.selectedYear == '' && this.selectedMonth == '') {
      this.monthAndYearValidationText = 'Month and Year ' + this.errorMsg;
      flag = true;
    } else {
      if (this.selectedMonth == '') {
        this.monthValidationText = 'Month ' + this.errorMsg;
        flag = true;
      }
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
     // console.log("empList", empList);
      // if (sessionStorage.getItem("role") == 'ROLE_EMPLOYEE') {
      //   this.employeeList = [{ "employeeId": sessionStorage.getItem("empId") }];
      //   this.crudOperationsService.getPayslip(empList);
      //   setTimeout(() => {
      //     this.submitProcessing = false;
      //   }, 2000);
      // } else {
        this.crudOperationsService.getPayslip(empList).pipe(map((data: any) => {
          let fileBlob = data;
          this.submitProcessing = false;
          let blob = new Blob([fileBlob], {
            type: 'application/pdf' // must match the Accept type
          });
          let url = window.URL.createObjectURL(blob);
          this.sanitizer.bypassSecurityTrustUrl(url);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.target = "_blank";

          anchor.click();
        })).subscribe((result: any) => {
          localStorage.setItem("type", "");
        });
        localStorage.setItem("type", "");
     // }
    } else {
      if (eItems == 0) {
        this.validationText = 'Please select atlease 1 employee(s).';
      }
    }
  }
  savePayslip() {
   const eItems = this.allowEmployeeList.filter((item: any) => item.payslipAllow === true);
    let flag = false;
    if (this.selectedYear == '' && this.selectedMonth == '') {
      this.monthAndYearValidationText = 'Month and Year ' + this.errorMsg;
      flag = true;
    } else {
      if (this.selectedMonth == '') {
        this.monthValidationText = 'Month ' + this.errorMsg;
        flag = true;
      }
      if (this.selectedYear == '') {
        this.YearValidationText = 'Year ' + this.errorMsg;
        flag = true;
      }
    }
    if ((eItems.length > 0 && !flag ) || this.searchValue !== "") {
     this.submitProcessing = true;
      //let empList = [];
      // for (let i = 0; i < this.employeeList.length; i++) {
      //   if (this.employeeList[i].selected) {
      //     empList.push(this.employeeList[i]);
      //   }
      // }
     // empList.push(this.employeeList);
     // console.log("empList", empList);
      // if (sessionStorage.getItem("role") == 'ROLE_EMPLOYEE') {
      //   this.employeeList = [{ "employeeId": sessionStorage.getItem("empId") }];
      //   this.crudOperationsService.savePayslip(empList)
      //     .subscribe((data: any) => {
      //      // this.submitProcessing1 = false;
      //       this.notification.notify('success', data.message);
      //     })
      // } else {
        this.crudOperationsService.saveAllowPayslip(this.allowEmployeeList)
          .subscribe((data: any) => {
            //alert(data.message)
            this.notification.notify('success', data.message);
            this.submitProcessing = false;
            this.allowEmployeeList = data.data;
            this.applyFilter();
            //(<any>$('#myModal-filter')).modal('hide');
          })
     // }
    } else {
      if (eItems == 0 && this.searchValue === "") {
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

    this.applyFilter();
  }
  public empIds: any = [];
  public toggleLoader: boolean = false;
  getEmpCode(empId: any) {
    console.log("empId", empId);
    this.empIds.push(empId);
  }
  public validationText: string = '';
  onClickCheckBox(id: any,event: any) {
    //console.log("hi ===============");
    const checked = event.target.checked;
    this.validationText = '';
    const i = this.allowEmployeeList.findIndex((obj: any) => obj.employeeId == id);
    this.allowEmployeeList[i].payslipAllow = !this.allowEmployeeList[i].payslipAllow;
    //console.log("selected employee ====== ",this.allowEmployeeList[i]);
    const eItems = this.allowEmployeeList.filter((item: any) => item.payslipAllow === true);
    if(checked)this.selectedAllowEmployeeCount = this.selectedAllowEmployeeCount+1;
    else this.selectedAllowEmployeeCount = this.selectedAllowEmployeeCount-1;
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    //alert(checked);
    this.validationText = '';
    if(checked){
      this.allowEmployeeList.forEach((item: any) => item.payslipAllow = checked);
      this.selectedAllowEmployeeCount = this.allowEmployeeList.length;
    }else{
      this.allowEmployeeList.forEach((item: any) => item.payslipAllow = checked);
      this.selectedAllowEmployeeCount = 0;
    }
   
  }
  ngDestroy(): void {
    (<any>$('#myModal-filter')).modal('hide');
  }

  exportTable(type: string) {
    var fileType = '';
    let fileName = 'Allow_Payslip_Report';
    if (type == 'EXCEL') {
      fileName = fileName + '.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileType = 'application/pdf';
      fileName = fileName + '.pdf'
    }
    this.spinner.show();
    let api: any = "reports/getPayslipAllowReport/" + this.companyId + "/" + type;
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
    let payslipObj = { "year": sessionStorage.getItem("selectedPayslipYear"), "month": sessionStorage.getItem("selectedPayslipMonth"), "employeeIds": filterJson };
    this.crudOperationsService.downloadDocumentExpenseReport(api, payslipObj)
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

}
