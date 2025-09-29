import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-asset-type',
  templateUrl: './asset-type.component.html',
  styleUrls: ['./asset-type.component.css']
})
export class AssetTypeComponent implements OnInit {
  public headers: any = ["Asset Id", "Asset Category Name", "Asset Category Code", "Description", "Approval Workflow", "Vendor", "Action"]
  public editButtonEnable: boolean = true;
  public assetData: any[] = [];
  public assetDataForName: any[] = [];
  public assetDataForCode: any[] = [];
  public candidateObject: any;
  public assetId!: number;
  public togglebtn: boolean = true;
  public assetObject: any;
  public editStatusbtn: boolean = false;
  public toDay = new Date();
  public newResourceIndent: any = {};
  public submitted: boolean = false;
  public AssetNameExist: boolean = false;
  public AssetCodeExist: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitProcessing: boolean = false;
  public submitText: any = 'Save';
  public showExternal: boolean = false;
  public companyId = sessionStorage.getItem("companyId");
  workflowList: any;
  vendorList: any;
  constructor(private formBuilder: FormBuilder, private crudOperationsService: CrudOperationsService,
    private notification: NotifierService, private datePipe: DatePipe, private spinner: NgxSpinnerService) { }


  ngOnInit(): void {
    this.fetchAssets();
    this.fetchapprovalWorkflow();
    this.fetchVendors();
  };

  AssetForm: any = this.formBuilder.group({
    assetName: ["", Validators.required],
    assetCode: ["", Validators.required],
    description: ["", Validators.required],
    approvalWorkflow: ["", Validators.required],
    vendorId: ["", Validators.required]
  });
  get form_() { return this.AssetForm.controls; };
  addClick() {
    this.fetchVendors();
    this.submitText = 'Save'
    this.togglebtn = true;
    this.AssetForm.reset();
    this.AssetForm = this.formBuilder.group({
      assetName: ["", Validators.required],
      assetCode: ["", Validators.required],
      description: ["", Validators.required],
      approvalWorkflow: ["", Validators.required],
      vendorId: ["", Validators.required]
    });
  }

  fetchVendors() {
    let api = "vendors/dropdownList?companyId=" + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.vendorList = data.data;
    })

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
    this.fetchAssets();
  }

  public searchModel="";
  fetchAssets() {
    this.spinner.show();
    let api = "asset_type/list?companyId=" + this.companyId+'&search=' + this.searchModel+'&page=' + this.pageNumber + '&size=10';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      if (data.data != null) {
        this.spinner.hide();
        this.assetData = data.data.content;
        this.handlePagination(data);
        this.assetData.sort((a: any, b: any) => a.assetId - b.assetId)
      }
    },
      (_error: any) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })

  }
  fetchapprovalWorkflow() {
    this.crudOperationsService.getList("approvalworkflow/approvalworkflow_list/1?search=&page=0&size=500").subscribe((data: any) => {
      this.workflowList = data.data.content;
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.AssetForm.valid) {
      this.assetObject = {
        "assetName": this.AssetForm.value.assetName,
        "assetCode": this.AssetForm.value.assetCode,
        "description": this.AssetForm.value.description,
        "approvalWorkflow": { "id": this.AssetForm.value.approvalWorkflow },
        "company": { "companyId": this.companyId },
        "vendor": { "vendorId": this.AssetForm.value.vendorId }
      }
      if (this.submitted && this.AssetForm.valid && !this.AssetCodeExist && !this.AssetNameExist) {
        this.crudOperationsService.create(this.assetObject, "asset_type").subscribe((data: any) => {
          this.submitted = false;
          (<any>$('#myModal-add')).modal('hide');
          this.notification.notify('success', data.message);
          this.fetchAssets();
          this.AssetForm.reset();
        })
      }
    }
  }

  checkForDuplicates() {
    this.assetDataForCode = [];
    this.assetDataForName = [];
    console.log(this.AssetCodeExist)
    if (this.submitText == 'Update') {
      let list: any[] = this.assetData.filter(x => x.assetName != this.AssetForm.value.assetName);
      this.assetDataForName = list.filter(x => x.assetName == this.AssetForm.value.assetName);
      let list2: any[] = this.assetData.filter(x => x.assetCode != this.AssetForm.value.assetCode);
      this.assetDataForCode = list2.filter(x => x.assetCode == this.AssetForm.value.assetCode);
      if (this.assetDataForCode.length > 0) {
        this.AssetCodeExist = true;
      } else {
        this.AssetCodeExist = false;
      }
      if (this.assetDataForName.length > 0) {
        this.AssetNameExist = true;
      } else {
        this.AssetNameExist = false;
      }

    } else {
      this.assetDataForName = this.assetData.filter(x => x.assetName == this.AssetForm.value.assetName);
      this.assetDataForCode = this.assetData.filter(x => x.assetCode == this.AssetForm.value.assetCode);
      if (this.assetDataForCode.length > 0) {
        this.AssetCodeExist = true;
      } else {
        this.AssetCodeExist = false;
      }
      if (this.assetDataForName.length > 0) {
        this.AssetNameExist = true;
      } else {
        this.AssetNameExist = false;
      }
    }
  }


  editAsset(data: any) {
    this.AssetForm.reset();
    this.submitText = 'Update';
    this.togglebtn = false;
    this.assetId = data.assetId;
    this.AssetForm = this.formBuilder.group({
      assetName: [data.assetName, Validators.required],
      assetCode: [data.assetCode, Validators.required],
      description: [data.description, Validators.required],
      approvalWorkflow: [data.approvalWorkflow.id, Validators.required],
      vendorId: [data.vendor.vendorId, Validators.required]
    });
  };

  updateAsset() {
    this.submitted = true;
    if (this.AssetForm.valid) {
      let api: any = "asset_type/" + this.assetId;
      this.assetObject = {
        "assetName": this.AssetForm.value.assetName,
        "assetCode": this.AssetForm.value.assetCode,
        "description": this.AssetForm.value.description,
        "approvalWorkflow": { "id": this.AssetForm.value.approvalWorkflow },
        "company": { "companyId": this.companyId },
        "vendor": { "vendorId": this.AssetForm.value.vendorId }
      }

      if (this.submitted && this.AssetForm.valid && !this.AssetCodeExist && !this.AssetNameExist) {
        this.crudOperationsService.update(this.assetObject, api).subscribe((data: any) => {
          this.submitted = false;
          (<any>$('#myModal-add')).modal('hide');
          this.notification.notify('warning', data.message);
          this.fetchAssets();
          this.togglebtn = true;
          this.AssetForm.reset();
        })
      }
    }
  };

  removeAsset(assetId: number) {
    this.assetId = assetId;
  }

  deleteAsset() {
    let api: any = "asset_type/" + this.assetId;
    this.crudOperationsService.delete(api).subscribe((data: any) => {
      this.notification.notify('error', data.message);

      this.fetchAssets();
    })
  };
  clear() {
    this.AssetForm.reset();
    this.submitText = 'Save';
    this.submitted = false;
  }



}
