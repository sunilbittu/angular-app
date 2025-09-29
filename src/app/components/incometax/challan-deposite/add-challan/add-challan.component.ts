import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-challan',
  templateUrl: './add-challan.component.html',
  styleUrls: ['./add-challan.component.css']
})
export class AddChallanComponent implements OnInit {
  investmentYear: any;

  constructor(public crudOperationsService: CrudOperationsService, public datePipe: DatePipe, public location: Location) { }
  public headers: any = ["Month", "Emp Code", "Emp Name", "TDS", "TDS Deposit", "Income Tax", "Edu Cess", "Surcharge", "Branch", "Department"];
  public companyId: any;
  public bankMasterList: any = [];
  public depositDate: any;
  //models
  public bankModel: any = "";
  public ChequeNoModel = "";
  public eduCessModel = 0;
  public tdsAmountModel: Number = 0;
  public challanNoModel = "";
  public InterestModel = "";
  public otherModel = "";
  public challanAmountModel = "";
  public totalAmountModel: any = "";
  public cashPaymentModel: boolean = true;
  public tdsList: any = [];
  public tdsDeposit: Number = 0;
  public incomeTax: Number = 0;
  public month: any;
  public yearModel: any;
  public submitted: boolean = false;

  // public eduCessModel:Number=0;
  ngOnInit(): void {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = 'bankmaster/list_company/' + this.companyId + "?search=&page=&size=10";
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.bankMasterList = data.data.content;
        console.log(this.bankMasterList);
      });

    let companyId = Number(sessionStorage.getItem("companyId"))

    let url1 = "financialyear/list-by/" + companyId;
    this.crudOperationsService.getList(url1).subscribe((data: any) => {
      console.log(data);
      this.investmentYear = data.data.content;
    })
    // 
  }
  public eduCess = 0;
  public incmTax = 0;
  public surCharge = 0;
  public arr: any = [];
  changeTdsDeposit(i: any) {
    let tds = Number(this.tdsList[i].tdsDeposit) * 4 / 100;
    console.log('aaaa', tds);
    this.eduCess = tds;
    this.incmTax = Number(this.tdsList[i].tdsDeposit) - this.eduCess;
    this.surCharge = 0;
    this.tdsList[i].incometax = this.incmTax;
    this.tdsList[i].eduCess = this.eduCess;
    this.tdsAmountModel = Number(this.tdsAmountModel);
    let v: Number = 0;
    let arr = [];
    let arr1 = [];

    for (var j = 0; j < this.tdsList.length; j++) {
      if (this.tdsList[j].incometax != undefined) {

        arr.push(this.tdsList[j].incometax);
        arr1.push(this.tdsList[j].eduCess);

      }
    }
    console.log(arr);
    this.tdsAmountModel = arr.reduce((total: any, val: Number, index: any) => {
      return this.roundTo(total + val, 2);
    });
    this.eduCessModel = arr1.reduce((total: any, val: Number, index: any) => {
      return this.roundTo(total + val, 2);
    });
    this.totalAmountModel = Number(this.eduCessModel) + Number(this.InterestModel) + Number(this.otherModel) + Number(this.tdsAmountModel);

    console.log('this.tdsAmountModel', this.tdsAmountModel);
    console.log('x', this.arr);
  }
  getpaymentMode(payment: any) {
    console.log(this.cashPaymentModel)
  }
  saveChallan() {
    this.submitted = true;
    if (this.checkForm()) {
      let employeeChallans = [];
      for (let i = 0; i < this.tdsList.length; i++) {
        employeeChallans.push({
          'educationCess': this.tdsList[i].eduCess, 'incomeTax': this.tdsList[i].incometax, 'tdsDeposit': this.tdsList[i].tdsDeposit,
          "taxProjection": { "taxProjectionId": this.tdsList[i].taxProjectionId }
        })
      }
      console.log('employeeChallans', employeeChallans);
      // console.log('this.tdsList',this.tdsList);
      let companyId = sessionStorage.getItem('companyId');
      let obj = {
        "bankMaster": {
          "bankId": Number(this.bankModel)
        },
        "cashPayment": true,
        "challanAmount": Number(this.challanAmountModel),
        "challanNo": this.challanNoModel,
        "chequeNo": this.ChequeNoModel,
        "company": {
          "companyId": Number(companyId)
        },
        "dateOfDeposit": this.depositDate,
        "educationCess": Number(this.eduCessModel),
        "intrest": Number(this.InterestModel),
        "other": Number(this.otherModel),
        "tdsAmount": Number(this.tdsAmountModel),
        "totalAmount": Number(this.totalAmountModel),
        "employeeChallans": employeeChallans,
        "month": this.month
      }
      this.crudOperationsService.create(obj, 'challandeposit')
        .subscribe((data: any) => {
          this.submitted = false;
          this.location.back();
          console.log(data);

        })
    }
    // [
    //     {
    // "educationCess":46.00,
    // "incomeTax":50.00,
    // "tdsDeposit":1200.00,
    // "taxProjection":{
    //     "taxProjectionId":1
    // }
    //     }

    // ]


    // console.log('form', obj);
  }
  checkForm() {
    return this.bankModel && this.challanAmountModel && this.challanNoModel && this.ChequeNoModel && this.tdsAmountModel && this.eduCessModel;
  }
  addInterest() {
    // this.totalAmountModel =Number(this.totalAmountModel)+Number(this.InterestModel) ;
    console.log('this.totalAmountModel', this.totalAmountModel)
  }
  addOthers() {
    // this.totalAmountModel = Number(this.totalAmountModel)+ Number(this.otherModel) ;

  }
  addChallanAmount() {
    // this.totalAmountModel = Number(this.totalAmountModel)+ Number(this.challanAmountModel) ;

  }
  clear() {

  }
  public dod: any = '';
  onTdsDateValueChange(event: any) {
    let selectedDate = new Date(event);
    this.depositDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
    this.dod = this.depositDate;
    console.log(this.depositDate);
  }

  backClicked() {
    this.location.back();
  }

  fetchList() {
    if (this.month != null && this.yearModel != null) {
      let url = "taxprojection/list_tax_projection_for_challan2/" + this.companyId + "/" + this.yearModel + "/" + this.month;
      this.crudOperationsService.getList(url)
        .subscribe((data: any) => {
          console.log(data);
          this.tdsList = data.data.content;

        })
    }
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };



}
