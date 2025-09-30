import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-tds-investment',
  templateUrl: './tds-investment.component.html',
  styleUrls: ['./tds-investment.component.css']
})
export class TdsInvestmentComponent implements OnInit {

  constructor(public crudOperationsService: CrudOperationsService, private notification: NotifierService, private spinner: NgxSpinnerService) { }
  public headers: any = ["Sr No.", "Financial Year", "Investment Type", "Limit", "Remarks", "Action"];
  public yearModel: any = "";
  public investmentYear: any = [];
  public InvestmentType: any = "";
  public tdsLimit: any = '';
  public Remarks: any;
  public investmentLimits: any = [];
  public submitted = false;
  public invtypes: any = [{ id: 1, type: 'Section 80C' },
  { id: 2, type: 'Section 80CCC' }, { id: 3, type: 'Section 80CCD' }, { id: 4, type: 'Other Section' }, { id: 5, type: 'House Rent Allowences' },
  { id: 6, type: 'Deduction of Interest on borrowing' }, { id: 7, type: 'Leave Travel concessions' }
  ];
  ngOnInit(): void {
    this.spinner.show();
    let companyId = sessionStorage.getItem("companyId")
    let url = "financialyear/list-by/" + companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      console.log(data);
      this.investmentYear = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something went wrong!');
      })
    let url1 = "tdsinvestmentlimit/list/" + companyId;
    this.crudOperationsService.getList(url1).subscribe((data: any) => {
      console.log('data', data);
      this.investmentLimits = data.data.content;
    })
  }
  clear() {
    this.InvestmentType = "";
    this.Remarks = "";
    this.tdsLimit = "";
    this.yearModel = "";
    this.submitted = false;
  }
  public tdsInvestmentLimitId: Number = 0;
  public togglebtn: boolean = true;
  editTdsLimits(data: any) {
    this.togglebtn = false;
    this.tdsInvestmentLimitId = data.tdsInvestmentLimitId;
    this.InvestmentType = data.investmentType;
    this.Remarks = data.limitRemarks;
    this.tdsLimit = data.tdsLimit;
    this.yearModel = data.financialYearId
    // this.yearModel=
  }
  createInvestment() {
    this.submitted = true;
    if (this.yearModel && this.InvestmentType && this.tdsLimit) {
      let obj = {
        company: {
          companyId: Number(sessionStorage.getItem("companyId"))
        },
        investmentType: this.InvestmentType,
        limitRemarks: this.Remarks,
        tdsLimit: Number(this.tdsLimit),
        financialYear: {
          financialYearId: Number(this.yearModel)
        },
      }
      this.crudOperationsService.create(obj, 'tdsinvestmentlimit').subscribe((data) => {
        this.notification.notify('success', 'Investment Created Successfully!');
        (<any>$('#myModal-add')).modal('hide');
        this.clear();
        this.ngOnInit();
      })
    }
  }
  UpdateInvestment() {
    this.submitted = true;
    if (this.yearModel && this.InvestmentType && this.tdsLimit) {
      let obj = {

        investmentType: this.InvestmentType,
        limitRemarks: this.Remarks,
        tdsLimit: Number(this.tdsLimit),
        financialYear: {
          financialYearId: Number(this.yearModel)
        },
      }
      this.crudOperationsService.update(obj, 'tdsinvestmentlimit/' + this.tdsInvestmentLimitId).subscribe((data) => {
        this.notification.notify('success', 'Investment Updated Successfully!');
        (<any>$('#myModal-add')).modal('hide');
        this.togglebtn = true;
        this.clear();
        this.ngOnInit();

      })
    }
  }
}
