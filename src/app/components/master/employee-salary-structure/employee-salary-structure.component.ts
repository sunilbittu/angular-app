import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { UtilitiesService } from '../../utilities/utilities.service';
import { AddEmployeeService } from '../addEmplyee.service';

@Component({
  selector: 'app-employee-salary-structure',
  templateUrl: './employee-salary-structure.component.html',
  styleUrls: ['./employee-salary-structure.component.css']
})
export class EmployeeSalaryStructureComponent implements OnInit {
  constructor(private employeeService: AddEmployeeService, public fb: FormBuilder, public utilitiesService: UtilitiesService,
    private notification: NotifierService, public crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }
  public employeeList!: any[];
  public companyId!: number;
  public salaryComponentList: any;
  public earningList: any = [];
  public deductionList: any = [];
  public selectedPageNumber: number = 0;
  public pageNumbers: any;
  public otherList: any = [];
  public ctcList: any = [];
  public toggleLoader: boolean = false;
  public myFormGroup!: FormGroup;
  highlightRow!: any;
  showSS: boolean = false;
  public saveAlert: boolean = false;
  public employeeId!: any;
  public ss: boolean = false;
  public submitText: String = 'Save';
  public submitProcessing: boolean = false;
  public salaryStructureData: any;
  public isForView: boolean = false;
  public branchId: any;
  public deptId: any;
  public empSalaryStructureId: any = null;
  public updateAlert: boolean = false;
  public grossSalary: number = 0;
  public totalDeductions: number = 0;
  public netPay: number = 0;
  public searchModel = '';
  p: number = 1;
  //pagination
  itemsPerPage: any = 20;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  public ssRequired: boolean = false;

  public employeeNameSample: any;
  public employeeCodeSample: any;

  ngOnInit(): void {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.getAllEmployees();

  }
  public headers: any = ["Emp Code", "Name", "Branch", "Department", "Designation", "Division", "Sal Stru."];

  getAllEmployees() {
    this.spinner.show();
    console.log("search");
    let url = 'employee/search-list/' + this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=20';
    this.crudOperationsService.getList(url)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.employeeList = data.data.content;
        console.log(this.employeeList);
        //pagination call
        this.handlePagination(data);
      },
        (error) => {
          this.spinner.hide();
          console.log(error);
        })
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
    this.getAllEmployees();
  }
  pageChange(id: number) {
    //alert(id);
    this.selectedPageNumber = id;
    let api: any = "employee/list_company/" + this.companyId
    this.crudOperationsService.getPaginationList(api, id)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      })
  }
  //nextPage click
  nextPage() {
    //alert(this.selectedPageNumber);
    let page = this.selectedPageNumber + 1;
    let api: any = "employee/list_company/" + this.companyId
    this.crudOperationsService.getPaginationList(api, page)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      })
  }
  //previous function
  previousPage() {
    let page = this.selectedPageNumber - 1;
    let api: any = "employee/list_company/" + this.companyId + "/?page=" + page
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      })
  }

  getEarningStatus(id: any) {
    const i = this.earningList.findIndex((obj: any) => obj.salaryComponentMasterId == id);
    this.earningList[i].selected = !this.earningList[i].selected;
  }
  getDeductionStatus(id: any) {
    const i = this.deductionList.findIndex((obj: any) => obj.salaryComponentMasterId == id);
    this.deductionList[i].selected = !this.deductionList[i].selected;
  }
  getOtherStatus(id: any) {
    const i = this.otherList.findIndex((obj: any) => obj.salaryComponentMasterId == id);
    this.otherList[i].selected = !this.otherList[i].selected;
  }

  clickedRow(index: Number, deptId: any, branchId: any, employeeId: any, ss: boolean, ssRequired: boolean, employeeCode: any, employeeFirstName: any, employeeLastName: any) {
    this.employeeNameSample = "";
    this.employeeCodeSample = "";
    this.employeeNameSample = employeeFirstName + " " +employeeLastName;
    this.employeeCodeSample = employeeCode;
    if (this.highlightRow === index) {
      this.showSS = false;
      this.highlightRow = undefined;
    }
    else {
      this.showSS = true;
      this.highlightRow = index;
    }
    this.branchId = branchId;
    this.deptId = deptId;
    this.employeeId = employeeId;
    this.ssRequired = ssRequired;
    this.ss = ss;
  }
  fetchSalaryMapping() {
    this.toggleLoader = false;
    this.clearListData();
    this.clearCalculations();
    this.employeeService.fetchSalaryMapping(Number(this.deptId), Number(this.branchId), Number(this.companyId)).subscribe((res: any) => {
      this.salaryComponentList = res.data;
      this.toggleLoader = true;
      if (this.salaryComponentList != null) {
        this.earningList = this.salaryComponentList.earnings;
        this.deductionList = this.salaryComponentList.deductions;
        this.otherList = this.salaryComponentList.others;
      }
    }, (error) => {
      this.toggleLoader = true;
    })
  }

  onclickSubmit() {
    const tempText = this.submitText;
    this.submitText = 'Please wait!!!';
    this.submitProcessing = true;
    const empObj = { 'employeeId': this.employeeId };
    const formObj = { 'earnings': this.earningList, 'deductions': this.deductionList, 'others': this.otherList, 'employeeId': empObj };

    if (tempText == 'Save' && this.empSalaryStructureId == null) {
      this.save(formObj, tempText);
    } else {
      this.update(formObj, tempText);
    }
  }
  update(formObj: any, tempText: String) {
    this.employeeService.updateSalaryStructure(this.empSalaryStructureId, formObj).subscribe((res: any) => {
      if (res.status == "success") {
        window.scroll(0, 0);
        (<any>$('#view_emp')).modal('hide');
        this.submitText = tempText;
        this.submitProcessing = false;
        this.empSalaryStructureId = null;
        this.ssRequired = false;
        this.getAllEmployees();
        this.updateAlert = true;
        setTimeout(() => {
          this.updateAlert = false;
        }, 4000);
      }
    },
      (error) => {
        (<any>$('#view_emp')).modal('hide');
        this.submitText = tempText;
        this.submitProcessing = false;
        this.notification.notify('error', 'Something Went Worng');
      })
  }
  save(formObj: any,  tempText: any) {
    this.employeeService.saveSalaryStructure(formObj).subscribe((res: any) => {
      if (res.status == "success") {
        window.scroll(0, 0);
        (<any>$('#view_emp')).modal('hide');
        this.submitText = tempText;
        this.submitProcessing = false;
        this.empSalaryStructureId = null;
        this.ssRequired = false;
        this.getAllEmployees();
        this.saveAlert = true;
        setTimeout(() => {
          this.saveAlert = false;
        }, 4000);
      }
    },
      (error) => {
        (<any>$('#view_emp')).modal('hide');
        this.submitText = tempText;
        this.submitProcessing = false;
        this.notification.notify('error', 'Something Went Worng');
      })
  }

  onclickAdd() {
    this.isForView = false;
    this.submitText = 'Save';
    if (!this.ss) {
      this.fetchSalaryMapping();
      (<any>$('#view_emp')).modal('show');
    } else if (this.ssRequired) {
      this.fetchSalaryMapping();
      this.fetchSalaryStructureId(this.employeeId);
      (<any>$('#view_emp')).modal('show');
    } else {
      (<any>$('#mod_msg')).modal('show');
    }
  }
  fetchSalaryStructureId(employeeId: any) {
    this.employeeService.fetchSalaryStructureById(employeeId).subscribe((res: any) => {
      this.salaryStructureData = res.data;
      if (this.salaryStructureData != null) {
        this.empSalaryStructureId = this.salaryStructureData.employeeSalaryStructureId;
      }
    }, (error) => {
      this.toggleLoader = true;
    })
  }
  reset() {
    this.clearCalculations();
    this.earningList.map(function (obj: any) {
      obj.componentValue = 0;
    })
    this.deductionList.map(function (obj: any) {
      obj.componentValue = 0;
    })
    this.otherList.map(function (obj: any) {
      obj.componentValue = 0;
    })
  }

  clearListData() {
    this.earningList = [];
    this.deductionList = [];
    this.otherList = [];
  }

  clearCalculations() {
    this.grossSalary = 0;
    this.totalDeductions = 0;
    this.netPay = 0;
  }

  view(employeeId: number) {
    this.isForView = true;
    this.fetchSalaryStructureById(employeeId);
    (<any>$('#view_emp')).modal('show');
  }

  edit(employeeId: number) {
    this.isForView = false;
    this.submitText = 'Update';
    this.fetchSalaryStructureById(employeeId);
    (<any>$('#view_emp')).modal('show');
  }

  fetchSalaryStructureById(employeeId: number) {
    this.clearCalculations();
    this.clearListData();
    this.toggleLoader = false;
    this.employeeService.fetchSalaryStructureById(employeeId).subscribe((res: any) => {
      this.toggleLoader = true;
      this.salaryStructureData = res.data;
      if (this.salaryStructureData != null) {
        this.empSalaryStructureId = this.salaryStructureData.employeeSalaryStructureId;
        this.earningList = this.salaryStructureData.earnings;
        this.deductionList = this.salaryStructureData.deductions;
        this.otherList = this.salaryStructureData.others;
        this.sumOfEarnings();
        this.sumOfDeductions();
      }
      console.log(this.salaryStructureData);
    }, (error) => {
      this.toggleLoader = true;
    })
    
  }

  sumOfEarnings() {
    this.grossSalary = 0;
    this.earningList.forEach((e: any) => {
      this.grossSalary += e.componentValue;
    });
    this.getNetPay();
  }

  sumOfDeductions() {
    this.totalDeductions = 0;
    this.deductionList.forEach((e: any) => {
      this.totalDeductions += e.componentValue;
    });
    this.getNetPay();
  }

  getNetPay() {
    this.netPay = this.grossSalary - this.totalDeductions;
  }
}
