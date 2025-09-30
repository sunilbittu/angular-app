import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-loan-mapping',
  templateUrl: './loan-mapping.component.html',
  styleUrls: ['./loan-mapping.component.css']
})
export class LoanMappingComponent implements OnInit {
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public branchList: any = [];
  public departmentList: any = [];
  public projectList!: any[];
  public employeeList: any = [];
  public searchItem: any;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public searchInput: string = '';
  public toggleLoader: boolean = false;
  public toggleLoaderDestination: boolean = false;
  public companyBranchDetailsId: string = '';
  public departmentId: string = '';
  public projectId: string = '';
  public branchName: string = '';
  public departmentName: string = '';
  public projectName: string = '';
  public companyBranchDetailsIdDestination: string = '';
  public departmentIdDestination: string = '';
  public projectIdDestination: string = '';
  public branchNameDestination: string = '';
  public departmentNameDestination: string = '';
  public projectNameDestination: string = '';
  public sourceEmployeeListFromDB: any = [];
  public destinationEmployeeListFromDB: any = [];
  public destinationEmployeeList: any = [];
  public tempDestinationEmployeeList: any = [];
  public tempSourceEmployeeList: any = [];
  public isFormValuesSame: boolean = false;
  public LoanTypesObject: any = [];

  public sourceBranch: any = '';
  public destinationLoan: any = '';
  public sourceDept: any = '';
  public destinationYear: any = '';
  public sourceProject: any = '';

  public loanTypes: any = ['Loan', 'Advance'];
  public loanType: any = 'Loan';

  public form = this.fb.group({
    branch: ['', Validators.required],
    department: ['', Validators.required],
    project: ['', Validators.required]
  });
  public form1 = this.fb.group({
    loanType: ['', Validators.required],
    loan: ['', Validators.required]
  });

  get form_() { return this.form.controls; };
  get form_1() { return this.form1.controls; };

  constructor(private crudOperationsService: CrudOperationsService, public fb: FormBuilder, private spinner: NgxSpinnerService
    , private notification: NotifierService, private employeMasterService: EmployeeMastersService) { }

  ngOnInit(): void {
    this.fetchBranchDetailsList();
    this.fetchProjectList();
    this.fetchLoanTypes(this.loanType);
  }
  fetchLoanTypes(loanType: any) {
    this.destinationLoan = '';
    this.LoanTypesObject = [];
    this.crudOperationsService.getList('loan_type/dropdownList_other/' +
      this.companyId + '?type=' + loanType).subscribe((data: any) => {
        this.LoanTypesObject = data.data;
      });
  }
  getEmployeeByLoanType() {
    this.crudOperationsService.getList('loanmapping/getEmployeeByLoanType?companyId=' +
      this.companyId + '&loanTypeId=' + this.loanTypeId).subscribe((data: any) => {
        this.destinationEmployeeList = data.data;
      });
  }
  fetchProjectList() {
    this.employeMasterService.getProjectMasterList(this.companyId)
      .subscribe((data: any) => {
        this.projectList = data.data.content;
      },
        (error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  fetchBranchDetailsList() {
    this.spinner.show();
    this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.branchList = data.data.content;
      },
        (_error: any) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  changeBranch(model: any) {
    this.companyBranchDetailsId = model.companyBranchDetailsId;
    this.branchName = model.branchName;
    console.log(model.companyBranchDetailsId, 'event.target.value : ' + model.branchName);
    this.fetchDepartmentsByBranch();
  }
  changeDepartment(model: any) {
    this.departmentId = model.departmentId;
    this.departmentName = model.departmentName;
    this.validateFormValues();
  }
  validateFormValues() {
    if (!this.isFormValuesAreSame()) {
      this.isFormValuesSame = false;
      this.search();
    } else {
      this.isFormValuesSame = true;
      this.sourceEmployeeListFromDB.forEach((element: any) => {
        let index = this.employeeList.findIndex(function (emp: any) {
          return emp.employeeId == element.employeeId;
        })
        if (index != -1) {
          this.employeeList.splice(index, 1);
        }
      });
    }
  }
  isFormValuesAreSame() {
    return this.companyBranchDetailsId === this.companyBranchDetailsIdDestination &&
      this.departmentId === this.departmentIdDestination &&
      this.projectId === this.projectIdDestination;
  }
  changeProject(model: any) {
    this.projectId = model.projectId;
    this.projectName = model.projectName;
    this.validateFormValues();
  }
  fetchDepartmentsByBranch() {
    let api: any = 'department/dropdownList_departments/' + this.companyBranchDetailsId;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.departmentList = data.data;
      },
        (error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  search() {
    this.employeeList = [];
    // this.submitted = true;
    this.toggleLoader = true;
    let api: any = 'employee/employee_bench_mapping_list?companyBranchDetailsId=' + this.companyBranchDetailsId
      + '&departmentId=' + this.departmentId + '&projectId=' + this.projectId + '&companyId=' + this.companyId;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.sourceEmployeeListFromDB = data.data;
        this.toggleLoader = false;
        this.sourceEmployeeListFromDB.map(function (obj: any) {
          obj.selected = false;
        })
        this.tempSourceEmployeeList.forEach((element: any) => {
          this.employeeList.push(element);
        });
        this.sourceEmployeeListFromDB.forEach((element: any) => {
          this.employeeList.push(element);
        });
        console.log('before : ', this.employeeList)
        this.tempDestinationEmployeeList.forEach((element: any) => {
          let index = this.employeeList.findIndex(function (emp: any) {
            return emp.employeeId == element.employeeId;
          })
          if (index != -1) {
            this.employeeList.splice(index, 1);
          }
        });
        console.log('after : ', this.employeeList)
      },
        (error: any) => {
          this.notification.notify('error', 'Something Went Worng');
          this.toggleLoader = false;
        })
  }

  addRight() {
    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      eItems.forEach((element: any) => {
        this.destinationEmployeeList.push(element);
        this.tempDestinationEmployeeList.push(element);
        if (this.employeeList.indexOf(element) != -1) {
          this.employeeList.splice(this.employeeList.indexOf(element), 1);
          this.destinationEmployeeList.map(function (obj: any) {
            obj.selected = false;
          })
        }
      });
      console.log(this.destinationEmployeeList)
    }

  }

  clear() {
    this.form_['project'].setValue('');
    this.form_['branch'].setValue('');
    this.form_['department'].setValue('');
  }
  clearDestination() {
    this.form_1['loanType'].setValue('Loan');
    this.form_1['loan'].setValue('');
  }
  onClick() {
    this.isFormValuesSame = false;
    this.submitted = false;
    this.clear();
    this.clearDestination();
    this.companyBranchDetailsId = '';
    this.departmentId = '';
    this.projectId = '';
    this.departmentList = [];
    this.projectList = [];
    this.employeeList = [];
    this.sourceEmployeeListFromDB = [];
    this.destinationEmployeeListFromDB = [];
    this.destinationEmployeeList = [];
    this.tempDestinationEmployeeList = [];
    this.tempSourceEmployeeList = [];
    this.loanTypeId = '';
    this.search();
    this.searchDestination();
  }
  onClickCheckBox(id: any) {
    const i = this.employeeList.findIndex((obj: any) => obj.employeeId == id);
    this.employeeList[i].selected = !this.employeeList[i].selected;
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.employeeList.forEach((item: any) => item.selected = checked);
  }

  onClickCheckBoxDestination(id: any) {
    const i = this.destinationEmployeeList.findIndex((obj: any) => obj.employeeId == id);
    this.destinationEmployeeList[i].selected = !this.destinationEmployeeList[i].selected;
  }

  selectAllDestination(event: any) {
    const checked = event.target.checked;
    this.destinationEmployeeList.forEach((item: any) => item.selected = checked);
  }
  public loanTypeId: any;
  changeLoanDestination(model: any) {
    this.loanTypeId = model.loanId;
    this.searchDestination();
  }
  validateFormValuesDestination() {
    this.destinationEmployeeListFromDB.forEach((element: any) => {
      let index = this.destinationEmployeeList.findIndex(function (emp: any) {
        return emp.employeeId == element.employeeId;
      })
      if (index != -1) {
        this.destinationEmployeeList.splice(index, 1);
      }
    });
  }
  searchDestination() {
    this.destinationEmployeeList = [];
    this.toggleLoaderDestination = true;
    let api: any = 'loanmapping/getEmployeeByLoanType?companyId=' +
      this.companyId + '&loanTypeId=' + this.loanTypeId;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.destinationEmployeeListFromDB = data.data;
        this.toggleLoaderDestination = false;
        this.destinationEmployeeListFromDB.map(function (obj: any) {
          obj.selected = false;
        })
        this.tempDestinationEmployeeList.forEach((element: any) => {
          this.destinationEmployeeList.push(element);
        });
        this.destinationEmployeeListFromDB.forEach((element: any) => {
          this.destinationEmployeeList.push(element);
        });
        console.log('before : ', this.destinationEmployeeList)
        this.tempSourceEmployeeList.forEach((element: any) => {
          let index = this.destinationEmployeeList.findIndex(function (emp: any) {
            return emp.employeeId == element.employeeId;
          })
          if (index != -1) {
            this.destinationEmployeeList.splice(index, 1);
          }
        });
        console.log('after : ', this.destinationEmployeeList)
      },
        (error: any) => {
          this.toggleLoaderDestination = false;
          this.notification.notify('error', 'Something Went Worng');
        })

  }
  update() {
    this.submitted = true;
    let employeeIds = [];
    let loanMappingIds = [];
    if (this.destinationEmployeeList.length > 0) {
      for (let i = 0; i < this.destinationEmployeeList.length; i++) {
        if (this.destinationEmployeeList[i].externalId == null) {
          employeeIds.push(this.destinationEmployeeList[i].employeeId);
        } else {
          loanMappingIds.push(this.destinationEmployeeList[i].externalId);
        }
      }
    }
    if (employeeIds.length > 0 && this.destinationLoan) {
      this.spinner.show();
      var filterJson = {
        "loanMappingIds": loanMappingIds,
        "employeeIds": employeeIds,
        "loanTypeId": this.loanTypeId,
        "companyId": this.companyId
      }
      let api = 'loanmapping/employeeLoanMappingUpdate';
      this.crudOperationsService.create(filterJson, api)
        .subscribe((data: any) => {
          if (data.data != null) {
            this.notification.notify('error', data.data);
          } else {
            this.notification.notify('success', 'Loan Mapped Successfully!');
            this.ngOnInit();
            this.onClick();
          }
          this.spinner.hide();
        },
          (error: any) => {
            this.spinner.hide();
            this.notification.notify('error', 'Something went wrong');
          })
    }

  }

  changeLoanType() {
    this.destinationEmployeeList = [];
    this.fetchLoanTypes(this.loanType);
  }
}
