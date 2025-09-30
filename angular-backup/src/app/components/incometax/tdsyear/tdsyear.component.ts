import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigurationService } from '../../configuration/configuration.service';
import { IncometaxService } from '../incometax.service';

@Component({
  selector: 'app-tdsyear',
  templateUrl: './tdsyear.component.html',
  styleUrls: ['./tdsyear.component.css']
})
export class TDSYearComponent implements OnInit {
  submitText: string = '';
  tdsYearId: any;
  companyId: any;
  public financialYearList: any = [];
  public tdsList: any = [];
  public saveAlert: boolean = false;
  public updateAlert: boolean = false;
  public toggleLoader: boolean = false;
  public financialYearModel = '';
  public tdsDate: any = new Date();
  public submitted: boolean = false;
  public toDay = new Date();
  public tds_date: any;
  public selectedDate: any;
  public quarterModel: string = '';

  form = this.fb.group({
    financialYear: ["", Validators.required],
    quarter: ["", Validators.required],
    tdsApplicationDate: ["", Validators.required],
    receiptNumber: [""]
  });
  get form_() { return this.form.controls; };
  public quarterList: any = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"];
  public financialYearHeaders: any = ["Financial Year", "Quarter", "TDS Application Date", "Receipt Number", "Action"];
  constructor(public fb: FormBuilder, public incometaxService: IncometaxService,private spinner: NgxSpinnerService,
    private notification: NotifierService, public configurationService: ConfigurationService, public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.companyId = sessionStorage.getItem("companyId");
    this.fetchTdsYear();
  }
  ngAfterViewInit(): void {
    this.fetchFinancialYear();
  }
  fetchFinancialYear() {
    this.configurationService.fetchFinancialYear(this.companyId).subscribe((res: any) => {
      this.toggleLoader = true;
      this.financialYearList = res.data.content;
    },
      (error) => {
        this.toggleLoader = true;
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  changeFianancialYear(event: any) {
    this.form.value.financialYear = event;
  }
  fetchTdsYear() {
    this.spinner.show();
    this.incometaxService.fetchTdsYear(this.companyId).subscribe((res: any) => {
      this.spinner.hide();
      this.toggleLoader = true;
      this.tdsList = res.data.content;
    },
      (error) => {
        this.spinner.hide();
        this.toggleLoader = true;
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  edit(data: any): void {
    (<any>$('#add')).modal('show');
    this.submitText = 'Update';
    this.tdsYearId = data.tdsYearId;
    this.selectedDate = new Date(data.tdsApplicationDate);
    this.form.controls['tdsApplicationDate'].setValue(this.selectedDate);
    this.form.controls['receiptNumber'].setValue(data.receiptNumber);
    this.financialYearModel = data.financialYearId;
    this.quarterModel = data.quarter;
  }
  resetTheForm(): void {
    this.form.reset();
    this.financialYearModel = '';
    this.quarterModel = '';
  }
  addClick() {
    this.submitText = 'Save';
    this.resetTheForm();
  }
  submit() {
    this.submitted = true;

    console.log(this.form.value);
    const obj = { 'companyId': this.companyId };
    this.form.value.company = obj;
    const financialYear = { 'financialYearId': this.financialYearModel };
    this.form.value.financialYear = financialYear;
    this.form.value.quarter = this.quarterModel;
    if (this.checkForm()) {
      if (this.submitText == 'Save') {
        this.incometaxService.saveTdsYear(this.form.value).subscribe((res: any) => {
          if (res.status == "success") {
            window.scroll(0, 0);
            (<any>$('#add')).modal('hide');
            this.submitted = false;
            this.resetTheForm();
            this.fetchTdsYear();
            this.saveAlert = true;
            setTimeout(() => {
              this.saveAlert = false;
            }, 4000);
          }
        })
      } else {
        this.incometaxService.updateTdsYear(this.tdsYearId, this.form.value).subscribe((res: any) => {
          if (res.status == "success") {
            window.scroll(0, 0);
            (<any>$('#add')).modal('hide');
            this.submitted = false;
            this.resetTheForm();
            this.fetchTdsYear();
            this.updateAlert = true;
            setTimeout(() => {
              this.updateAlert = false;
            }, 4000);
          }
        })
      }
    }
  }

  checkForm() {
    return this.form.value.financialYear && this.form.value.quarter && this.form.value.tdsApplicationDate;
  }
  onTdsDateValueChange(event: any) {
    this.selectedDate = new Date(event);
    this.tds_date = this.datePipe.transform(this.form.value.tdsApplicationDate, 'dd-MM-yyyy');
    console.log(this.tds_date);
    this.tdsDate = new Date(this.tds_date);
  }
  changeQuarter(event: any) {
    console.log(event);
    this.form.value.quarter = event;
  }
}
