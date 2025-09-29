import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ThemeService } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigurationService } from '../../configuration/configuration.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
import { IncometaxService } from '../incometax.service';
@Component({
  selector: 'app-tds-projection',
  templateUrl: './tds-projection.component.html',
  styleUrls: ['./tds-projection.component.css']
})
export class TdsProjectionComponent implements OnInit {
  companyId: any;
  public financialYearList: any = [];
  public financialYearModel = '';
  public filteredEmployeeList: any = [];
  public okText: string = 'Ok';
  public validationText: string = '';
  public loading: boolean = true;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public toggleLoader: boolean = false;
  public showProcess: boolean = false;
  public taxProjectionList: any = [];
  public saveDisable: boolean = false;
  public saveAlert: boolean = false;
  public submitText = 'Save';
  public submitProcessing: boolean = false;
  public isSelectedAll: boolean = false;
  public errorList: any = [];
  public expandAll: boolean = false;
  public declaredFlag: boolean = false;
  public madeFlag: boolean = false;

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
  public searchValue: any = "";

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

  public form = this.fb.group({
    search: [""],
    finYear: ["", Validators.required],
    considerInvestment: [{value: '', disabled: true}, Validators.required],
    month: ["", Validators.required]
  });

  get form_() { return this.form.controls; };

  public headers: any = ["Code", "Name", "Gross-Total", "Exemption", "Deduction", "Taxable Salary", "TDS", "E-Cess",
    "Surcharge", "Total TDS", "Deducted", "Balance", "Monthly"];

  public listHeaders: any = ["Code", "Name", "Financial Year", "Month", "Gross-Total", "Exemption", "Deduction", "Taxable Salary", "TDS",
    "Surcharge", "Total TDS", "Deducted", "Balance", "Monthly"];

  public months: any = [{ key: "April", value: 12 }, { key: "May", value: 11 }, { key: "June", value: 10 },
  { key: "July", value: 9 }, { key: "August", value: 8 }, { key: "September", value: 7 },
  { key: "October", value: 6 }, { key: "November", value: 5 }, { key: "December", value: 4 },
  { key: "January", value: 3 }, { key: "February", value: 2 }, { key: "March", value: 1 }];

  constructor(public configurationService: ConfigurationService, private notification: NotifierService,
    private employeMasterService: EmployeeMastersService, private employeeService: AddEmployeeService,
    private incomeTaxService: IncometaxService, public fb: FormBuilder, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.companyId = sessionStorage.getItem("companyId");
    this.fetchFinancialYear();
    this.getAllTaxProjection();
  }
  getAllTaxProjection() {
    this.spinner.show();
    this.incomeTaxService.fetchTaxProjections(this.companyId).subscribe((res: any) => {
      this.spinner.hide();
      this.loading = false;
      this.taxProjectionList = res.data.content;
    },
      (error) => {
        this.spinner.hide();
        this.loading = false;
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  ngAfterViewInit(): void {
    this.fetchBranchDetailsList();
    this.fetchGradeList();
    this.fetchDepartmentList();
    this.fetchDesignationList();
    this.fetchCostCenterList();
    this.fetchProjectList();
    this.fetchCategoryList();
    this.fetchBankList();
    this.applyFilter();
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
      "companyId": Number(sessionStorage.getItem('companyId')),
      "search": this.searchValue
    }
    this.employeeService.getEmployeesByFilter(filterJson)
      .subscribe((data: any) => {
        this.employeeList = data.data;
        this.employeeList.map(function (obj: any) {
          obj.selected = false;
        })
        console.log(this.employeeList);
      })
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

  fetchFinancialYear() {
    this.configurationService.fetchFinancialYear(this.companyId).subscribe((res: any) => {
      this.financialYearList = res.data.content;
    },
      (error) => {
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  onClick() {
    this.resetFilter();
  }
  submit() {
    this.submitted = true;
    if (this.form.valid) {
      (<any>$('#myModal')).modal('show');
    }
  }
  clickOk() {
    this.okText = 'Please wait!!!';
    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      this.filteredEmployeeList = [];
      let employeeIdList = [];
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].selected) {
          employeeIdList.push(this.employeeList[i].employeeId);
        }
      }
      (<any>$('#myModal')).modal('hide');
      this.loading = true;

      let tempYear = '';
      this.financialYearList.forEach((f: any) => {
        if (this.form.value.finYear == f.financialYearId) {
          tempYear = f.financialYear;
        }
      });

      let monthArray: any = [];
      this.months.forEach((m: any) => {
        if (this.form.value.month < m.value) {
          monthArray.push(m.key);
        }
      });
      let currentMonth = '';
      this.months.forEach((m: any) => {
        if (this.form.value.month == m.value) {
          currentMonth = m.key;
        }
      });
      console.log(monthArray);
      let year = '';
      if (this.form.value.month > 2) {
        year = tempYear.split("-")[0];
      } else {
        year = tempYear.split("-")[1];
      }
      const formObj = {
        'ids': employeeIdList,
        'deduction': this.form.value.considerInvestment,
        'financialYearId': this.form.value.finYear,
        'month': this.form.value.month,
        'mon': monthArray,
        'year': year,
        'currentMonth': currentMonth,
        'finYear': tempYear
      }
      this.incomeTaxService.calculateTaxProjection(this.companyId, JSON.stringify(formObj)).subscribe((res: any) => {
        this.loading = false;
        this.filteredEmployeeList = res.data.result;
        this.errorList = res.data.errors;
        if (this.filteredEmployeeList.length > 0) {
          this.submitProcessing = false;
        }
      },
        (error) => {
          this.loading = false;
          this.notification.notify('error', 'Something went wrong!');
        })
    } else {
      this.okText = 'Ok';
      this.validationText = 'Please select atlease 1 employee(s).';
    }
  }

  saveTds() {
    this.submitProcessing = true;
    this.submitText = 'Please wait!!!';
    let month = '';
    this.months.forEach((m: any) => {
      if (this.form.value.month == m.value) {
        month = m.key;
      }
    });
    let monthArray: any = [];
    this.months.forEach((m: any) => {
      if (this.form.value.month < m.value) {
        monthArray.push(m.key);
      }
    });
    let prevMonth = monthArray[monthArray.length - 1];
    const companyObj = { 'companyId': this.companyId };
    const financialYearObj = { 'financialYearId': this.form.value.finYear };
    this.filteredEmployeeList.map(function (obj: any) {
      const employeeObj = { 'employeeId': obj.employeeId };
      obj.company = companyObj;
      obj.employee = employeeObj;
      obj.month = month;
      obj.financialYear = financialYearObj;
      obj.latestMonth = prevMonth;
    })
    console.log(this.filteredEmployeeList)
    // this.filteredEmployeeList.companyId = this.companyId;
    this.incomeTaxService.saveTds(this.filteredEmployeeList, this.form.value.month).subscribe((res: any) => {
      this.submitText = 'Save';
      this.back();
      this.saveAlert = true;
      this.submitProcessing = false;
      this.getAllTaxProjection();
      this.resetFilter();
      setTimeout(() => {
        this.saveAlert = false;
      }, 4000);
    },
      (error) => {
        this.submitText = 'Save';
        this.submitProcessing = false;
        this.notification.notify('error', 'Something went wrong!');
      })
  }

  processView() {
    this.filteredEmployeeList = [];
    this.showProcess = true;
    this.submitProcessing = true;
  }
  back() {
    this.showProcess = false;
    this.submitProcessing = false;
  }

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

  open() {
    this.expandAll = !this.expandAll;
  }
  expandAllChange() {
    this.expandAll = false;
  }
  onMonthChange(month: any) {
    console.log(month)
    this.months.forEach((m: any) => {
      if (month > 3) {
        this.declaredFlag = true;
        this.madeFlag= false;
      } else {
        this.declaredFlag = false;
        this.madeFlag= true;
      }
    });
  }
}
