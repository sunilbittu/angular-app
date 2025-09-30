import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-payslip-component-epf-report',
  templateUrl: './payslip-component-epf-report.component.html',
  styleUrls: ['./payslip-component-epf-report.component.css']
})
export class PayslipComponentEpfReportComponent implements OnInit {


  public startDate = '';
 
  public endDate: any = '';
  public salaryComponent: any = '';
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public role: any;
  public errorMsg = 'Can\'t be blank.';
  public totalAmount:any;
  public totalRecovered:any;
  public totalBalance:any;
  public employeeObjForexport:any;
  public monthAndYearValidationText: string = '';
  public selectedCategoryIds:any=[];
  public monthValidationText: string = '';
  public YearValidationText: string = '';
  public salaryComponentValidationText: String = '';
  public salaryComponentMasterList:any=[];
  public salaryComponentMasterOutList:any=[];
  public submitProcessing: boolean = false;
  public selectedItemsAsset: any = [];
  public submitProcessing1: boolean = false;
  public searchValue: any = "";
  public submitted: boolean=false;
  public employeesExpenseList:any=[];
  public branchDetailsList: any = [];
  public departmentMasterList: any = [];
  public gradeList: any = [];
  public designationList: any = [];
  public costCenterMasterList: any = [];
  public assetCategories: any = [];
  public projectMasterList: any = [];
  public categoryMasterList: any = [];
  public bankMasterList: any = [];
  public selectedItems: any = [];
  public selectedItemsBranch: any = [];
  public selectedItemsGrade: any = [];
  public selectedItemsDepartment: any = [];
  public selectedItemsDesignation: any = [];
  public selectedItemsCostCenter: any = [];
  public selectedItemsSalaryComponent: any = [];
  public selectedItemsProject: any = [];
  public selectedItemsCategory: any = [];
  public selectedItemsBank: any = [];
  public employeeList: any;
  public headers: any = ["Employee Id","Employee Name", "Branch", "Department","Salary Components"];


  public dropdownSettingsAsset = {
    singleSelection: false,
    idField: 'statusId',
    textField: 'statusName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
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


public dropdownSettingsSalaryComponent = {
  singleSelection: false,
  idField: 'salaryComponentMasterId',
  textField: 'salarycomponent',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  itemsShowLimit: 2,
  allowSearchFilter: false,
  };

  public expenseReportList: any;
  totalComponentValues: any=[];

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
    this.fetchAssetCategories();
    this.fetchSalaryComponentList();
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

  fetchAssetCategories() {
    this.assetCategories = [{statusId:1,statusName:"Active"},{statusId:2,statusName:"Reject"},{statusId:3,statusName:"Closed"} ];
   
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

  fetchSalaryComponentList() {
    let api:any="salarycomponentmaster/dropdownList_other/"+this.companyId;
    this.crudOperationsService.getList(api)
    .subscribe((data: any) => {
      for(var i=0; i<data.data.length;i++){
       
        let result = data.data[i].salarycomponent.includes("EPF");
       
        if(result) this.salaryComponentMasterOutList.push(data.data[i]);
      }
      this.salaryComponentMasterList = this.salaryComponentMasterOutList;
    })
    }

  onItemSelectBranch(data: any) { }
  onItemSelectAsset(data: any) { }
  onItemSelectGrade(data: any) { }
  onItemSelectDepartment(data: any) { }
  onItemSelectDesignation(data: any) { }
  onItemSelectCostCenter(data: any) { }
  onItemSelectProject(data: any) { }
  onItemSelectCategory(data: any) { }
  onItemSelectBank(data: any) { }
  onItemSelectSalaryComponent(data: any) { }

  onSelectAllBranch(event: any) { }
  onSelectAllAsset(event: any) { }
  onSelectAllGrade(event: any) { }
  onSelectAllDepartment(event: any) { }
  onSelectAllDesignation(event: any) { }
  onSelectAllCostCenter(event: any) { }
  onSelectAllProject(event: any) { }
  onSelectAllCategory(event: any) { }
  onSelectAllBank(event: any) { }
  onSelectAllSalaryComponent(event: any) { }

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
    console.log(this.selectedItemsSalaryComponent,"comp")
    
    
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
    this.selectedItemsAsset=[];
    this.selectedItemsBranch = [];
    this.selectedItemsGrade = [];
    this.selectedItemsDepartment = [];
    this.selectedItemsDesignation = [];
    this.selectedItemsCostCenter = [];
    this.selectedItemsSalaryComponent=[];
    this.selectedItemsProject = [];
    this.selectedItemsCategory = [];
    this.selectedItemsBank = [];
    this.searchValue = '';
    this.validationText = '';
    this.applyFilter();
  }

  
  generatedexpenseReport() {
    this.submitted=true;
    //alert(this.salaryComponent);
    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    let flag = false;
    if (this.startDate == '' && this.endDate == '' && this.salaryComponent == '') {
      this.monthAndYearValidationText = 'Start Date, End Date & Salary Component ' + this.errorMsg;
      flag = true;
    } else {
      if (this.endDate == '') {
        this.monthValidationText = 'Start Date ' + this.errorMsg;
        flag = true;
      }
      if (this.startDate == '') {
        this.YearValidationText = 'End Date ' + this.errorMsg;
        flag = true;
      }
      if (this.salaryComponent == '') {
        this.salaryComponentValidationText = 'Salary Component ' + this.errorMsg;
        flag = true;
      }
    }
    if(this.selectedItemsAsset.length >0){
      for(let i=0 ; i< this.selectedItemsAsset.length ;i++){
        this.selectedCategoryIds.push(this.selectedItemsAsset[i].statusId);
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

      let salaryComponentList:any=[];
      for (let i = 0; i < this.selectedItemsSalaryComponent.length; i++) {
        if (this.selectedItemsSalaryComponent[i].selected) {
          salaryComponentList.push(this.selectedItemsSalaryComponent[i]);
        }
      }
        let repObj = { "employeeIds": empList ,"salaryComponents":this.selectedItemsSalaryComponent};
        this.employeeObjForexport=repObj;
        let url='salarycomponentmaster/salary_component_report/'+this.companyId+'/'+this.startDate+'/'+this.endDate;
        this.crudOperationsService.create(repObj,url).subscribe((resp:any)=>{
          (<any>$('#myModal-filter')).modal('hide')
          this.submitProcessing = false;
          this.submitted=false;
          
          if(resp.data == ''){
            this.notification.notify('','No Records Found');
          }
          if(resp.data != ''){
            this.expenseReportList=resp.data;
            this.totalComponentValues=this.expenseReportList[0].finalComponentsListTotals;
          }
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
    sessionStorage.setItem("selectedPayslipYear", this.startDate);
  }
  selectedMonthForPayslip() {
    this.monthAndYearValidationText = '';
    this.monthValidationText = '';
    this.YearValidationText = '';
    sessionStorage.setItem("selectedPayslipMonth", this.endDate);
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

  // exportTable(type: string) {
  //   //spinner show
  //   this.spinner.show();
  //   var fileType = '';
  //   if (type == 'EXCEL') {
  //     fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  //   }
  //   else {
  //     fileType = 'application/pdf';
  //   }
  //   let empList = [];
  //     for (let i = 0; i < this.employeeList.length; i++) {
  //       if (this.employeeList[i].selected) {
  //         empList.push(this.employeeList[i]);
  //       }
  //     }
  //   this.employeeList = [{ "employeeId": sessionStorage.getItem("empId") }];
  //   let api: any = "reports/loanAdvanceReport/"+this.companyId +"/"+ type ;
  //   this.crudOperationsService.downloadDocumentExpenseReport(api,this.employeeObjForexport)
  //     .subscribe((response: any) => {
  //       //spinner hide
  //       this.spinner.hide();
  //       let blob: any = new Blob([response], { type: fileType });
  //       const url = window.URL.createObjectURL(blob);
  //       window.open(url);
  //       //window.location.href = response.url;
  //       //this._FileSaverService.save(blob,'Employee_Branch_Report');
  //     },
  //       (error) => {
  //         this.notification.notify('error', 'Something Went Worng');
  //         //spinner hide
  //         this.spinner.hide();
  //       }
  //     )
  // }

  

  exportTable(type: string){
    this.companyId = Number(sessionStorage.getItem('companyId'));
    //spinner show
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'EmployeeSalaryComponentReport.xls';
      let api: any = "reports/salaryComponentReport/exportExcel/"+this.companyId+"/"+this.startDate+'/'+this.endDate;
      this.crudOperationsService.exportExcelReport2(api,fileType,this.employeeObjForexport)
    }
    else {
      fileType = 'EmployeesSalaryComponentReport.pdf';
      let api: any = "reports/salaryComponentReport/exportPDF/"+this.companyId+"/"+this.startDate+'/'+this.endDate;
      this.crudOperationsService.exportPDF2(api,fileType,this.employeeObjForexport)
    }
  }
  


}
