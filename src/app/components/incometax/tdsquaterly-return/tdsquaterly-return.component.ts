import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ShareDataService } from 'src/app/services/sharaData.service';

@Component({
  selector: 'app-tdsquaterly-return',
  templateUrl: './tdsquaterly-return.component.html',
  styleUrls: ['./tdsquaterly-return.component.css']
})
export class TDSQuaterlyReturnComponent implements OnInit {

  constructor(public router: Router, public crudOperationsService: CrudOperationsService,
    public shareDataService: ShareDataService, private spinner: NgxSpinnerService) { }
  public investmentYear: any = [];
  public yearModel: any;
  public QuarterModel: any = "";
  public Subscription: any;
  public tdsData: any;
  ngOnInit(): void {
    this.Subscription = this.shareDataService.currentMessage.subscribe(message => this.tdsData = message);

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
        console.log(error);
      })
  }
  onTdsDateValueChange(value: any) {

  }
  getTdsDetails() {

    this.shareDataService.changeMessage(this.QuarterModel);

    this.router.navigateByUrl('HRMS/Income-tax/tds-details');
    // 
  }
}
