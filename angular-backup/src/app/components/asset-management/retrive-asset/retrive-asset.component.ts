import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-retrive-asset',
  templateUrl: './retrive-asset.component.html',
  styleUrls: ['./retrive-asset.component.css']
})
export class RetriveAssetComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService) { }
  public headers: any = ['Asset Name', 'Barcode', 'EmpId & Name.', 'Price', 'Issued Date', 'Issued By', 'Status', 'Retrive Date', 'Remarks', 'Actions'];
  public barcodeItems: any = [];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public employeeName: any = localStorage.getItem('employeeName');
  public statuses: any = ['Working','Damage'];
  public assetList: any = [];
  public issuedAssetList: any = [];
  public resources: any = [];
  public type: any = '';
  public id: any;
  public searchModel = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public selecteddamageDate: any;
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
  public childAssetId: any = '';
  public assetForm = this.formBuilder.group({
    allotedBy: [''],
    assetName: [''],
    description: [''],
    price: [''],
    issuedBy: [''],
    issuedDate: [''],
    availableQuantity: [''],
    barcodeOfItem: [''],
    damageStatus: ['', Validators.required],
    damageDate: ['', Validators.required],
    damageRemarks: ['', Validators.required]
  })

  public showOwnerEmployee: boolean = false;
  public ownerName = '';
  public selectedItems: any = [];
  get form_() { return this.assetForm.controls; };

  get _form() { return this.assetForm.value };

  ngOnInit(): void {
    this.getIssueidAssets();
  }
  //pagination
  p: number = 1;
  itemsPerPage: any;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  
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
  modelShow() {
    this.clear();
  }

  modelShowView(data: any) {
    this.loadFormData(data, true);
  }
  loadFormData(data: any, isForView: boolean) {
    this.assetForm.reset();
    this.childAssetId = data.barcodeOfItem.childAssetId;
    this.form_['assetName'].patchValue(data.assetId.assetName);
    this.form_['barcodeOfItem'].patchValue(data.barcodeOfItem.barCode);
    this.form_['description'].patchValue(data.assetId.description);
    this.form_['price'].patchValue(data.assetId.price);
    this.form_['issuedBy'].patchValue(data.issuedEmployeeId + ' ' + data.issuedEmployeeName);
    this.form_['issuedDate'].patchValue(data.issuedDate);
    this.form_['availableQuantity'].patchValue(data.availableQuantity);
    this.form_['allotedBy'].patchValue(data.resourceEmployeeId + '-' + data.resourceName);
    this.assetForm.patchValue({
      damageDate: new Date(data.damageDate), 
    });
    console.log(this.form_['damageDate'] , ' ... ', this.assetForm)
    this.form_['damageRemarks'].patchValue(data.damageRemarks);
    if (data.damageStatus) {
      this.form_['damageStatus'].patchValue('Damage');
    } else {
      this.form_['damageStatus'].patchValue(null);
    }
    if (isForView) {
      this.isForViewAndSubmitDisabled = true;
      this.assetForm.disable();
    } else {
      this.isForViewAndSubmitDisabled = false;
      this.assetForm.enable();
    }
    (<any>$('#addPopup')).modal('show');
  }

  modelShowEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.form_['damageStatus'].patchValue('Damage');
    this.id = data.issuingId;
    this.loadFormData(data, false);
  }

  ondamageDateValueChange(event: any) {
    this.selecteddamageDate = new Date(event);
  }
  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (this.assetForm.valid) {
      let obj = {
        damageStatus: this._form.damageStatus,
        damageDate: this._form.damageDate,
        damageRemarks: this._form.damageRemarks,
        childAssetId: this.childAssetId
      }
      this.update(obj, this.api + `/updateDamageAsset/${this.id}`);
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
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  clear() {
    this.submitted = false;
    this.isForViewAndSubmitDisabled = false;
    // this.id = undefined;
    // this.childAssetId = '';
    // this.submitText = 'Save';
    this.form_['damageDate'].patchValue('');
    this.form_['damageRemarks'].patchValue('');
    this.form_['damageStatus'].patchValue('');
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }
}
