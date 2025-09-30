import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'app-financial-year',
  templateUrl: './financial-year.component.html',
  styleUrls: ['./financial-year.component.css']
})
export class FinancialYearComponent implements OnInit {

  submitText: string = '';
  financialYearId: any;
  companyId: any;
  public financialYearList: any = [];
  public saveAlert: boolean = false;
  public updateAlert: boolean = false;
  public toggleLoader: boolean = false;

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure, you want to delete';
  public confirmClicked = false;
  public cancelClicked = false;

  form = this.fb.group({
    financialYear: ["", Validators.required]
  });
  get form_() { return this.form.controls; };
  public submitted: boolean = false;
  public financialYearHeaders: any = ["Financial Year", "Action"];
  isFYExist: any;

  constructor(public fb: FormBuilder, public configurationService: ConfigurationService,
    private notification: NotifierService, private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // TODO need to refactor
    this.companyId = sessionStorage.getItem("companyId");
    this.fetchFinancialYear();
  }
  public searchModel='';
  fetchFinancialYear() {
    this.spinner.show();
    let api:any='financialyear/list?search='+this.searchModel;
    this.crudOperationsService.getList(api).subscribe((res: any) => {
      this.toggleLoader = true;
      this.spinner.hide();
      this.financialYearList = res.data;
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
    this.financialYearId = data.financialYearId;
    this.form.controls['financialYear'].setValue(data.financialYear);
  }
  resetTheForm(): void {
    this.form.reset();
    this.isFYExist = false;
    this.submitted = false;
  }
  addClick() {
    this.isFYExist = false;
    this.submitText = 'Save';
    this.submitted = false;
  }
  submit() {
    this.submitted = true;
    if (!this.isFYExist && this.form.valid) {
      // console.log(this.form.value);
      const obj = { 'companyId': this.companyId };
      this.form.value.company = obj;
      if (this.submitText == 'Save') {
        this.configurationService.saveFinancialYear(this.form.value).subscribe((res: any) => {
          if (res.status == "success") {
            window.scroll(0, 0);
            (<any>$('#add')).modal('hide');
            this.notification.notify('success', 'Financial Year Created Successfully!');
            this.resetTheForm();
            this.fetchFinancialYear();
          }
        })
      } else {
        this.configurationService.updateFinancialYear(this.form.value, this.financialYearId).subscribe((res: any) => {
          if (res.status == "success") {
            window.scroll(0, 0);
            (<any>$('#add')).modal('hide');
            this.notification.notify('success', 'Financial Year Updated Successfully!');
            this.resetTheForm();
            this.fetchFinancialYear();
          }
        })
      }
    }
  }

  delete(id: number) {
    let api = 'financialyear';
    this.crudOperationsService.delete(api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.fetchFinancialYear();
    },
    (error:any) => {
      this.spinner.hide();
      let erroe:any=error.error.message;
      this.notification.notify("error",erroe);
    })
  }

  check() {
    this.isFYExist = false;
    let api = 'financialyear/validate?name=' + this.form.value.financialYear;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isFYExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
}
