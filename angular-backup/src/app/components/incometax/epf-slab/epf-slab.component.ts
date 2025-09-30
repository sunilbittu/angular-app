import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../../configuration/configuration.service';

@Component({
  selector: 'app-epf-slab',
  templateUrl: './epf-slab.component.html',
  styleUrls: ['./epf-slab.component.css']
})
export class EPFSlabComponent implements OnInit {

  public incometaxHeaders: any = ["From Salary", "To Salary", "Employer Contribution", "Employee Contribution", "Total Contribution", "Action"];
  public slabData: any;
  public submitText: string = '';
  public financialYearList: any = [];
  public saveAlert: boolean = false;
  public updateAlert: boolean = false;
  public deleteAlert: boolean = false;
  public toggleLoader: boolean = false;
  public financialYearModel = '';
  public submitted = false;
  public totalContribution:any = 0;
  public employerContribution:any = 0;
  public employeeContribution:any = 0;
  public companyId: any = sessionStorage.getItem("companyId");
  form = this.fb.group({
    fromSalary: ["", Validators.required],
    toSalary: ["", Validators.required],
    employerContribution: ["", Validators.required],
    employeeContribution: ["", Validators.required],
    totalContribution: ["", Validators.required]
  })
  get form_() { return this.form.controls; };
  public slabId: any;
  isTaxSlabExist: boolean = false;


  public listOfEmployeeResults: any[] = [];
  public showSuccessMsg: boolean = false;
  public errorCount: any;
  public showErrorMsg: boolean = false;
  public successCount: any;

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
    this.crudOperationsService.getList("payslipslab/slobList/epf").subscribe((res: any) => {
      this.spinner.hide();
      this.toggleLoader = true;
      this.slabData = res.data;
      //this.slabData = res.data;
      this.slabData.sort((a: any, b: any) => a.slabId - b.slabId);

    },
      (error) => {
        this.spinner.hide();
        this.toggleLoader = true;
        this.notification.notify('error', 'Something went wrong!');
      })
  }

  public currentSortDirection: 'asc' | 'desc'='asc';
  sortColumn(){
    console.log("epf inside the sortColumn method!");
    this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';

    // Sort the slabData array based on the first column
    this.slabData.sort((a: any, b: any) => {
      let valueA = a.fromSalary;  // Always sort by 'fromSalary'
      let valueB = b.fromSalary;  // Always sort by 'fromSalary'

      console.log("Data type : ",typeof valueA)
      // if (typeof valueA === 'string') {
      //   valueA = valueA.toLowerCase();
      //   valueB = valueB.toLowerCase();
      // }

      if (this.currentSortDirection === 'asc') {
        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0);
      } else {
        return valueA < valueB ? 1 : (valueA > valueB ? -1 : 0);
      }
    });
  }

  edit(data: any): void {
    this.submitText = 'Update';
    this.slabId = data.slabId;
    this.form.controls['fromSalary'].setValue(data.fromSalary);
    this.form.controls['toSalary'].setValue(data.toSalary);
    this.form.controls['employerContribution'].setValue(data.employerContribution);
    this.form.controls['employeeContribution'].setValue(data.employeeContribution);
    this.form.controls['totalContribution'].setValue(data.totalContribution);
    //this.financialYearModel = data.financialYearId;

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
  totaleis(){
   // alert(this.employeContribution);
   //let input = event.target.value;
   //alert(input);
    this.totalContribution = (this.employerContribution + this.employeeContribution).toFixed(2);
  }
  check() {
    if (this.submitText == 'Save') {
      this.isTaxSlabExist = false;
      let api = 'payslipslab/validate?fromSalary=' + this.form.value.fromSalary + '&toSalary=' + this.form.value.toSalary+ '&slabType=' + "epf";
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
     // const financialYear = { 'financialYearId': this.financialYearModel };
      this.form.value.slabType = "epf";
      if (this.submitText == 'Save') {
        this.crudOperationsService.create(this.form.value, "payslipslab").subscribe((res: any) => {
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
        this.crudOperationsService.update(this.form.value, "payslipslab/" + this.slabId).subscribe((res: any) => {
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
    this.crudOperationsService.delete("payslipslab/" + this.slabId).subscribe((data: any) => {
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
  deleteAllSlab() {
    this.crudOperationsService.delete("payslipslab/deleteAll/" + "epf").subscribe((data: any) => {
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

  public importFileData: any = null;

  importFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0].type);

      if (event.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
       // alert("hai");
        this.importFileData = event.target.files[0];
      }
    } else {

    }

  }

  submitImport() {
    this.toggleLoader=true;

    if (this.importFileData != null) {
      let compId: any = sessionStorage.getItem('companyId');
      let form = new FormData();
      form.append("file", this.importFileData);
      //form.append("companyId", compId);
      form.append("slabType", "epf");

      let api: any = "payslipslab/slabImport";
      this.crudOperationsService.create(form, api).subscribe((data: any) => {
        console.log(data)
        this.listOfEmployeeResults = [];
        this.listOfEmployeeResults = data.data;
        this.successCount = (this.listOfEmployeeResults[(this.listOfEmployeeResults.length - 1)])["importSucessCount"];
        this.errorCount = (this.listOfEmployeeResults[(this.listOfEmployeeResults.length - 1)])["importErrorCount"];
        this.ngOnInit();
        console.log(this.successCount);
        console.log(this.errorCount);
        if (this.successCount > 0) {
          this.showSuccessMsg = true;

        }
        if (this.errorCount > 0) {
          this.showErrorMsg = true;
        }
      })
    }
  }

  exportExcel(){
    this.toggleLoader=true;
    //alert("Export to excel")
    let fileType = 'EPFSlabMaster.xls';
    let api: any = "payslipslab/slabExport/epf";
    this.crudOperationsService.exportExcelReport(api, fileType);
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