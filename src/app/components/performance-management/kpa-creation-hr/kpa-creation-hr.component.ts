import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../../configuration/configuration.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
declare var $: any;
@Component({
  selector: 'app-kpa-creation-hr',
  templateUrl: './kpa-creation-hr.component.html',
  styleUrls: ['./kpa-creation-hr.component.css']
})
export class KpaCreationHrComponent implements OnInit {
  public kpaCreationForm!: FormGroup;
  public designationsList: any;
  public departmentsList: any;
  public gradesList: any;
  public companyId!: number;
  public financialYearList: any = [];
  public kpaList: any;
  public kpaObject: any;
  public kpaObjectArray: any = [];
  public kpaDetailsById: any;
  public enableUpdateButton: any;
  public branchDetailsList!: any[];
  public cancelClicked!: any;
  public submitProcessing: boolean = false;
  public submitted!: boolean;
  submitText: string = '';
  p: number = 1;
  //pagination
  itemsPerPage: any;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  public popoverTitle = 'Delete Confirmation';
  public requiredErrorText = 'can\'t be blank';
  public popoverMessage = 'Are you sure you want delete';
  public headers: any = ['KPA Name', 'Designation', 'Departmennt', 'Grade', 'Year', 'Remarks', 'Action'];
  constructor(private formBuilder: FormBuilder, private crudeService: CrudOperationsService,
    private notification: NotifierService, public configurationService: ConfigurationService,
    private spinner: NgxSpinnerService, private employeMasterService: EmployeeMastersService) { }
  ngOnInit(): void {
    this.kpaCreationForm = this.formBuilder.group({
      kpaName: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      branch: ['', Validators.required],
      grade: ['', Validators.required],
      financialYear: ['', Validators.required],
      remarks: ['', Validators.required]
    });
    //get employees designations
    this.fetchEmployeesDesignations();
    //get Branch List 
    this.fetchBranchDetailsList();
    //get Department List
    this.fetchEmployeesDePartments(this.companyId);
    //get Grade List 
    this.fetchEmployeesGrade();
    //fetch financial year
    this.fetchFinancialYear();
    //get kpalist
    this.fetchList()
  }
  get form_() { return this.kpaCreationForm.controls; };
  //get employees designations
  fetchEmployeesDesignations() {
    //get companyId
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = 'designation/list_company/' + this.companyId+'?search=&page=' + this.pageNumber + '&size=20';
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.designationsList = data.data.content;
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  fetchBranchDetailsList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {
        this.branchDetailsList = data.data.content;
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //calling departmments based on branchId
  onchangeBranch(branchId: number) {
    //alert(branchId);
    this.fetchEmployeesDePartments(branchId);
  }
  //get Department List 
  fetchEmployeesDePartments(id: number) {
    this.employeMasterService.getDepartmentList(id)
      .subscribe((data: any) => {
        this.departmentsList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  //get Grade List 
  fetchEmployeesGrade() {
    //get companyId
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "grademaster/list/" + this.companyId+ "?search=&page=&size=10";
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.gradesList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  //fetch financial year
  fetchFinancialYear() {
    this.configurationService.fetchFinancialYear(this.companyId).subscribe((res: any) => {
      this.financialYearList = res.data.content;
    },
      (error) => {
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  //get kpalist
  fetchKpaListByCompanyId() {
    this.spinner.show();
    let api: any = 'goal_kpa/list_company/' + this.companyId + '?page=' + this.pageNumber + '&size=10';
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.kpaList = data.data.content;
        this.spinner.hide();
        //pagination call
        this.handlePagination(data);
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Wrong');
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
    this.fetchList();
  }
  //search data in table by
  public searchModel = '';
  fetchList() {
    //show spinner
    this.spinner.show();
    let api: any = 'goal_kpa/goal_kpa_search_list/' + this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=10';
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.kpaList = data.data.content;
        //show hide
        this.spinner.hide();
        //pagination call
        this.handlePagination(data);
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })
  }
  //edit function
  getKpaDetailsById(id: number) {
    this.submitText = 'Update';
    //show spinner
    this.spinner.show();
    let api: any = 'goal_kpa/' + id;
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.kpaDetailsById = data.data;
        //enable update button
        this.enableUpdateButton = true;
        //show hide
        this.spinner.hide();
        this.kpaCreationForm.patchValue({
          kpaName: this.kpaDetailsById.kpaName,
          designation: this.kpaDetailsById.designationId.designationId,
          department: this.kpaDetailsById.department.departmentId,
          grade: this.kpaDetailsById.gradeMaster.gradeId,
          financialYear: this.kpaDetailsById.financialYear.financialYearId,
          remarks: this.kpaDetailsById.kpaRemarks
        })
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })
  }
  updateKpaData() {
    //show spinner
    this.spinner.show();
    this.submitProcessing = true;
    this.kpaObject =
    {
      'kpaId': this.kpaDetailsById.kpaId,
      'kpaName': this.kpaCreationForm.value.kpaName,
      'designationId': {
        'designationId': this.kpaCreationForm.value.designation
      },
      'department': {
        'departmentId': this.kpaCreationForm.value.department
      },
      'gradeMaster': {
        'gradeId': this.kpaCreationForm.value.grade
      },
      'financialYear': {
        'financialYearId': this.kpaCreationForm.value.financialYear
      },
      'kpaRemarks': this.kpaCreationForm.value.remarks,
      'company': {
        'companyId': this.companyId
      },
      'createdBy': this.kpaDetailsById.createdBy,
      'createdDate': this.kpaDetailsById.createdDate,
      'isDeleted': this.kpaDetailsById.isDeleted,
    }
    let api: any = 'goal_kpa/' + this.kpaDetailsById.kpaId
    this.crudeService.update(this.kpaObject, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        this.submitProcessing = false;
        this.kpaCreationForm.reset();
        //show hide
        this.spinner.hide();
        //hide modelpopup
        (<any>$('#add')).modal('hide');
        //get kpalist
        this.fetchList()
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
          this.submitProcessing = false;
        })
  }
  //delete kpa record
  deleteKpaData(id: number) {
    //show spinner
    this.spinner.show();
    let api: any = 'goal_kpa/' + id
    this.crudeService.delete(api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        //show hide
        this.spinner.hide();
        //get kpalist
        this.fetchList()
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })
  }
  onSubmit() {
    if (this.submitText == 'Update') {
      this.updateKpaData();
    }
    if (this.submitText == 'Save') {
      this.validate();
    }
  }
  validate() {
    //show spinner
    this.submitted = true;
    console.log("kpa value is ========= ", this.kpaCreationForm.valid);
    // if (this.kpaCreationForm.valid == true) {
    this.spinner.show();
    this.kpaObject =
    {
      'kpaName': this.kpaCreationForm.value.kpaName,
      'designationId': {
        'designationId': this.kpaCreationForm.value.designation
      },
      'department': {
        'departmentId': this.kpaCreationForm.value.department
      },
      'gradeMaster': {
        'gradeId': this.kpaCreationForm.value.grade
      },
      'financialYear': {
        'financialYearId': this.kpaCreationForm.value.financialYear
      },
      'kpaRemarks': this.kpaCreationForm.value.remarks,
      'company': {
        'companyId': this.companyId
      }
    }
    //console.log(this.kpaObject);
    let api: any = 'goal_kpa/validate'
    this.crudeService.create(this.kpaObject, api)
      .subscribe((data: any) => {
        const key = Object.keys(data);
        const value = Object.values(data);
        let msg: any;
        for (let i = 0; i < value.length; i++) {
          msg = value[i];
        }
        if (key.indexOf("true") !== -1) {
          this.spinner.hide();
          this.notification.notify('error', msg);
          this.spinner.hide();
        } else {
          this.submitted = false;
          this.saveKpaData();
        }
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })

    // }
  }
  saveKpaData() {
    //show spinner
    // this.spinner.show();
    this.submitProcessing = true;
    this.kpaObject =
    {
      'kpaName': this.kpaCreationForm.value.kpaName,
      'designationId': {
        'designationId': this.kpaCreationForm.value.designation
      },
      'department': {
        'departmentId': this.kpaCreationForm.value.department
      },
      'gradeMaster': {
        'gradeId': this.kpaCreationForm.value.grade
      },
      'financialYear': {
        'financialYearId': this.kpaCreationForm.value.financialYear
      },
      'kpaRemarks': this.kpaCreationForm.value.remarks,
      'company': {
        'companyId': this.companyId
      }
    }
    //console.log(this.kpaObject);
    let api: any = 'goal_kpa'
    this.crudeService.create(this.kpaObject, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        this.kpaCreationForm.reset();
        this.submitProcessing = false;
        //show hide
        this.spinner.hide();
        //hide modelpopup
        (<any>$('#add')).modal('hide');
        //get kpalist
        this.fetchList()
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          this.submitProcessing = false;
          //show hide
          this.spinner.hide();
        })
  }
  resetTheForm(): void {
    this.kpaCreationForm.reset();
    // this.submitProcessing = true;
  }
  clickAdd() {
    this.submitText = 'Save';
    this.resetTheForm();
  }
}
