import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-issuing-asset',
  templateUrl: './issuing-asset.component.html',
  styleUrls: ['./issuing-asset.component.css']
})
export class IssuingAssetComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe) { }

  public headers: any = ['Asset Name', 'Description', 'Alloted To', 'Branch', 'Issued Date', 'Issued By', 'Actions'];
  public barcodeItems: any = [];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public employeeName: any;
  public empId: any;
  public assetList: any = [];
  public issuedAssetList: any = [];
  public resources: any = [];
  public type: any = '';
  public id: any = '';
  public searchModel = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public selectedIssuedDate: any;
  public now = new Date();
  public submitText = '';
  public api = 'issuing-asset'
  public submitProcessing = false;
  public employeeDetails: any = {};
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public isForViewAndSubmitDisabled: boolean = false;
  public submitErrorText: any = '';
  public assetForm = this.formBuilder.group({
    allotedBy: [''],
    assetId: ['', Validators.required],
    description: ['', Validators.required],
    branch: [''],
    department: [''],
    designation: [''],
    issuedBy: [''],
    issuedDate: ['', Validators.required],
    availableQuantity: ['', Validators.required],
    barcodeOfItem: ['', Validators.required],
  })

  public showOwnerEmployee: boolean = false;
  public ownerName = '';
  public selectedItems: any = [];
  public dropdownSettings: any = {
    singleSelection: true,
    idField: 'employeeId',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  };

  //pagination
  p: number = 1;
  itemsPerPage: any;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;

  get form_() { return this.assetForm.controls; };

  get _form() { return this.assetForm.value };

  ngOnInit(): void {
    this.getIssueidAssets();
  }
  ngAfterViewInit(): void {
    this.getAppliedAssets();
    this.getEmpDetails();
  }

  getEmpDetails() {
    this.crudOperationsService.getList('employee/get_employee_by_id/' + this.employeeId)
      .subscribe((data: any) => {
        if(data.data) {
          this.employeeDetails = data.data;
        }
        //  else {
        //   this.employeeDetails = {
        //     employeeId: this.employeeId,
        //     firstName: sessionStorage.getItem('employeeName'),
        //     lastName: ''
        //   }
        // }
      });
  }
  onItemSelect(data: any) {
    let result = this.resources.find((x: any) => x.employeeId === data.employeeId);
    this.form_['branch'].patchValue(result.branch);
    this.form_['department'].patchValue(result.department);
    this.form_['designation'].patchValue(result.designation);
  }
  setFormValue() {
    this.form_['branch'].patchValue('');
    this.form_['department'].patchValue('');
    this.form_['designation'].patchValue('');
  }
  onItemDeSelect(data: any) {
    this.setFormValue();
  }

  getIssueidAssets() {
    this.spinner.show();
    let api = this.api + '/list/' + this.companyId + '?search='+this.searchModel+'&page=' + this.pageNumber + '&size=10';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.issuedAssetList = data.data.content;
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
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
    this.getIssueidAssets();
  }
  getAppliedAssets() {
    let api = this.api + '/getApprovedAssetList?companyId=' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.assetList = data.data;
    },
      (error) => {
        console.log(error);
      })
  }

  public isAvailableQtyInValid : boolean = false;
  changeName() {
    this.isAvailableQtyInValid = false;
    let result = this.assetList.find((e: any) => e.assetId == this._form.assetId);
    this.form_['description'].patchValue(result.description);
    this.form_['availableQuantity'].patchValue(result.quantity);
    if(result.quantity == 0) {
      this.isAvailableQtyInValid = true;
    }
    this.barcodeItems = [];
    this.getBarcodeOfItems(result.assetId);
  }
  getBarcodeOfItems(assetId: any) {
    let api = this.api + '/getBarcodeOfItems?assetId=' + assetId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.barcodeItems = data.data;
    },
      (error) => {
        console.log(error);
      })
  }

  modelShow() {
    this.clear();
  }

  modelShowView(data: any) {
    this.loadFormData(data, true);
  }
  loadFormData(data: any, isForView: boolean) {
    this.assetForm.reset();
    this.selectedItems = [];
    this.form_['assetId'].patchValue(data.assetId.assetId);
    this.getFilteredBarcodeOfItems(data.assetId.assetId, data.barcodeOfItem.childAssetId);
    this.form_['description'].patchValue(data.assetId.description);
    this.form_['branch'].patchValue(data.branch);
    this.form_['department'].patchValue(data.department);
    this.form_['designation'].patchValue(data.designation);
    this.form_['issuedBy'].patchValue(data.issuedEmployeeId + '-' + data.issuedEmployeeName);
    this.form_['issuedDate'].patchValue(this.datePipe.transform(data.issuedDate, 'dd-MM-yyyy'));
    this.form_['availableQuantity'].patchValue(data.availableQuantity);
    this.type = data.type;
    this.id = data.issuingId;
    // this.changeOwner();
    if (isForView) {
      this.isForViewAndSubmitDisabled = true;
      this.assetForm.disable();
    } else {
      this.isForViewAndSubmitDisabled = false;
      this.assetForm.enable();
      this.form_['assetId'].disable();
      this.form_['barcodeOfItem'].disable();
    }
    this.showOwnerEmployee = true;
    this.selectedItems.push({ employeeId: data.resourceEmployeeId, fullName: data.resourceName });
    (<any>$('#addPopup')).modal('show');
    this.selectedIssuedDate = new Date(data.issuedDate);
  }
  getFilteredBarcodeOfItems(assetId: any, childAssetId: any) {
    let api = this.api + '/getFilteredBarcodeOfItems?assetId=' + assetId + '&childAssetId=' + childAssetId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.barcodeItems = data.data;
      this.form_['barcodeOfItem'].patchValue(childAssetId);
    },
      (error) => {
        console.log(error);
      })
  }

  modelShowEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.id = data.assetId;
    this.loadFormData(data, false);
  }

  handleType(type: any) {
    this.isForViewAndSubmitDisabled = false;
    this.submitErrorText = '';
    this.validateApplyLoan(type);
  }
  validateApplyLoan(type: any) {
    this.crudOperationsService.getList(this.api + '/validate?employeeId=' +
      this.employeeId + '&type=' + type).subscribe((data: any) => {
        if (!data.data) {
          this.isForViewAndSubmitDisabled = true;
          this.submitErrorText = 'Oops! \n Your previous ' + type.toUpperCase() + ' is still not Closed/Rejected, You can\'t apply ' + type.toUpperCase();
        }
      });
  }

  handleDeptEmp(type: any) {
    this.resources = [];
    this.selectedItems = [];
    this.setFormValue();
    this.type = type;
    this.crudOperationsService.getList('apply-asset/dropdownList?companyId=' +
      this.companyId + '&owner=' + type).subscribe((data: any) => {
        this.resources = data.data;
      });
  }

  onIssuedDateValueChange(event: any) {
    this.selectedIssuedDate = new Date(event);
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (this.assetForm.valid && !this.isAvailableQtyInValid) {
      let formData = this.getFormData();
      if (this.submitText !== 'Update') {
        this.save(formData, this.api);
      } else {
        this.update(formData, this.api + `/${this.id}`);
      }
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#addPopup')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.getAppliedAssets();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  save(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#addPopup')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.getAppliedAssets();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {
    let companyId = {
      'companyId': this.companyId
    };
    let assetId = {
      'assetId': this._form.assetId
    }
    let allotedBy = {
      'employeeId': this.selectedItems[0].employeeId
    };
    let barcodeOfItem = {
      'childAssetId': this._form.barcodeOfItem
    }
    this._form.resourceId = allotedBy;
    this._form.assetId = assetId;
    this._form.issuedEmployeeId = this.empId;
    this._form.issuedEmployeeName = this.employeeName;
    this._form.barcodeOfItem = barcodeOfItem;
    this._form.companyId = companyId;
    this._form.issuedDate = this.selectedIssuedDate;
    this._form.type = this.type;
    let data = this._form;
    return data;
  }

  clear() {
    this.submitted = false;
    this.isForViewAndSubmitDisabled = false;
    this.assetForm.reset();
    this.id = undefined;
    this.submitText = 'Issue Asset';
    this.assetForm.enable();
    this.selectedItems = [];
    this.type = '';
    this.employeeName = this.employeeDetails.firstName + ' ' + this.employeeDetails.lastName;
    this.empId = this.employeeDetails.employeeId;
    this.form_['issuedBy'].patchValue(this.empId + '-' + this.employeeName);
    this.selectedIssuedDate = '';
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }
}
