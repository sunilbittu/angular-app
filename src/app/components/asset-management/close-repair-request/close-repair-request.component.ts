import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-close-repair-request',
  templateUrl: './close-repair-request.component.html',
  styleUrls: ['./close-repair-request.component.css']
})
export class CloseRepairRequestComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService) { }

  public headers: any = ['Asset Name', 'Bar Code', 'Repairer Name', 'Repair date', 'Description', 'Actions'];
  public barcodeItems: any = [];
  public repairRequestList: any = [];
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
  public searchValidation: boolean = false;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public selectedIssuedDate: any;
  public now = new Date();
  public submitText = 'Save';
  public api = 'repair-request'
  public submitProcessing = false;
  public employeeDetails: any = {};
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public isForViewAndSubmitDisabled: boolean = false;
  public submitErrorText: any = '';
  public assetId: any = '';
  public barCodeId: any = '';
  public showList: boolean = true;
  public assetForm = this.formBuilder.group({
    assetOwner: [''],
    resourceId: [''],
    ownerName: [''],
    description: [''],
    purchaseDate: [''],
    price: [''],
    brand: [''],
    modelno: [''],
    mfgDate: [''],
    slno: [''],
    expDate: [''],
    quantity: [''],
    maintenance: ['']
  })

  public repairForm = this.formBuilder.group({
    address: [''],
    poc: [''],
    mobile: [''],
    emailId: [''],
    repairDate: ['', Validators.required],
    description: ['', Validators.required],
    resolvedProblem: ['', Validators.required],
    repairedDate: ['', Validators.required],
    amount: ['', Validators.required],
    status: ['Requested for Repair Closed'],

  })
  public searchData: any = {};

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

  get form_() { return this.assetForm.controls; };

  get _form() { return this.assetForm.value };

  get repairForm_() { return this.repairForm.controls; };

  ngOnInit(): void {
    this.getRepairRequests();
  }

      //pagination
      public p: number = 1;
      itemsPerPage: any=10;
      totalItems: any;
      currentPage: any;
      totalElements: number = 0;
      showingFrom: number = 0;
      showingTo: number = 0;
      public pageNumber: Number = 0;
      public pageSize: number = 10;
  
    public handlePagination(data: any) {
      this.totalElements = data.data.totalElements;
      this.itemsPerPage = 10;
      this.currentPage = data.data.pageable.pageNumber + 1;
      this.totalItems = (data.data.totalPages) * this.itemsPerPage;
      this.showingFrom = (data.data.pageable.pageNumber * this.itemsPerPage) + 1;
      const to = (data.data.pageable.pageNumber + 1) * this.itemsPerPage;
      if (this.totalElements >= to) {
        this.showingTo = to;
      } else {
        this.showingTo = this.totalElements;
      }
    }
  
    public pageChanged(event: any): void {
      this.pageNumber = event - 1;
      this.getRepairRequests();
    }

  getRepairRequests() {
    this.spinner.show();
    let api = this.api + '/list/' + this.companyId+'?search='+this.searchModel+'&page='+this.pageNumber+'&size=10';    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.repairRequestList = data.data.content;
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
        this.notification.notify('error', 'Something Went Wrong');
      })
  }
  ngAfterViewInit(): void {
    this.getAppliedAssets();
    this.getVendors();
    this.getEmpDetails();
  }
  getVendors() {
    let api = 'vendors/getRepairerVendors?companyId=' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.vendorList = data.data;
    },
      (error) => {
        console.log(error);
      })
  }

  getEmpDetails() {
    this.crudOperationsService.getList('employee/get_employee_by_id/' + this.employeeId)
      .subscribe((data: any) => {
        if (data.data) {
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
  getAppliedAssets() {
    let api = 'issuing-asset/getApprovedAssetList?companyId=' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.assetList = data.data;
    },
      (error) => {
        console.log(error);
      })
  }

  changeName() {
    let result = this.assetList.find((e: any) => e.assetId == this.assetId);
    this.barcodeItems = [];
    this.getBarcodeOfItems(result.assetId);
  }
  getBarcodeOfItems(assetId: any) {
    let api = 'issuing-asset/getBarcodeOfItems?assetId=' + assetId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.barcodeItems = data.data;
    },
      (error) => {
        console.log(error);
      })
  }

  public vendorId: any = '';
  public vendorList: any = [];
  public repairData: any;
  changeRepairName() {
    this.repairData = {};
    this.repairData = this.vendorList.find((e: any) => e.vendorId == this.vendorId);
    this.loadRepairForm(this.repairData);
  }
  loadRepairForm(repairData: any) {
    this.repairForm_['address'].patchValue(repairData.landMark);
    this.repairForm_['poc'].patchValue(repairData.pointOfContact);
    this.repairForm_['emailId'].patchValue(repairData.email);
    this.repairForm_['mobile'].patchValue(repairData.mobile);
  }

  public assetData: any;
  search() {
    this.searchValidation = true;
    if (this.assetId && this.barCodeId) {
      this.spinner.show();
      let api = 'apply-asset/' + this.assetId;
      this.crudOperationsService.getList(api).subscribe((data: any) => {
        this.assetData = data.data;
        this.searchValidation = false;
        this.spinner.hide();
        this.loadAssetForm(this.assetData);
      },
        (error) => {
          this.spinner.hide();
          console.log(error);
        })
    }
  }
  loadAssetForm(assetData: any) {
    this.form_['assetOwner'].patchValue(assetData.assetOwner);
    this.form_['ownerName'].patchValue(assetData.resourceId.firstName + ' ' + assetData.resourceId.lastName);
    this.form_['description'].patchValue(assetData.description);
    this.form_['purchaseDate'].patchValue(assetData.purchaseDate);
    this.form_['price'].patchValue(assetData.price);
    this.form_['brand'].patchValue(assetData.brand);
    this.form_['modelno'].patchValue(assetData.modelno);
    this.form_['mfgDate'].patchValue(assetData.mfgDate);
    this.form_['slno'].patchValue(assetData.slno);
    this.form_['expDate'].patchValue(assetData.expDate);
    this.form_['quantity'].patchValue(assetData.quantity);
    this.form_['maintenance'].patchValue(assetData.maintenance);
    this.assetForm.disable();
  }
  public selectedDate: any;
  onDateValueChange(event: any) {
    this.selectedDate = new Date(event);
  }

  clickAdd() {
    this.clear();
    this.readOnly = false;
    this.showList = false;
  }

  back() {
    this.showList = true;
  }

  getFilteredBarcodeOfItems(assetId: any, childAssetId: any) {
    let api = 'issuing-asset/getFilteredBarcodeOfItems?assetId=' + assetId + '&childAssetId=' + childAssetId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.barcodeItems = data.data;
    },
      (error) => {
        console.log(error);
      })
  }

  public readOnly: boolean = false;
  view(data: any) {
    this.readOnly = true;
    this.submitText = 'Update';
    this.loadData(data);
    this.repairForm.disable();
    this.repairForm_['repairDate'].disable();
    this.repairForm_['description'].disable();
    this.repairForm_['resolvedProblem'].disable();
    this.repairForm_['repairedDate'].disable();
    this.repairForm_['amount'].disable();
  }

  loadData(data: any) {
    this.showList = false;
    this.submitted = false;
    this.id = data.repairId;
    this.assetId = data.assetId.assetId;
    this.getFilteredBarcodeOfItems(data.assetId.assetId, data.childAssetId.childAssetId);
    this.barCodeId = data.childAssetId.childAssetId;
    this.vendorId = data.vendorId.vendorId;
    this.assetData = data.assetId;
    this.repairData = data.vendorId;
    this.loadAssetForm(data.assetId);
    this.loadRepairForm(data.vendorId);
    this.repairForm_['repairDate'].patchValue(new Date(data.repairDate));
    this.repairForm_['description'].patchValue(data.description);
  }
  edit(data: any) {
    this.readOnly = false;
    this.submitted = false;
    this.submitText = 'Update';
    this.loadData(data);
    this.repairForm.disable();
    this.repairForm_['repairDate'].enable();
    this.repairForm_['description'].enable();
    this.repairForm_['resolvedProblem'].enable();
    this.repairForm_['repairedDate'].enable();
    this.repairForm_['amount'].enable();
    this.repairForm_['status'].enable();
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
    if (this.repairForm.valid) {
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
        this.submitProcessing = false;
        this.ngOnInit();
        this.showList = true;
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
        this.submitProcessing = false;
        this.ngOnInit();
        this.showList = true;
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {
    let companyId = {
      'companyId': sessionStorage.getItem('companyId')
    };
    let assetId = {
      'assetId': this.assetId
    }
    let childAssetId = {
      'childAssetId': this.barCodeId
    }
    let vendorId = {
      'vendorId': this.vendorId
    };
    this.repairForm.value.company = companyId;
    this.repairForm.value.assetId = assetId;
    this.repairForm.value.childAssetId = childAssetId;
    this.repairForm.value.vendorId = vendorId;
    let data = this.repairForm.value;
    return data;
  }

  clear() {
    this.submitted = false;
    this.searchValidation = false;
    this.assetForm.reset();
    this.repairForm.reset();
    this.repairForm.disable();
    this.repairForm_['repairDate'].enable();
    this.repairForm_['description'].enable();
    this.assetId = '';
    this.barCodeId = '';
    this.vendorId = '';
    this.id = undefined;
    this.submitText = 'Save';
    this.assetData = undefined;
    this.repairData = undefined;
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }
}
