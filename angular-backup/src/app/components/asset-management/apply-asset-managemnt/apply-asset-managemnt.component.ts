import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-apply-asset-managemnt',
  templateUrl: './apply-asset-managemnt.component.html',
  styleUrls: ['./apply-asset-managemnt.component.css']
})
export class ApplyAssetManagemntComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe) { }

  public headers: any = ['Asset Category', 'Asset Code', 'Asset Name', 'Asset Owner', 'Dept Heads/Employees', 'Description', 'Purchase Date', 'Price', 'Brand', 'Model No', 'Exp. Date', 'Quantity', 'Docs', 'Actions'];
  public assetOwners: any = ['Department', 'Employee'];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public assetList: any = [];
  public quantities: any = [];
  public assetCategories: any = [];
  public maintenances: any = ['No', 'Quarterly', 'Half Yearly', 'Yearly'];
  public resources: any = [];

  public id: any;
  public searchModel = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public selectedPurchaseDate: any;
  public selectedMfgDate: any;
  public selectedExpDate: any;
  public now = new Date();
  public selectedFile: any;
  public imageFileName: any;
  public submitted1 = false;
  public selectedFile1: any;
  public filePath: any;
  public fileSelected: boolean = false;
  public document: any = {};
  public submitText = '';
  public api = 'apply-asset'
  public submitProcessing = false;
  public employeeDetails: any = {};
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public isForViewAndSubmitDisabled: boolean = false;
  public submitErrorText: any = '';
  public assetForm = this.formBuilder.group({
    assetCategoryId: ['', Validators.required],
    assetCode: [''],
    assetOwner: ['', Validators.required],
    resourceId: [''],
    assetName: ['', Validators.required],
    description: ['', Validators.required],
    purchaseDate: ['', Validators.required],
    price: ['', Validators.required],
    brand: ['', Validators.required],
    modelno: ['', Validators.required],
    mfgDate: ['', Validators.required],
    slno: ['', Validators.required],
    expDate: ['', Validators.required],
    quantity: ['', Validators.required],
    maintenance: ['', Validators.required],
    selectedFile: ['']
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
    this.getAppliedAssets();
  }
  ngAfterViewInit(): void {
    this.getQuantities();
    this.fetchAssetCategories();
  }
  onItemSelect(data: any) {
    console.log('data', data);
  }
  onSelectAll(event: any) {
    console.log('data', event);
  }
  onDeSelectAll(event: any) {
    console.log('data', event);
  }
  onItemDeSelect(data: any) {
    console.log('data', data);
  }
  getQuantities() {
    for (var i = 1; i <= 100; i++) {
      this.quantities.push(i);
    }
  }

  getAppliedAssets() {
    this.spinner.show();
    let api = this.api + '/list?companyId=' + this.companyId + '&search='+this.searchModel+'&page=' + this.pageNumber + '&size=10';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.assetList = data.data.content;
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  changeCategory() {
    this.assetCategories.forEach((e: any) => {
      if (e.assetId == this._form.assetCategoryId) {
        this.setAssetCodeWithPrefix(e.assetCode);
      }
    });
  }

  public generatedAssetCode = '';
  setAssetCodeWithPrefix(categoryCode: any) {
    this.crudOperationsService.getList(this.api + '/getLatestAssetCode?categoryCode=' +
      categoryCode).subscribe((data: any) => {
        let count = data.data;
        let result = this.pad(count, 3);
        console.log('result : ', result);
        this.generatedAssetCode = categoryCode + '-' + result;
        console.log('finalResult : ', this.generatedAssetCode);
        this.form_['assetCode'].patchValue(this.generatedAssetCode);
      });
  }
  pad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  modelShow() {
    this.clear();
    this.form_['assetCode'].disable();
  }

  modelShowView(data: any) {
    this.loadFormData(data, true);
  }
  loadFormData(data: any, isForView: boolean) {
    this.assetForm.reset();
    this.selectedItems = [];
    this.form_['assetCategoryId'].patchValue(data.assetCategoryId.assetId);
    this.form_['assetCode'].patchValue(data.assetCode);
    this.form_['assetOwner'].patchValue(data.assetOwner);
    this.form_['assetName'].patchValue(data.assetName);
    this.form_['description'].patchValue(data.description);
    this.form_['purchaseDate'].patchValue(this.datePipe.transform(data.purchaseDate, 'dd-MM-yyyy'));
    this.form_['price'].patchValue(data.price);
    this.form_['brand'].patchValue(data.brand);
    this.form_['modelno'].patchValue(data.modelno);
    this.form_['mfgDate'].patchValue(this.datePipe.transform(data.mfgDate, 'dd-MM-yyyy'));
    this.form_['slno'].patchValue(data.slno);
    this.form_['expDate'].patchValue(this.datePipe.transform(data.expDate, 'dd-MM-yyyy'));
    this.form_['quantity'].patchValue(data.quantity);
    this.form_['maintenance'].patchValue(data.maintenance);
    this.generatedAssetCode = data.assetCode;
    this.changeOwner();
    if (isForView) {
      this.isForViewAndSubmitDisabled = true;
      this.assetForm.disable();
    } else {
      this.isForViewAndSubmitDisabled = false;
      this.assetForm.enable();
      this.form_['assetCode'].disable();
    }
    this.showOwnerEmployee = true;
    this.selectedItems.push({ employeeId: data.resourceEmployeeId, fullName: data.resourceName });
    (<any>$('#applyPopup')).modal('show');
    this.fileSelected = true;
    this.selectedPurchaseDate = new Date(data.purchaseDate);
    this.selectedMfgDate = new Date(data.mfgDate);
    this.selectedExpDate = new Date(data.expDate);
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

  fetchAssetCategories() {
    this.assetCategories = [];
    this.crudOperationsService.getList('asset_type/dropdownList?companyId=' +
      this.companyId).subscribe((data: any) => {
        this.assetCategories = data.data;
      });
  }

  changeOwner() {
    this.showOwnerEmployee = false;
    this.resources = [];
    this.crudOperationsService.getList(this.api + '/dropdownList?companyId=' +
      this.companyId + '&owner=' + this._form.assetOwner).subscribe((data: any) => {
        this.ownerName = this._form.assetOwner == 'Department' ? 'Dept Heads' : 'Employees';
        this.showOwnerEmployee = true;
        this.resources = data.data;
      });
  }

  changeType() {
    // this.assetCategories.forEach((e: any) => {
    //   if (e.loanId == loanType) {

    //     this.validateWorkPeriod(e.retentionYears);
    //     this.form_['budgetLimit'].patchValue(e.loanLimit);
    //     this.installmentNumber = e.installmentsNumber;
    //     this.handleAmountReqValidation();
    //     let tens = [];
    //     for (let i = 1; i <= this.installmentNumber; i++) {
    //       tens.push(i);
    //     }
    //     this.form_['installmentMonths'].patchValue(this.installmentNumber);
    //   }
    // });
  }

  changeTennureMonths(ten: any) {
    let amount = this._form.amountRequired;
    if (amount) {
      let emiAmount = amount / ten;
      const result = this.roundTo(emiAmount, 2);
      this.form_['emiCalculatedField'].patchValue(result);
    }
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  onPurchaseDateValueChange(event: any) {
    this.selectedPurchaseDate = new Date(event);
  }

  onMfgDateValueChange(event: any) {
    this.selectedMfgDate = new Date(event);
  }

  onExpDateValueChange(event: any) {
    this.selectedExpDate = new Date(event);
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileSelected = false;
  }

  onFileChanged1(event: any) {
    this.selectedFile1 = event.target.files[0];
  }

  download() {
    this.downloadDocumentAttachment(this.filePath, this.imageFileName);
  }
  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = 'apply-asset/document_download?filePath=' + filePath;
    this.crudOperationsService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: 'application/octet-stream' }); // must match the Accept type
        const filename = fileName;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        console.log(fileName)
        anchor.download = filename;
        anchor.href = url;
        anchor.click();
      },
        (error) => {
          this.notification.notify('error', 'Error while downloading the file');
        }
      )
  }
  viewDocument(doc: any, data: any) {
    this.id = data.assetId;
    (<any>$('#donwload_doc')).modal('show');
    this.document = doc;
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (this.assetForm.valid) {
      if (this.submitText !== 'Update') {
        let formData = this.setFormData();
        if (this.selectedFile != undefined && this.selectedFile != '') {
          this.save(formData, this.api);
        }
      } else {
        let formData = this.getFormData();
        this.update(formData, this.api + `/${this.id}`);
      }
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#applyPopup')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
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
        (<any>$('#applyPopup')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {
    let employee = {
      'employeeId': this.selectedItems[0].employeeId
    };
    let companyId = {
      'companyId': this.companyId
    };
    let assetCategoryId = {
      'assetId': this._form.assetCategoryId
    }
    let resourceId = {
      'employeeId': this.selectedItems[0].employeeId
    };
    console.log(' this._form. ', this._form)
    this._form.assetCode = this.generatedAssetCode;
    console.log(' this._form.1 ', this._form)
    this._form.resourceId = resourceId;
    this._form.assetCategoryId = assetCategoryId;
    this._form.employeeId = employee;
    this._form.companyId = companyId;
    this._form.purchaseDate = this.selectedPurchaseDate;
    this._form.mfgDate = this.selectedMfgDate;
    this._form.expDate = this.selectedExpDate;
    let data = this._form;
    return data;
  }
  setFormData(): any {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('applyAssetDTO', JSON.stringify(this.getFormData()));
    return formData;
  }

  public assetName: any = '';
  addFileClick(data: any) {
    this.id = data.assetId;
    this.assetName = data.assetName;
    this.selectedFile1 = '';
  }
  addFile() {
    if (this.selectedFile1 != undefined && this.selectedFile1 != '') {
      const formData = new FormData();
      formData.append('file', this.selectedFile1);
      formData.append('id', this.id);
      this.submitProcessing = true;
      this.crudOperationsService.create(formData, this.api + '/addFile')
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          (<any>$('#add-files')).modal('hide');
          this.submitProcessing = false;
          this.ngOnInit();
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })
    }
  }

  clear() {
    this.submitted = false;
    this.fileSelected = false;
    this.isForViewAndSubmitDisabled = false;
    this.assetForm.reset();
    this.id = undefined;
    this.submitText = 'Save & Send for Approval';
    this.assetForm.enable();
    this.selectedItems = [];
  }

  clear1() {
    this.submitted1 = false;
    this.selectedFile1 = undefined;
  }

  deleteDoc(fileName: any) {
    this.crudOperationsService.getList(this.api + '/deleteFile?id=' + this.id + '&fileName=' + fileName)
      .subscribe((data: any) => {
        this.notification.notify('success', 'File deleted successfully!');
        (<any>$('#donwload_doc')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
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
    this.getAppliedAssets();
  }
}
