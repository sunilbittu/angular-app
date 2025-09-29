import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../../configuration/configuration.service';

@Component({
  selector: 'app-incometax-slab',
  templateUrl: './incometax-slab.component.html',
  styleUrls: ['./incometax-slab.component.css']
})
export class IncometaxSlabComponent implements OnInit {

  public incometaxHeaders: any = ["Id", "Financial Year", "Lower Limit", "Upper Limit", " Percentage", "Action"];
  public slabData: any;
  public submitText: string = '';
  public financialYearList: any = [];
  public saveAlert: boolean = false;
  public updateAlert: boolean = false;
  public deleteAlert: boolean = false;
  public toggleLoader: boolean = false;
  public financialYearModel = '';
  public submitted = false;
  public companyId: any = sessionStorage.getItem("companyId");
  form = this.fb.group({
    financialYear: ["", Validators.required],
    lowerLimit: ["", Validators.required],
    upperLimit: ["", Validators.required],
    slabPercentage: ["", Validators.required],
    remarks: ["", Validators.required]
  })
  get form_() { return this.form.controls; };
  public slabId: any;
  isTaxSlabExist: boolean = false;
  // public taxSlabList: any = [];
  // public obj = {
  //   financialYear:'',
  //   lowerLimit:'',
  //   upperLimit:'',
  //   slabPercentage:'',
  //   remarks:''
  // }
  // public finYearId: any;

  constructor(public fb: FormBuilder, public crudOperationsService: CrudOperationsService,
    private notification: NotifierService, public configurationService: ConfigurationService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchIncomeTaxSlabs();
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

  fetchIncomeTaxSlabs() {
    this.spinner.show();
    this.crudOperationsService.getList("incometaxslab/dropdownList").subscribe((res: any) => {
      this.spinner.hide();
      this.toggleLoader = true;
      this.slabData = res.data;
      this.slabData = res.data;
      this.slabData.sort((a: any, b: any) => a.slabId - b.slabId);

    },
      (error) => {
        this.spinner.hide();
        this.toggleLoader = true;
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  edit(data: any): void {
    this.submitText = 'Update';
    this.slabId = data.slabId;
    this.form.controls['lowerLimit'].setValue(data.lowerLimit);
    this.form.controls['upperLimit'].setValue(data.upperLimit);
    this.form.controls['slabPercentage'].setValue(data.slabPercentage);
    this.form.controls['remarks'].setValue(data.remarks);
    this.financialYearModel = data.financialYearId;

  }
  resetTheForm(): void {
    this.form.reset();
    this.financialYearModel = '';
  }
  addClick() {
    this.submitText = 'Save';
    this.resetTheForm();
    // this.taxSlabList.push(this.obj);
  }
  check() {
    if (this.submitText == 'Save') {
      this.isTaxSlabExist = false;
      let api = 'incometaxslab/validate?financialYear=' + this.financialYearModel + '&order=' + this.form.value.remarks;
      this.crudOperationsService.validate(api)
        .subscribe((data: any) => {
          this.isTaxSlabExist = data;
          if (!this.isTaxSlabExist) {
            this.submit();
          }
        },
          (_error: any) => {
            this.notification.notify('error', 'Something Went Worng');
          })
    } else {
      this.submit();
    }

  }
  submit() {
    this.submitted = true;
    if (!this.isTaxSlabExist) {
      console.log(this.form.value);
      const financialYear = { 'financialYearId': this.financialYearModel };
      this.form.value.financialYear = financialYear;
      if (this.submitText == 'Save') {
        this.crudOperationsService.create(this.form.value, "incometaxslab").subscribe((res: any) => {
          if (res.status == "success") {
            window.scroll(0, 0);
            (<any>$('#add')).modal('hide');
            this.resetTheForm();
            this.fetchIncomeTaxSlabs();
            this.saveAlert = true;
            setTimeout(() => {
              this.saveAlert = false;
            }, 4000);
          }
        })
      } else {
        this.crudOperationsService.update(this.form.value, "incometaxslab/" + this.slabId).subscribe((res: any) => {
          if (res.status == "success") {
            window.scroll(0, 0);
            (<any>$('#add')).modal('hide');
            this.resetTheForm();
            this.fetchIncomeTaxSlabs();
            this.updateAlert = true;
            setTimeout(() => {
              this.updateAlert = false;
            }, 4000);
          }
        })
      }
    }
  }

  remove(data: any) {
    this.slabId = data.slabId;

  }

  deleteSlab() {
    this.crudOperationsService.delete("incometaxslab/" + this.slabId).subscribe((data: any) => {
      this.fetchIncomeTaxSlabs();
      this.deleteAlert = true;
      setTimeout(() => {
        this.deleteAlert = false;
      }, 4000)
    },
      (error) => {
        this.toggleLoader = true;
        this.notification.notify('error', 'Something went wrong!');
      });

  }

  // financialYearChange(event: any) {
  //   this.finYearId = event;
  // }

  // addNew() {
  //   let obj = {
  //     financialYear: '',
  //     lowerLimit:'',
  //     upperLimit:'',
  //     slabPercentage:'',
  //     remarks:''
  //   }
  //   this.taxSlabList.push(obj);
  // }

  // saveIncomeSlab() {
  //   console.log(this.taxSlabList)
  // }
}