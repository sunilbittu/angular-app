import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-challan-deposite',
  templateUrl: './challan-deposite.component.html',
  styleUrls: ['./challan-deposite.component.css']
})
export class ChallanDepositeComponent implements OnInit {

  constructor(public router: Router, public crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }
  public challansList: any = [];
  public investmentYear: any = [];
  public yearModel: any = "";
  ngOnInit(): void {
    let companyId = Number(sessionStorage.getItem("companyId"))
    this.spinner.show();
    let url1 = "financialyear/list-by/" + companyId;
    this.crudOperationsService.getList(url1).subscribe((data: any) => {
      this.spinner.hide();
      console.log(data);
      this.investmentYear = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
    let url = "challandeposit/list/" + companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log(data);
      this.challansList = data.data.content;

    })
  }


  public headers: any = ["Sr No.", "Payment Mode", "Challan Amount", "Month", "Date of Deposit", "Challan No.", "Cheque No.", "TDS Amount", "Edu Cess", "Interest", "Other", "Total Amount"];

  addChallan() {
    this.router.navigateByUrl('HRMS/Income-tax/add-challan');

  }
}
