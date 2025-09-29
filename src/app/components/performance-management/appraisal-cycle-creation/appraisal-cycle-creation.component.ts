import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../../configuration/configuration.service';
@Component({
  selector: 'app-appraisal-cycle-creation',
  templateUrl: './appraisal-cycle-creation.component.html',
  styleUrls: ['./appraisal-cycle-creation.component.css']
})
export class AppraisalCycleCreationComponent implements OnInit {
  appraisalCycleList: any;
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  financialYearList: any;
  departmentsList: any;
  designationsList: any;
  public apprisalFormObject: any;
  appraisalCycleById: any;
  cancelClicked: any;
  submitText: string = '';
  public financialYearModel = '';
  public departmentNameModel = '';
  public designationNameModel = '';
  public searchModel = '';
  p: number = 1;
  toggleLoader: boolean = false;
  //pagination
  itemsPerPage: any;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  constructor(private crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public configurationService: ConfigurationService, private crudeService: CrudOperationsService, private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService) { }
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public headers: any = ["S.NO", "Year", "Department", "Designation", "Days", "Start Date", "End Date", "Remarks", "Actions"];
  public year: any = "";
  public enableUpdateButton: any;
  public submitProcessing: boolean = false;
  public apprisalForm: any = this.formBuilder.group({
    financialYear: ['', Validators.required],
    departmentName: ['', Validators.required],
    designationName: ['', Validators.required],
    days: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    apraisalRemarks: ['', Validators.required],
  })
  ngOnInit(): void {
    this.fetchAppraisalCycleList();
    this.fetchFinancialYear();
    this.fetchEmployeesDePartments();
    this.fetchEmployeesDesignations();
  }
  clear1() {
    this.apprisalForm.reset();
  }
  clickAdd() {
    this.submitText = 'Save';
    this.resetTheForm();
    this.financialYearModel = '';
    this.departmentNameModel = '';
    this.designationNameModel = '';
  }
  public criteriaFailed = false;
  createAppraisalCycle() {
    this.criteriaFailed = false;
    this.submitProcessing = true;
    if (this.submitText == 'Save') {
      console.log(this.apprisalForm.value);
      this.apprisalFormObject =
      {
        "financialYearId": {
          "financialYearId": this.apprisalForm.value.financialYear,
        },
        "department": {
          "departmentId": this.apprisalForm.value.departmentName,
        },
        "designation": {
          "designationId": this.apprisalForm.value.designationName,
        },
        "days": this.apprisalForm.value.days,
        "startDate": this.apprisalForm.value.startDate,
        "endDate": this.apprisalForm.value.endDate,
        "apraisalRemarks": this.apprisalForm.value.apraisalRemarks,
        "company": { "companyId": this.companyId }
      }

      let api1: any = "appraisalcycle/checck";

      this.crudeService.create(this.apprisalFormObject, api1)
        .subscribe((data: any) => {
          if (data) {
            this.submitProcessing = false;
            this.criteriaFailed = true;
            this.notification.notify('error', 'Appraisal cycle with Financial year, Department and Designation already exist in DB.');
          } else {
            let api: any = "appraisalcycle"
            this.crudeService.create(this.apprisalFormObject, api)
              .subscribe((data: any) => {
                this.submitProcessing = false;
                window.scroll(0, 0);
                (<any>$('#myModal-add')).modal('hide');
                this.notification.notify('success', data.message);
                this.apprisalForm.reset();
                //get list
                this.fetchAppraisalCycleList();
              },
                (error) => {
                  this.submitProcessing = false;
                  this.notification.notify('error', 'Something Went Wrong');
                  //show hide
                })
          }
        },
          (error) => {
            this.notification.notify('error', 'Something Went Wrong');
            //show hide
          })
    } else {
      this.apprisalFormObject =
      {
        "appraisalCycleId": this.appraisalCycleById.appraisalCycleId,
        "financialYearId": {
          "financialYearId": this.apprisalForm.value.financialYear,
        },
        "department": {
          "departmentId": this.apprisalForm.value.departmentName,
        },
        "designation": {
          "designationId": this.apprisalForm.value.designationName,
        },
        "days": this.apprisalForm.value.days,
        "startDate": this.apprisalForm.value.startDate,
        "endDate": this.apprisalForm.value.endDate,
        "apraisalRemarks": this.apprisalForm.value.apraisalRemarks,
        "company": { "companyId": this.companyId },
        "createdBy": this.appraisalCycleById.createdBy,
        "createdDate": this.appraisalCycleById.createdDate,
        "isDeleted": this.appraisalCycleById.isDeleted,
      }
      let api: any = "appraisalcycle/" + this.appraisalCycleById.appraisalCycleId
      this.crudeService.update(this.apprisalFormObject, api)
        .subscribe((data: any) => {
          this.submitProcessing = false;
          this.notification.notify('success', data.message);
          window.scroll(0, 0);
          (<any>$('#myModal-add')).modal('hide');
          this.apprisalForm.reset();
          this.fetchAppraisalCycleList();
        },
          (error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong');
            //show hide
          })
    }
  }
  editAppraisalCycle(id: number) {
    this.submitText = 'Update';
    let api: any = "appraisalcycle/" + id;
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.enableUpdateButton = true;
        this.appraisalCycleById = data.data;
        this.apprisalForm.patchValue({
          financialYear: this.appraisalCycleById.financialYearId.financialYearId,
          departmentName: this.appraisalCycleById.department.departmentId,
          designationName: this.appraisalCycleById.designation.designationId,
          days: this.appraisalCycleById.days,
          startDate: this.appraisalCycleById.startDate,
          endDate: this.appraisalCycleById.endDate,
          apraisalRemarks: this.appraisalCycleById.apraisalRemarks
        })
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
        })
  }
  deleteappraisalCycle(id: number) {
    this.spinner.show();
    let api: any = "appraisalcycle/" + id
    this.crudeService.delete(api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        //show hide
        this.spinner.hide();
        //get kpalist
        this.fetchAppraisalCycleList();
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })
  }
  search() {
    this.fetchAppraisalCycleList();
  }
  fetchAppraisalCycleList() {
    this.spinner.show();
    this.toggleLoader = true;
    this.appraisalCycleList = [];
    let api = "appraisalcycle/list_company/" + this.companyId + "?search=" + this.searchModel + '&page=' + this.pageNumber + '&size=10';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.toggleLoader = false;
      this.appraisalCycleList = data.data.content;
      //pagination call
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
      })
  }
  handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 10;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.itemsPerPage;
    this.showingFrom = (data.data.pageable.pageNumber * 10) + 1;
    const to = (data.data.pageable.pageNumber + 1) * 10;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.fetchAppraisalCycleList();
  }
  fetchFinancialYear() {
    this.configurationService.fetchFinancialYear(this.companyId).subscribe((res: any) => {
      this.financialYearList = res.data.content;
    },
      (error: any) => {
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  fetchEmployeesDePartments() {
    //get companyId
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "department/list_company/" + this.companyId;
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.departmentsList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  fetchEmployeesDesignations() {
    //get companyId
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "designation/list_company/" + this.companyId+'?search=&page=' + this.pageNumber + '&size=20';
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.designationsList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  resetTheForm(): void {
    this.apprisalForm.reset();
    this.financialYearModel = '';
    this.departmentNameModel = '';
    this.designationNameModel = '';
  }
}
