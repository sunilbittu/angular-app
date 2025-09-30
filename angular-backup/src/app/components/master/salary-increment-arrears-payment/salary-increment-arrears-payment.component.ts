import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { UtilitiesService } from '../../utilities/utilities.service';
import { AddEmployeeService } from '../addEmplyee.service';

@Component({
  selector: 'app-salary-increment-arrears-payment',
  templateUrl: './salary-increment-arrears-payment.component.html',
  styleUrls: ['./salary-increment-arrears-payment.component.css']
})
export class SalaryIncrementArrearsPaymentComponent implements OnInit {
  constructor(private employeeService: AddEmployeeService, public fb: FormBuilder, public utilitiesService: UtilitiesService,
    private notification: NotifierService, public crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }
  public employeeList!: any[];
  public companyId!: number;
  public salaryComponentList: any;
  public earningList: any = [];
  public selectedPageNumber: number = 0;
  public pageNumbers: any;
  public toggleLoader: boolean = false;
  public myFormGroup!: FormGroup;
  highlightRow!: any;
  public employeeId!: any;
  public ss: boolean = false;
  public submitText: String = 'Create';
  public submitProcessing: boolean = false;
  public salaryStructureData: any;
  public empSalaryStructureId: any = null;
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

  //pagination
  public p1: number = 1;
  public itemsPerPage1: any = 20;
  public totalItems1: any;
  public currentPage1: any;
  public totalElements1: number = 0;
  public showingFrom1: number = 0;
  public showingTo1: number = 0;
  public pageNumber1: Number = 0;

  //pagination
  public p2: number = 1;
  public itemsPerPage2: any = 20;
  public totalItems2: any;
  public currentPage2: any;
  public totalElements2: number = 0;
  public showingFrom2: number = 0;
  public showingTo2: number = 0;
  public pageNumber2: Number = 0;

  public ssRequired: boolean = false;

  public years: any = [];
  public selectedYear = '';
  public selectedMonth: any = '';
  public months: any = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  public paymentTypes: any = ['One Time', 'Partial'];
  public installemnts: any = [1, 2, 3, 4, 5];
  public arrearsAmount: any = '';
  public paymentType: any = '';
  public installment: any = '';
  public installmentAmount: any = '';
  public submitted: boolean = false;
  public arrearsSubmitted: boolean = false;
  public showMainList: boolean = true;
  public incrementsList: any = [];
  public arrearsList: any = [];
  public earningComponent: any = [];
  public incrementSubmitText: string = 'Create';
  public arrearsSubmitText: string = 'Create';
  public incrementId: any = '';
  public arrearsId: any = '';
  public isLatestIncrement: boolean = false;

  public installmentPaymentAmount: number = 0;
  public paymentDate: any = new Date();
  public balance: any = 0;
  public installmentRemarks: string = '';
  public now = new Date();
  public selectedPaymentDate: any;
  public arrearsInsSubmitted: boolean = false;
  public arrearsPaymentId = '';
  public arrearsInsList: any = [];

  public incrementHeaders: any = ["Employee Code", "Employee Name", "Component Details", "Applicable from Year-Month"];
  public arrearHeaders: any = ["Employee Code", "Employee Name", "Arrears Amount", "Payment type", "Installments", "Installment Amount", "Paid Installments"];

  ngOnInit(): void {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.getAllEmployees();
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
  public headers: any = ["Employee Code", "Employee Name", "Branch", "Department", "Designation", "Division", "SS"];

  getAllEmployees() {
    this.spinner.show();
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

  clickedRow(index: Number, employeeId: any, ss: boolean, ssRequired: boolean) {
    if (ss) {
      this.highlightRow = index;
      this.employeeId = employeeId;
      this.ssRequired = ssRequired;
      this.ss = ss;
      this.showMainList = false;
      this.getIncrementsAndArrears();
    } else {
      (<any>$('#mod_msg')).modal('show');
    }
  }
  getIncrementsAndArrears() {
    this.arrearsList = [];
    this.incrementsList = [];
    this.getIncrementList();
    this.getArrearsList();
  }
  getIncrementList() {
    this.spinner.show();
    let url = 'salary-increment/list?employeeId=' + this.employeeId + '&page=' + this.pageNumber + '&size=20';
    this.crudOperationsService.getList(url)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.incrementsList = data.data.content;
        //pagination call
        this.handlePagination1(data);
      },
        (error) => {
          this.spinner.hide();
          console.log(error);
        })
  }
  handlePagination1(data: any) {
    this.totalElements1 = data.data.totalElements;
    this.itemsPerPage1 = 20;
    this.currentPage1 = data.data.pageable.pageNumber + 1;
    this.totalItems1 = (data.data.totalPages) * this.itemsPerPage1;
    this.showingFrom1 = (data.data.pageable.pageNumber * this.itemsPerPage1) + 1;
    const to1 = (data.data.pageable.pageNumber + 1) * this.itemsPerPage1;
    if (this.totalElements1 >= to1) {
      this.showingTo1 = to1;
    } else {
      this.showingTo1 = this.totalElements1;
    }
  }
  pageChanged1(event: any) {
    this.pageNumber1 = event - 1;
    this.getIncrementList();
  }
  getArrearsList() {
    this.spinner.show();
    let url = 'arrears-payment/list?employeeId=' + this.employeeId + '&page=' + this.pageNumber + '&size=20';
    this.crudOperationsService.getList(url)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.arrearsList = data.data.content;
        //pagination call
        this.handlePagination2(data);
      },
        (error) => {
          this.spinner.hide();
          console.log(error);
        })
  }
  handlePagination2(data: any) {
    this.totalElements2 = data.data.totalElements;
    this.itemsPerPage2 = 20;
    this.currentPage2 = data.data.pageable.pageNumber + 1;
    this.totalItems2 = (data.data.totalPages) * this.itemsPerPage2;
    this.showingFrom2 = (data.data.pageable.pageNumber * this.itemsPerPage2) + 1;
    const to2 = (data.data.pageable.pageNumber + 1) * this.itemsPerPage2;
    if (this.totalElements2 >= to2) {
      this.showingTo2 = to2;
    } else {
      this.showingTo2 = this.totalElements2;
    }
  }
  pageChanged2(event: any) {
    this.pageNumber2 = event - 1;
    this.getArrearsList();
  }

  changeAmount(index: any, newValue: any, oldValue: any) {
    this.earningList[index].newAmount = newValue + oldValue;
    let percent = Number(this.getRoundOff2Digit(newValue * 100 / oldValue));
    if (!isNaN(percent))
      this.earningList[index].percentage = percent;
    else
      this.earningList[index].percentage = 0;
    this.calculateSumOfAmount();
  }

  incrementEdit(data: any) {
    this.incrementId = data.id;
    this.incrementSubmitText = 'Update';
    this.loadFormData(data);
    this.calculateSumOfAmount();
  }

  loadFormData(data: any) {
    this.earningList = data.earnings;
    this.selectedYear = data.year;
    this.selectedMonth = data.month;
    this.isLatestIncrement = data.isLatestIncrement;

    (<any>$('#salary_inc_modal')).modal('show');
  }

  arrearstEdit(data: any) {
    this.arrearsId = data.id;
    this.arrearsSubmitText = 'Update';
    this.loadArrearsFormData(data);
  }

  payInstallments(data: any) {
    this.installmentRemarks = '';
    this.balance = data.balance;
    this.installmentPaymentAmount = data.installmentAmount
    this.arrearsPaymentId = data.id;
  }

  fetchPaidInstallments(id: any) {
    this.spinner.show();
    let url = 'arrears-installemnt-payment/list?id=' + id;
    this.crudOperationsService.getList(url)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.arrearsInsList = data.data;
      },
        (error) => {
          this.spinner.hide();
          console.log(error);
        })
  }

  loadArrearsFormData(data: any) {
    this.arrearsAmount = data.arrearsAmount;
    this.paymentType = data.paymentType;
    this.installment = data.installments;
    this.installmentAmount = data.installmentAmount;

    (<any>$('#arrears_modal')).modal('show');
  }

  back() {
    this.showMainList = true;
  }

  fetchComponents(data: any) {
    this.earningComponent = data;
  }

  updateSalaryIncrement() {
    this.submitted = true;
    const tempText = this.submitText;
    this.submitText = 'Please wait!!!';
    this.submitProcessing = true;
    const empObj = { 'employeeId': this.employeeId };
    const formObj = {
      'earnings': this.earningList,
      'employeeId': empObj,
      'year': this.selectedYear,
      'month': this.selectedMonth,
      "isLatestIncrement": this.isLatestIncrement ? this.isLatestIncrement : false
    };
    let url = 'salary-increment/' + this.incrementId;
    this.crudOperationsService.update(formObj, url).subscribe((res: any) => {
      if (res.status == "success") {
        this.notification.notify('success', res.message);
        window.scroll(0, 0);
        (<any>$('#salary_inc_modal')).modal('hide');
        this.submitText = tempText;
        this.submitProcessing = false;
        this.submitted = false;
        this.getIncrementList();
      }
    },
      (error) => {
        this.submitText = tempText;
        this.submitProcessing = false;
        this.notification.notify('error', 'Something Went Worng');
      })
  }

  saveSalaryIncrement() {
    this.submitted = true;
    const tempText = this.submitText;
    this.submitText = 'Please wait!!!';
    this.submitProcessing = true;
    const empObj = { 'employeeId': this.employeeId };

    const formObj = {
      'earnings': this.earningList,
      'employeeId': empObj,
      'year': this.selectedYear,
      'month': this.selectedMonth,
      "isLatestIncrement": this.isLatestIncrement ? this.isLatestIncrement : false
    };
    let url = 'salary-increment';
    this.crudOperationsService.create(formObj, url).subscribe((res: any) => {
      if (res.status == "success") {
        this.notification.notify('success', res.message);
        window.scroll(0, 0);
        (<any>$('#salary_inc_modal')).modal('hide');
        this.submitText = tempText;
        this.submitProcessing = false;
        this.submitted = false;
        this.getIncrementList();
      }
    },
      (error) => {
        this.submitText = tempText;
        this.submitProcessing = false;
        this.notification.notify('error', 'Something Went Worng');
      })
  }

  saveArrearsInstallmentPayment() {
    this.arrearsInsSubmitted = true;
    if (this.paymentDate && this.installmentRemarks) {
      this.submitProcessing = true;
      const arrearsObj = { 'id': this.arrearsPaymentId };
      const formObj = {
        'arrears': arrearsObj, 'installmentAmount': this.installmentPaymentAmount,
        'paymentDate': this.paymentDate, 'installmentRemarks': this.installmentRemarks,
        'balance': this.balance
      };
      let url = 'arrears-installemnt-payment';
      this.crudOperationsService.create(formObj, url).subscribe((res: any) => {
        if (res.status == "success") {
          this.notification.notify('success', res.message);
          (<any>$('#arrears_installment_modal')).modal('hide');
          this.submitProcessing = false;
          this.arrearsInsSubmitted = false;
          this.getArrearsList();
        }
      },
        (error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Worng');
        })
    }
  }

  saveArrearsPayment() {
    this.arrearsSubmitted = true;
    if (this.arrearsAmount <= this.calculatedAmt) {
      if (this.paymentType == 'Partial') {
        if (this.arrearsAmount && this.installmentAmount && this.paymentType && this.installment) {
          this.saveArrears();
        }
      } else {
        if (this.arrearsAmount && this.paymentType) {
          this.saveArrears();
        }
      }
    }
  }
  saveArrears() {
    this.submitProcessing = true;
    const empObj = { 'employeeId': this.employeeId };
    const formObj = {
      'arrearsAmount': this.arrearsAmount,
      'employeeId': empObj, 'installmentAmount': this.installmentAmount,
      'paymentType': this.paymentType, 'installments': this.installment,
      'balance': this.arrearsAmount, 'paidInstallments': this.installment
    };
    let url = 'arrears-payment';
    this.crudOperationsService.create(formObj, url).subscribe((res: any) => {
      if (res.status == "success") {
        this.notification.notify('success', res.message);
        window.scroll(0, 0);
        (<any>$('#arrears_modal')).modal('hide');
        this.submitProcessing = false;
        this.arrearsSubmitted = false;
        this.getArrearsList();
      }
    },
      (error) => {
        this.submitProcessing = false;
        this.notification.notify('error', 'Something Went Worng');
      })
  }

  updateArrearsPayment() {
    this.arrearsSubmitted = true;
    if (this.arrearsAmount <= this.calculatedAmt) {
      if (this.paymentType == 'Partial') {
        if (this.arrearsAmount && this.installmentAmount && this.paymentType && this.installment) {
          this.updateArrears();
        }
      } else {
        if (this.arrearsAmount && this.paymentType) {
          this.updateArrears();
        }
      }
    }
  }
  updateArrears() {
    this.submitProcessing = true;
    const empObj = { 'employeeId': this.employeeId };
    const formObj = {
      'arrearsAmount': this.arrearsAmount,
      'employeeId': empObj, 'installmentAmount': this.installmentAmount,
      'paymentType': this.paymentType, 'installments': this.installment,
      'balance': this.arrearsAmount
    };
    let url = 'arrears-payment/' + this.arrearsId;
    this.crudOperationsService.update(formObj, url).subscribe((res: any) => {
      if (res.status == "success") {
        this.notification.notify('success', res.message);
        window.scroll(0, 0);
        (<any>$('#arrears_modal')).modal('hide');
        this.submitProcessing = false;
        this.arrearsSubmitted = false;
        this.getArrearsList();
      }
    },
      (error) => {
        this.submitProcessing = false;
        this.notification.notify('error', 'Something Went Worng');
      })
  }

  reset() {
    this.submitted = false;
    this.earningList.map(function (obj: any) {
      obj.incrementAmount = 0;
      obj.newAmount = 0;
      obj.percentage = 0;
    })
    this.selectedMonth = '';
    this.selectedYear = '';
    this.calculateSumOfAmount();
  }

  clearListData() {
    this.earningList = [];
  }

  resetArrears() {
    this.arrearsSubmitted = false;
    this.arrearsAmount = '';
    this.paymentType = '';
    this.installment = '';
    this.installmentAmount = '';
  }

  resetArrearsIns() {
    this.arrearsInsSubmitted = false;
    this.installmentRemarks = '';
  }

  clickSalaryIncrements() {
    this.reset();
    this.incrementId = null;
    this.incrementSubmitText = 'Create';
    this.fetchSalaryStructureById(this.employeeId);
  }

  clickArrearsPayment() {
    this.resetArrears();
    this.arrearsId = null;
    this.arrearsSubmitText = 'Create';
    this.getLatestIncrement();
  }
  public calculatedAmt: any = 0;
  getLatestIncrement() {
    this.calculatedAmt = 0;
    let url = 'salary-increment/get-latest-increments?employeeId=' + this.employeeId;
    this.crudOperationsService.getList(url).subscribe((res: any) => {
      let result = res.data;
      let totalAmt = 0;
      result.earnings.forEach((e: any) => {
        totalAmt += e.incrementAmount;
      });
      console.log('ta', totalAmt)
      let perMonth = totalAmt;

      let month1 = this.months.indexOf(result.month);
      let monthYear = new Date(result.year, month1)
      let value = this.monthDiff(monthYear, new Date());
      this.calculatedAmt = this.getRoundOff2Digit(perMonth * value);
      console.log('>>>>>>>', this.calculatedAmt)
    },
      (error) => {
        this.notification.notify('error', 'Something Went Worng');
      })
  }

  monthDiff(dateFrom: any, dateTo: any) {
    return dateTo.getMonth() - dateFrom.getMonth() +
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
  }

  fetchSalaryStructureById(employeeId: number) {
    this.clearListData();
    this.calculateSumOfAmount();
    this.toggleLoader = false;
    this.employeeService.fetchSalaryStructureById(employeeId).subscribe((res: any) => {
      this.toggleLoader = true;
      this.salaryStructureData = res.data;
      if (this.salaryStructureData != null) {
        this.empSalaryStructureId = this.salaryStructureData.employeeSalaryStructureId;
        this.earningList = this.salaryStructureData.earnings;
        this.earningList.map(function (obj: any) {
          obj.incrementAmount = 0;
          obj.newAmount = 0;
          obj.percentage = 0;
        })
        this.earningList.forEach((e: any) => {
          e.newAmount = e.componentValue;
        });
        this.calculateSumOfAmount();
      }
      console.log(this.salaryStructureData);
    }, (error) => {
      this.toggleLoader = true;
      this.notification.notify('error', 'Something Went Worng');
    })
  }

  public sumOfOldAmount: number = 0;
  public sumOfNewAmount: number = 0;
  public sumOfIncrementedAmount: number = 0;
  public sumOfPercentage: number = 0;
  calculateSumOfAmount() {
    this.sumOfOldAmount = 0;
    this.sumOfNewAmount = 0;
    this.sumOfIncrementedAmount = 0;
    this.sumOfPercentage = 0;
    this.earningList.forEach((e: any) => {
      this.sumOfOldAmount += e.componentValue;
      if (e.newAmount)
        this.sumOfNewAmount += e.newAmount;
      if (e.incrementAmount)
        this.sumOfIncrementedAmount += e.incrementAmount;
    });
    let percent = Number(this.getRoundOff2Digit(this.sumOfIncrementedAmount * 100 / this.sumOfOldAmount));
    if (!isNaN(percent))
      this.sumOfPercentage = percent;
    else
      this.sumOfPercentage = 0;
  }

  changeInstallments() {
    let amt = this.arrearsAmount / this.installment;
    this.installmentAmount = this.getRoundOff2Digit(amt);
  }

  public getRoundOff2Digit(value: any) {
    return (Math.round(value * 100) / 100).toFixed(2);
  }

  onPaymentDateValueChange(event: any) {
    this.selectedPaymentDate = new Date(event);
  }
}
