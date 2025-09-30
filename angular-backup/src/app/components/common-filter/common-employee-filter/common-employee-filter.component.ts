import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-common-employee-filter',
  templateUrl: './common-employee-filter.component.html',
  styleUrls: ['./common-employee-filter.component.css']
})
export class CommonEmployeeFilterComponent implements OnInit {
  public companyId: any;
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
  @Output() filterObj = new EventEmitter<Object>();

  constructor(public crudOperationsService: CrudOperationsService, private employeeService: AddEmployeeService,
    private employeMasterService: EmployeeMastersService, private notification: NotifierService) { }

  ngOnInit(): void {
    this.companyId = Number(sessionStorage.getItem('companyId'));
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

  onClick() {
    this.resetFilter();
    (<any>$('#myModal')).modal('show');
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

  apply() {
    let employeeIdList = [];
    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].selected) {
          employeeIdList.push(this.employeeList[i].employeeId);
        }
      }
      console.log(JSON.stringify(employeeIdList));
      this.filterObj.emit(JSON.stringify(employeeIdList));
    } else {
      this.validationText = 'Please select atlease 1 employee(s).';
    }
  }
}
