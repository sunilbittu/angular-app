import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { UtilitiesService } from '../utilities.service';

@Component({
  selector: 'app-salary-component-master',
  templateUrl: './salary-component-master.component.html',
  styleUrls: ['./salary-component-master.component.css']
})
export class SalaryComponentMasterComponent implements OnInit {

  public showAddCTC: boolean = false;
  public companyId: any;
  public salaryComponentList: any;
  public earningList: any = [];
  public deductionList: any = [];
  public otherList: any = [];
  public ctcList: any = [];
  public salaryFormatType: any = 'EARNINGS';
  public selectedEarningData: any = [];
  public selectedDeductionData: any = [];
  public selectedOtherData: any = [];
  public submitText = '';
  public ctcSubmitText = '';
  public salaryComponentMasterId: any;
  public ctcComponentList: any;
  public ctcComponentId: any;
  public toggleLoader: boolean = false;
  public submitted: boolean = false;
  public submitted1: boolean = false;
  public formulaShow: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitProcessing: boolean = false;
  isSalaryComponentAlreadyExist: any;
  isCtcComponentAlreadyExist: boolean = false;

  constructor(public fb: FormBuilder, public utilitiesService: UtilitiesService, private crudOperationsService: CrudOperationsService,
    private notification: NotifierService, private spinner: NgxSpinnerService) { }

  public salaryCompHeaders: any = ["Salary Component", "Component Code", "Type", "Formula", "Description", "Action"];
  public ctcHeaders: any = ["Component Name", "Action"];
  form = this.fb.group({
    salarycomponent: ["", Validators.required],
    componentCode: ["", Validators.required],
    type: ["", Validators.required],
    formula: [""],
    description: [""]
  });
  get form_() { return this.form.controls; };
  ctcForm = this.fb.group({
    componentname: ["", Validators.required]
  });
  get ctcform_() { return this.ctcForm.controls; };
  ngOnInit(): void {
    // TODO need to refactor
    this.companyId = sessionStorage.getItem("companyId");
    this.fetchSalaryComponent();
  }
  ngAfterViewInit() {
    this.fetchCtcComponent();
  }
  edit(data: any): void {
    (<any>$('#add')).modal('show');
    this.submitText = 'Update';
    this.salaryComponentMasterId = data.salaryComponentMasterId;
    this.form.controls['salarycomponent'].setValue(data.salarycomponent);
    this.form.controls['componentCode'].setValue(data.componentCode);
    this.form.controls['type'].setValue(data.type);
    this.form.controls['formula'].setValue(data.formula);
    this.form.controls['description'].setValue(data.description);
  }
  resetTheForm(): void {
    this.submitted = false;
    this.isSalaryComponentAlreadyExist = false;
    this.form.reset();
  }
  addClick() {
    this.submitText = 'Save';
  }
  showAddCtc() {
    this.ctcSubmitText = 'Save';
    this.showAddCTC = true;
    this.ctcForm.controls['componentname'].setValue('');
    this.mapCtcFields(this.salaryComponentList);
  }
  showListCTC() {
    this.showAddCTC = false;
  }
  setType(type: any) {
    this.salaryFormatType = type;
    this.resetTheForm();
  }
  saveSalaryComponent() {
    this.submitted = true;
    if (this.form.valid && !this.isSalaryComponentAlreadyExist) {
      this.spinner.show();
      this.submitProcessing = true;
      const tempText = this.submitText;
      this.submitText = 'Please wait!!!';
      const obj = { 'companyId': this.companyId };
      this.form.value.company = obj;
      this.form.value.salaryFormatType = this.salaryFormatType;

      if (tempText == 'Save') {
        this.utilitiesService.saveSalaryComponent(this.form.value).subscribe((res: any) => {
          if (res.status == "success") {
            this.submitProcessing = false;
            this.submitted = false;
            window.scroll(0, 0);
            (<any>$('#add')).modal('hide');
            this.resetTheForm();
            this.fetchSalaryComponent();
            this.spinner.hide();
            this.notification.notify('success', 'Record Created Successfully!');
          }
        }, (error) => {
          this.submitText = tempText;
          this.submitProcessing = false;
          this.spinner.hide();
          this.notification.notify('error', 'Something went wrong!');
        })
      } else {
        this.utilitiesService.updateSalaryComponent(this.form.value, this.salaryComponentMasterId).subscribe((res: any) => {
          if (res.status == "success") {
            this.submitProcessing = false;
            this.submitted = false;
            window.scroll(0, 0);
            (<any>$('#add')).modal('hide');
            this.resetTheForm();
            this.fetchSalaryComponent();
            this.spinner.hide();
            this.notification.notify('success', 'Record Updated Successfully!');
          }
        }, (error) => {
          this.submitText = tempText;
          this.submitProcessing = false;
          this.spinner.hide();
          this.notification.notify('error', 'Something went wrong!');
        })
      }
    }
  }
  fetchSalaryComponent() {
    this.spinner.show();
    this.utilitiesService.fetchSalaryComponent(Number(this.companyId)).subscribe((res: any) => {
      this.spinner.hide();
      this.salaryComponentList = res.data;
      this.toggleLoader = true;
      if (Object.keys(this.salaryComponentList).length > 0) {
        this.mapCtcFields(this.salaryComponentList);
      }
    }, (error) => {
      this.spinner.hide();
      this.toggleLoader = true;
    })
  }
  mapCtcFields(salaryComponentList: any) {
    if (salaryComponentList.EARNINGS != undefined) {
      this.earningList = salaryComponentList.EARNINGS;
      if (this.earningList.length > 0) {
        this.earningList.map(function (obj: any) {
          obj.selected = false;
          obj.isDisabled = false;
        })
      }
    }
    if (salaryComponentList.DEDUCTIONS != undefined) {
      this.deductionList = salaryComponentList.DEDUCTIONS;
      if (this.deductionList.length > 0) {
        this.deductionList.map(function (obj: any) {
          obj.selected = false;
          obj.isDisabled = false;
        })
      }
    }
    if (salaryComponentList.OTHERS != undefined) {
      this.otherList = salaryComponentList.OTHERS;
      if (this.otherList.length > 0) {
        this.otherList.map(function (obj: any) {
          obj.selected = false;
          obj.isDisabled = false;
        })
      }
    }
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

  fetchCtcComponent() {
    this.utilitiesService.fetchCtcComponent(Number(this.companyId)).subscribe((res: any) => {
      this.ctcComponentList = res.data;
    })
  }
  submitCtcComponent() {
    this.submitted1 = true;
    if (this.ctcForm.valid && !this.isCtcComponentAlreadyExist) {
      this.spinner.show();
      this.setSelectedList();
      const obj = { 'companyId': this.companyId };
      this.ctcForm.value.company = obj;
      if (this.ctcSubmitText == 'Save') {
        this.utilitiesService.saveCtcComponent(this.ctcForm.value).subscribe((res: any) => {
          if (res.status == "success") {
            this.submitted1 = false;
            window.scroll(0, 0);
            this.showAddCTC = false;
            this.fetchCtcComponent();
            this.spinner.hide();
            this.notification.notify('success', 'CTC Created Successfully!');
          }
        },
          (error: any) => {
            this.spinner.hide();
            this.notification.notify('error', 'Something went wrong');
          })
      } else {
        this.utilitiesService.updateCtcComponent(this.ctcForm.value, this.ctcComponentId).subscribe((res: any) => {
          if (res.status == "success") {
            this.submitted1 = false;
            window.scroll(0, 0);
            this.showAddCTC = false;
            this.fetchCtcComponent();
            this.spinner.hide();
            this.notification.notify('success', 'CTC Updated Successfully!');
          }
        },
          (error: any) => {
            this.spinner.hide();
            this.notification.notify('error', 'Something went wrong');
          })
      }
    }
  }
  setSelectedList() {
    const eItems = this.earningList.filter((item: any) => item.selected === true && item.isDisabled !== true);
    if (eItems.length > 0) {
      this.selectedEarningData = [];
      for (let i = 0; i < this.earningList.length; i++) {
        if (this.earningList[i].selected && !this.earningList[i].isDisabled) {
          this.selectedEarningData.push(this.earningList[i]);
        }
      }
    }
    this.ctcForm.value.earnings = this.selectedEarningData;

    const dItems = this.deductionList.filter((item: any) => item.selected === true && item.isDisabled !== true);
    if (dItems.length > 0) {
      this.selectedDeductionData = [];
      for (let i = 0; i < this.deductionList.length; i++) {
        if (this.deductionList[i].selected && !this.deductionList[i].isDisabled) {
          this.selectedDeductionData.push(this.deductionList[i]);
        }
      }
    }
    this.ctcForm.value.deductions = this.selectedDeductionData;

    const oItems = this.otherList.filter((item: any) => item.selected === true && item.isDisabled !== true);
    if (oItems.length > 0) {
      this.selectedOtherData = [];
      for (let i = 0; i < this.otherList.length; i++) {
        if (this.otherList[i].selected && !this.otherList[i].isDisabled) {
          this.selectedOtherData.push(this.otherList[i]);
        }
      }
    }
    this.ctcForm.value.others = this.selectedOtherData;
  }
  editCtc(data: any) {
    this.showAddCTC = true;
    this.ctcSubmitText = 'Update';
    this.setViewData(data);
  }
  setViewData(data: any) {
    this.mapCtcFields(this.salaryComponentList);
    this.ctcComponentId = data.ctcComponentId;
    this.ctcForm.controls['componentname'].setValue(data.componentname);
    for (var i = 0; i < data.earnings.length; i++) {
      this.earningList.forEach((e: any) => {
        if (e.salaryComponentMasterId === data.earnings[i].salaryComponentMasterId) {
          const index = this.earningList.findIndex((obj: any) => obj.salaryComponentMasterId === e.salaryComponentMasterId);
          this.earningList[index].selected = true;
        }
      });
    }
    for (var i = 0; i < data.deductions.length; i++) {
      this.deductionList.forEach((e: any) => {
        if (e.salaryComponentMasterId === data.deductions[i].salaryComponentMasterId) {
          const index = this.deductionList.findIndex((obj: any) => obj.salaryComponentMasterId === e.salaryComponentMasterId);
          this.deductionList[index].selected = true;
        }
      });
    }
    for (var i = 0; i < data.others.length; i++) {
      this.otherList.forEach((e: any) => {
        if (e.salaryComponentMasterId === data.others[i].salaryComponentMasterId) {
          const index = this.otherList.findIndex((obj: any) => obj.salaryComponentMasterId === e.salaryComponentMasterId);
          this.otherList[index].selected = true;
        }
      });
    }
  }
  viewCtc(data: any) {
    this.showAddCTC = true;
    this.ctcSubmitText = '';
    this.setViewData(data);
    this.earningList.map(function (obj: any) {
      obj.isDisabled = true;
    })
    this.deductionList.map(function (obj: any) {
      obj.isDisabled = true;
    })
    this.otherList.map(function (obj: any) {
      obj.isDisabled = true;
    })
  }

  checkComponent() {
    this.isSalaryComponentAlreadyExist = false;
    console.log(this.form.value.salarycomponent);
    let api = 'salarycomponentmaster/validate?name=' + this.form.value.salarycomponent;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isSalaryComponentAlreadyExist = data;
      },
        (_error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  changeType(){
    const typeValue = this.form.value.type;
    //console.log("value is ================ ",typeValue);
    if(typeValue=="formula"){
      this.formulaShow = true;
    }else{
      this.formulaShow = false;
    }
  }

  checkCtcComponent() {
    this.isCtcComponentAlreadyExist = false;
    console.log(this.ctcForm.value.componentname);
    let api = 'ctccomponent/validate?name=' + this.ctcForm.value.componentname;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isCtcComponentAlreadyExist = data;
      },
        (_error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
}
