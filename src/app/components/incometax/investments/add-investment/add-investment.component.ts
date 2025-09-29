import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-add-investment',
  templateUrl: './add-investment.component.html',
  styleUrls: ['./add-investment.component.css']
})
export class AddInvestmentComponent implements OnInit {

  constructor(public router: Router, public crudOperationsService: CrudOperationsService, 
    private notification: NotifierService, public datePipe: DatePipe, public location: Location) { }
  public investmentYear: any = [];
  public yearModel: any = "";
  public invtypes1: any = [{ id: 1, type: 'Section 80C' },
  { id: 2, type: 'Section 80CCC' }, { id: 3, type: 'Section 80CCD' }, { id: 4, type: 'Other Section' }, { id: 5, type: 'House Rent Allowences' },
  { id: 6, type: 'Deduction of Interest on borrowing' }, { id: 7, type: 'Leave Travel concessions' }
  ];
  ngOnInit(): void {
    let companyId = Number(sessionStorage.getItem("companyId"))
    let url = "financialyear/list-by/" + companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log(data);
      this.investmentYear = data.data.content;
    });
    let employeeId = Number(sessionStorage.getItem("empId"));
    // let url1 ="hrms/tdsinvestmentlimit/tds_investment_list"+employeeId+;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log(data);
      // this.employeeList = data.data.content;
    })
  }
  public toggleSection: boolean = true;
  public togglrRent: boolean = false;
  public togglrDib: boolean = false;
  public togglrLtc: boolean = false;
  public investmentid: any;
  // 
  public ltcRemarkModel: any = "";
  public invNameModel: any = '';
  public ItcDeclareModel: any;
  public ItcMadeModel: any;
  public invDeclareModel: Number = 0;
  public invMadeModel: Number = 0;
  public invremarksModel: any;
  public ItcNameModel: any;

  // 
  // public yearModel:any;
  public LendPanModel: any = "";
  public LendNameModel: any = "";
  public LendDeclaredModel: any = "";
  public LendMadeModel: any = 0;
  public LendAddressModel: any = 0;
  // 
  public evidanceModel: any = '';
  public LandlordNameModel: any;
  public LandlordPanModel: any;
  public LandlordDeclaredModel: any = 0;
  public LandlordMadeModel: any = 0;
  public landAddressModel: any;
  public investmentType: any;
  public tds_date: any;
  public invtypes: any = [];
  public submitted = false;
  public tdsDateModal: any = '';
  onTdsDateValueChange(event: any) {

    let selectedDate = new Date(event);
    this.tds_date = this.datePipe.transform(selectedDate, 'dd-MM-yyyy');
    console.log(this.tds_date);
  }
  getTdsInvestmentList() {
    this.invtypes = [];
    let companyId = Number(sessionStorage.getItem("companyId"));
    let url = "tdsinvestmentlimit/tds_investment_list/" + companyId + '/' + this.yearModel;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log('tds', data);
      let tdsList = data.data;
      // tdsList.
      for (let i = 0; i < tdsList.length; i++) {
        for (let j = 0; j < this.invtypes1.length; j++) {
          if (tdsList[i].investmentType == this.invtypes1[j].type) {
            this.invtypes.push(this.invtypes1[j]);
          }
        }
      }
      console.log('list', this.invtypes);
    });
  }
  public InvestmentType: any = '';
  Investmentclick(event: any, type: any) {
    this.InvestmentType = type;
    this.investmentid = event.target.id
    console.log('Investmentclick()', this.investmentid);
    if (event.target.id == 1 || 2 || 3 || 4) {
      this.toggleSection = true;
      this.togglrLtc = false;
      this.togglrRent = false;
      this.togglrDib = false;
      console.log('1')
    }
    if (event.target.id == 5) {
      this.toggleSection = false;
      this.togglrRent = true;
      this.togglrDib = false;
      this.togglrLtc = false;
      console.log('5')

    }
    if (event.target.id == 6) {
      this.toggleSection = false;
      this.togglrRent = false;
      this.togglrDib = true;
      this.togglrLtc = false;

      console.log('6')

    }
    if (event.target.id == 7) {
      this.toggleSection = false;
      this.togglrLtc = false;
      this.togglrRent = false;
      this.togglrLtc = true;
      console.log('7')

    }
  }

  public selectedFile: any;
  onFileChanged(event: any) {
    //Select File
    console.log('kkkkkk')
    this.selectedFile = event.target.files[0];
    console.log('file', this.selectedFile);
  }
  saveInvestmentSection() {
    this.submitted = true;
    if (this.checkForm()) {
      console.log('this.yearModel', this.yearModel)
      let employeeId = Number(sessionStorage.getItem("empId"));
      let obj = {
        financialYear: {
          financialYearId: Number(this.yearModel)
        },
        employee: {
          employeeId: employeeId
        },
        investmentsName: this.invNameModel,
        investmentDate: this.tds_date,
        declared: Number(this.invDeclareModel),
        made: Number(this.invMadeModel),
        remarks: this.invremarksModel,
        investmentType: this.InvestmentType
      }
      let str = JSON.stringify(obj)
      console.log('str', str)
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('employeeInvestmentDTO', str);
      this.crudOperationsService.uploadeDocument1('employeeinvestment', formData).subscribe((data) => {
        this.notification.notify('success', 'Investment Created Successfully!');
        this.submitted = false;
        this.cancel();
        this.location.back();
      })
    }
    // this.router.navigateByUrl('HRMS/Income-tax/check-investments/investments-table');
  }
  checkForm() {
    return this.invNameModel && this.tdsDateModal && this.evidanceModel;
  }

  saveRentSection() {
    console.log('this.yearModel', this.yearModel)
    let employeeId = Number(sessionStorage.getItem("empId"));
    let obj = {
      financialYear: {
        financialYearId: Number(this.yearModel)
      },
      employee: {
        employeeId: employeeId
      },
      investmentsName: this.LandlordNameModel,
      panNo: this.LandlordPanModel,
      declared: Number(this.LandlordDeclaredModel),
      made: Number(this.LandlordMadeModel),
      address: this.landAddressModel,
      investmentType: this.InvestmentType
    }
    let str = JSON.stringify(obj)

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('employeeInvestmentDTO', str);
    this.crudOperationsService.uploadeDocument1('employeeinvestment', formData).subscribe((data) => {
      this.cancel();
      this.location.back();

    })
  }
  saveDIBSection() {
    console.log('this.yearModel', this.yearModel)
    let employeeId = Number(sessionStorage.getItem("empId"));
    let obj = {
      financialYear: {
        financialYearId: Number(this.yearModel)
      },
      employee: {
        employeeId: employeeId
      },
      investmentsName: this.LendNameModel,
      declared: Number(this.LendDeclaredModel),
      panNo: this.LendPanModel,
      made: Number(this.LendMadeModel),
      investmentType: this.InvestmentType,
      address: this.LendAddressModel
    }
    let str = JSON.stringify(obj)

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('employeeInvestmentDTO', str);
    this.crudOperationsService.uploadeDocument1('employeeinvestment', formData).subscribe((data) => {

      this.cancel();
      this.location.back();

    })
  }
  saveLLeaveTravelSection() {
    console.log('this.yearModel', this.yearModel)
    let employeeId = Number(sessionStorage.getItem("empId"));
    let obj = {
      financialYear: {
        financialYearId: Number(this.yearModel)
      },
      employee: {
        employeeId: employeeId
      },
      investmentsName: this.ItcNameModel,
      declared: Number(this.ItcDeclareModel),
      made: Number(this.ItcMadeModel),
      remarks: this.ltcRemarkModel,
      investmentType: this.InvestmentType
    }
    let str = JSON.stringify(obj)

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('employeeInvestmentDTO', str);
    this.crudOperationsService.uploadeDocument1('employeeinvestment', formData).subscribe((data) => {
      this.location.back();

      this.cancel();
    })
  }
  // employeeinvestment
  cancel() {
    this.yearModel = "";
    this.ltcRemarkModel = "";
    this.evidanceModel = "";
    this.invNameModel = '';
    this.ItcDeclareModel = 0;
    this.ItcMadeModel = 0;
    this.invDeclareModel = 0;
    this.invMadeModel = 0;
    this.invremarksModel = "";
    this.ItcNameModel = "";
    this.LendPanModel = "";
    this.LendNameModel = "";
    this.LendDeclaredModel = "";
    this.LendMadeModel = 0;
    this.LendAddressModel = 0;
    this.LandlordNameModel = "";

    this.LandlordPanModel = "";
    this.LandlordDeclaredModel = "";
    this.LandlordMadeModel = "";
    this.landAddressModel = "";
  }
}
