import { Component, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.css']
})
export class PayslipComponent implements OnInit {
  public years: any = [];
  public selectedYear = '';
  // public months: any = ["January", "February", "March", "April", "May", "June",
  //   "July", "August", "September", "October", "November", "December"];
  public months: any = [{ name: "January", id: 1 }, { name: "February", id: 2 }, { name: "March", id: 3 },
  { name: "April", id: 4 }, { name: "May", id: 5 }, { name: "June", id: 6 },
  { name: "July", id: 7 }, { name: "August", id: 8 }, { name: "September", id: 9 },
  { name: "October", id: 10 }, { name: "November", id: 11 }, { name: "December", id: 12 },
  ];
  public selectedMonth: any = '';
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public role: any;
  public errorMsg = 'Can\'t be blank.';
  public monthAndYearValidationText: string = '';
  public monthValidationText: string = '';
  public YearValidationText: string = '';
  public submitProcessing: boolean = false;
  public previewProcessing: boolean = false;
  public viewProcessing: boolean = false;
  public generateProcessing: boolean = false;
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
  public employeeList: any;

  public dropdownSettings: any = {
    singleSelection: false,
    idField: 'name',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true
  };

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
    private employeeService: AddEmployeeService,private notification: NotifierService, public crudOperationsService: CrudOperationsService) { }
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
   // this.applyFilter();
   this.getLeaveYearList();
   this.filteredMonths = [...this.months];
  }
  public getLeaveYearList() {
    let api = 'leaveyear/list/' + this.companyId + '?page=0&size=100';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.years = data.data.content;
    },
      (error) => {
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

  onSelectAll(event: any) { }
  onDeSelectAll(event: any) { }
  onItemDeSelect(event: any) { }

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
      this.employeeService.getEmployeesByFilterForPayrollGenerateMultipleMonth(filterJson,this.selectedItems)
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
    //alert(this.selectedItems.length);
    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    let flag = false;
    if (this.selectedYear == '' && this.selectedItems.length == 0) {
      this.monthAndYearValidationText = 'Month and Year ' + this.errorMsg;
      flag = true;
    } else {
      
      if (this.selectedItems.length == 0) {
        this.monthValidationText = 'Month ' + this.errorMsg;
        flag = true;
      }
      if (this.selectedYear == '') {
        this.YearValidationText = 'Year ' + this.errorMsg;
        flag = true;
      }
    }
    if (eItems.length > 0 && !flag) {
     // this.viewProcessing = true;
      let empList = [];
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].selected) {
          empList.push(this.employeeList[i]);
        }
      }
     
        this.crudOperationsService.viewGeneratedPayslip(empList,this.selectedItems)
          .subscribe((data: any) => {
           //console.log("data after ======== ",data.data);
           if(data.httpStatus == 'CONFLICT'){
            this.generatePayslip();
           }else{
            this.validationText = data.message;
           }
          })
     
    } else {
      if (eItems == 0) {
        this.validationText = 'Please select atlease 1 employee(s).';
      }
    }

  }
  generatePayslip() {
   // alert(JSON.stringify(this.selectedItems));
    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    let flag = false;
    if (this.selectedYear == '' && this.selectedItems.length == 0) {
      this.monthAndYearValidationText = 'Month and Year ' + this.errorMsg;
      flag = true;
    } else {
      if (this.selectedItems.length == 0) {
        this.monthValidationText = 'Month ' + this.errorMsg;
        flag = true;
      }
      if (this.selectedYear == '') {
        this.YearValidationText = 'Year ' + this.errorMsg;
        flag = true;
      }
    }
    if (eItems.length > 0 && !flag) {
      this.previewProcessing = true;
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
      //     this.previewProcessing = false;
      //   }, 2000);
      // } else {
        this.crudOperationsService.getPayslips(empList,this.selectedItems).pipe(map((data: any) => {
          let fileBlob = data;
          this.previewProcessing = false;
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
   const eItems = this.employeeList.filter((item: any) => item.selected === true);
    let flag = false;
    if (this.selectedYear == '' && this.selectedItems.length == 0) {
      this.monthAndYearValidationText = 'Month and Year ' + this.errorMsg;
      flag = true;
    } else {
      if (this.selectedItems.length == 0) {
        this.monthValidationText = 'Month ' + this.errorMsg;
        flag = true;
      }
      if (this.selectedYear == '') {
        this.YearValidationText = 'Year ' + this.errorMsg;
        flag = true;
      }
    }
    if (eItems.length > 0 && !flag) {
     // this.generateProcessing = true;
      let empList = [];
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].selected) {
          empList.push(this.employeeList[i]);
        }
      }
      console.log("empList", empList);
      // if (sessionStorage.getItem("role") == 'ROLE_EMPLOYEE') {
      //   this.employeeList = [{ "employeeId": sessionStorage.getItem("empId") }];
      //   this.crudOperationsService.savePayslip(empList)
      //     .subscribe((data: any) => {
      //      // this.generateProcessing = false;
      //       this.notification.notify('success', data.message);
      //     })
      // } else {
        this.crudOperationsService.savePayslip(empList,this.selectedItems)
          .subscribe((data: any) => {
            this.employeeList = data.data;
          //  this.generateProcessing = false;
            this.notification.notify('success', data.message);
          })
     // }
    } else {
      if (eItems == 0) {
        this.validationText = 'Please select atlease 1 employee(s).';
      }
    }
  }
  public currentYear = new Date().getFullYear();
  public currentMonth = new Date().getMonth() + 1; 
  public filteredMonths: any[] = [];
  selected() {
    this.onYearSelected();
    this.monthAndYearValidationText = '';
    this.monthValidationText = '';
    this.YearValidationText = '';
    sessionStorage.setItem("selectedPayslipYear", this.selectedYear);
  }
  onYearSelected(){
    if (Number(this.selectedYear) === this.currentYear) {
      this.filteredMonths = this.months.filter((month: any) => Number(month.id) <= this.currentMonth);
    } else {
      this.filteredMonths = [...this.months];
    }
    this.selectedItems = [];
    this.selectedMonthForPayslip();
  }
  selectedMonthForPayslip() {
   // alert("hi");
    this.monthAndYearValidationText = '';
    this.monthValidationText = '';
    this.YearValidationText = '';
    //alert(JSON.stringify(this.selectedItems));
   // sessionStorage.setItem("selectedPayslipMonth", JSON.stringify(this.selectedItems));

    this.applyFilter();
  }
  public empIds: any = [];
  public toggleLoader: boolean = false;
  getEmpCode(empId: any) {
    console.log("empId", empId);
    this.empIds.push(empId);
  }
  public validationText: string = '';
  public selectedEmployeeCount: any = "";
  onClickCheckBox(id: any) {
    this.validationText = '';
    const i = this.employeeList.findIndex((obj: any) => obj.employeeId == id);
    this.employeeList[i].selected = !this.employeeList[i].selected;

    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    this.selectedEmployeeCount = eItems.length;
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    if(checked){
      this.employeeList.forEach((item: any) => item.selected = checked);
      this.selectedEmployeeCount = this.employeeList.length;
    }else{
      this.employeeList.forEach((item: any) => item.selected = checked);
      this.selectedEmployeeCount = 0;
    }
    
  }
  ngDestroy(): void {
    (<any>$('#myModal-filter')).modal('hide');
  }
}
