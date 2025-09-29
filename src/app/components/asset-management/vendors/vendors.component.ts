import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../../configuration/configuration.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {

  public headers: any = ["Vendor Id", "Vendor Code", "Vendor Name", "Type", "Email", "Action"];
  public editButtonEnable: boolean = true;
  public vendorData: any[] = [];
  public vendorDataForName: any[] = [];
  public vendorDataForCode: any[] = [];
  public candidateObject: any;
  public vendorId!: number;
  public togglebtn: boolean = true;
  public vendorObject: any;
  public editStatusbtn: boolean = false;
  public toDay = new Date();
  public newResourceIndent: any = {};
  public submitted: boolean = false;
  public isValidEmail: boolean = true;
  public presentCityList: any = [];
  public VendorNameExist: boolean = false;
  public VendorCodeExist: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public presentStateList: any = [];
  public countrypresentList!: any[];
  public submitProcessing: boolean = false;
  public submitText: any = 'Save';
  public showExternal: boolean = false;
  public companyId = sessionStorage.getItem("companyId");
  workflowList: any;
  constructor(private commonService: ConfigurationService, private formBuilder: FormBuilder, private crudOperationsService: CrudOperationsService,
    private notification: NotifierService, private datePipe: DatePipe, private spinner: NgxSpinnerService) { }


  ngOnInit(): void {
    this.fetchVendors();

  };

  vendorForm: any = this.formBuilder.group({
    vendorName: ["", Validators.required],
    vendorCode: ["", Validators.required],
    vendorType: ["", Validators.required],
    doorNo: ["", Validators.required],
    landMark: ["", Validators.required],
    PresentCountry: ["", Validators.required],
    PresentState: ["", Validators.required],
    vendorCityId: ["", Validators.required],
    mobile: ["", Validators.required],
    pointOfContact: ["", Validators.required],
    email: ["", Validators.required]

  });
  get form_() { return this.vendorForm.controls; };
  addClick() {
    this.fetchCountriesPresent();
    this.submitText = 'Save'
    this.togglebtn = true;
    this.vendorForm.reset();
    this.vendorForm = this.formBuilder.group({
      vendorName: ["", Validators.required],
      vendorCode: ["", Validators.required],
      vendorType: ["", Validators.required],
      doorNo: ["", Validators.required],
      landMark: ["", Validators.required],
      PresentCountry: ["", Validators.required],
      PresentState: ["", Validators.required],
      vendorCityId: ["", Validators.required],
      mobile: ["", Validators.required],
      pointOfContact: ["", Validators.required],
      email: ["", Validators.required]
    });
  }

  validateMail() {
    let regexp: any = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    this.isValidEmail = regexp.test(this.vendorForm.value.email);
  }

  fetchCountriesPresent() {
    //get EmployeeId from session
    this.commonService.fetchCountries().subscribe((res: any) => {

      this.countrypresentList = res.data.content;
    })
  }

  //fetch present CountryList 
  onChangePresentCountries() {
    const countryId = this.vendorForm.value['PresentCountry'];
    this.commonService.fetchStates(countryId).subscribe((res: any) => {
      this.presentStateList = res.data;

    })
  }

  onChangePresentCountries2(countryId: any) {
    this.commonService.fetchStates(countryId).subscribe((res: any) => {
      this.presentStateList = res.data;

    })
  }

  onChangePresentState() {
    const stateId = this.vendorForm.value['PresentState'];

    this.commonService.fetchCities(stateId).subscribe((res: any) => {
      this.presentCityList = res.data;

    })
  }

  onChangePresentState2(stateId: any) {

    this.commonService.fetchCities(stateId).subscribe((res: any) => {
      this.presentCityList = res.data;

    })
  }

  //pagination
  public p: number = 1;
  itemsPerPage: any = 10;
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
    this.fetchVendors();
  }

  public searchModel = "";
  fetchVendors() {
    this.spinner.show();
    let api = "vendors/list?companyId=" + this.companyId + '&search=' + this.searchModel + '&page=' + this.pageNumber + '&size=10';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
        this.spinner.hide();
        this.vendorData = data.data.content;
        this.handlePagination(data);
        this.vendorData.sort((a: any, b: any) => a.vendorId - b.vendorId);
    },
      (_error: any) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })

  }
  onSubmit() {
    this.submitted = true;
    if (this.vendorForm.valid) {
      this.vendorObject = {
        "vendorName": this.vendorForm.value.vendorName,
        "vendorCode": this.vendorForm.value.vendorCode,
        "vendorType": this.vendorForm.value.vendorType,
        "doorNo": this.vendorForm.value.doorNo,
        "landMark": this.vendorForm.value.landMark,
        "mobile": this.vendorForm.value.mobile,
        "pointOfContact": this.vendorForm.value.pointOfContact,
        "email": this.vendorForm.value.email,
        "vendorCityId": { "cityId": this.vendorForm.value.vendorCityId },
        "company": { "companyId": this.companyId }
      }
      if (this.submitted && this.vendorForm.valid && !this.VendorCodeExist && !this.VendorNameExist && this.isValidEmail) {
        this.crudOperationsService.create(this.vendorObject, "vendors").subscribe((data: any) => {
          this.submitted = false;
          (<any>$('#myModal-add')).modal('hide');
          this.notification.notify('success', data.message);

          this.fetchVendors();
          this.vendorForm.reset();
        })
      }
    }
  }

  checkForDuplicates() {
    this.vendorDataForCode = [];
    this.vendorDataForName = [];
    if (this.submitText == 'Update') {
      let list: any[] = this.vendorData.filter(x => x.vendorName != this.vendorForm.value.vendorName);
      this.vendorDataForName = list.filter(x => x.vendorName == this.vendorForm.value.vendorName && x.vendorCode == this.vendorForm.value.vendorCode);
      let list2: any[] = this.vendorData.filter(x => x.vendorCode != this.vendorForm.value.vendorCode);
      this.vendorDataForCode = list2.filter(x => x.vendorCode == this.vendorForm.value.vendorCode);
      if (this.vendorDataForCode.length > 0) {
        this.VendorCodeExist = true;
      } else {
        this.VendorCodeExist = false;
      }
      if (this.vendorDataForName.length > 0) {
        this.VendorNameExist = true;
      } else {
        this.VendorNameExist = false;
      }

    } else {
      this.vendorDataForName = this.vendorData.filter(x => x.vendorName == this.vendorForm.value.vendorName && x.vendorCode == this.vendorForm.value.vendorCode);
      this.vendorDataForCode = this.vendorData.filter(x => x.vendorCode == this.vendorForm.value.vendorCode);
      if (this.vendorDataForCode.length > 0) {
        this.VendorCodeExist = true;
      } else {
        this.VendorCodeExist = false;
      }
      if (this.vendorDataForName.length > 0) {
        this.VendorNameExist = true;
      } else {
        this.VendorNameExist = false;
      }
    }
  }


  editAsset(data: any) {
    this.vendorForm.reset();
    this.submitText = 'Update';
    this.togglebtn = false;
    this.vendorId = data.vendorId;
    this.fetchCountriesPresent();
    this.onChangePresentCountries2(data.vendorCityId.state.country.countryId);
    this.onChangePresentState2(data.vendorCityId.state.stateId)
    this.vendorForm = this.formBuilder.group({
      vendorName: [data.vendorName, Validators.required],
      vendorCode: [data.vendorCode, Validators.required],
      vendorType: [data.vendorType, Validators.required],
      doorNo: [data.doorNo, Validators.required],
      landMark: [data.landMark, Validators.required],
      PresentCountry: [data.vendorCityId.state.country.countryId, Validators.required],
      PresentState: [data.vendorCityId.state.stateId, Validators.required],
      vendorCityId: [data.vendorCityId.cityId, Validators.required],
      mobile: [data.mobile, Validators.required],
      pointOfContact: [data.pointOfContact, Validators.required],
      email: [data.email, Validators.required]
    });
  };

  updateAsset() {
    this.submitted = true;
    if (this.vendorForm.valid) {
      let api: any = "vendors/" + this.vendorId;
      this.vendorObject = {
        "vendorName": this.vendorForm.value.vendorName,
        "vendorCode": this.vendorForm.value.vendorCode,
        "vendorType": this.vendorForm.value.vendorType,
        "doorNo": this.vendorForm.value.doorNo,
        "landMark": this.vendorForm.value.landMark,
        "mobile": this.vendorForm.value.mobile,
        "pointOfContact": this.vendorForm.value.pointOfContact,
        "email": this.vendorForm.value.email,
        "vendorCityId": { "cityId": this.vendorForm.value.vendorCityId },
        "company": { "companyId": this.companyId }
      }

      if (this.submitted && this.vendorForm.valid && !this.VendorCodeExist && !this.VendorNameExist) {
        this.crudOperationsService.update(this.vendorObject, api).subscribe((data: any) => {
          this.submitted = false;
          (<any>$('#myModal-add')).modal('hide');
          this.notification.notify('warning', data.message);

          this.fetchVendors();
          this.togglebtn = true;
          this.vendorForm.reset();
        })
      }
    }
  };

  removeAsset(vendorId: number) {
    this.vendorId = vendorId;
  }

  deleteAsset() {
    let api: any = "vendors/" + this.vendorId;
    this.crudOperationsService.delete(api).subscribe((data: any) => {
      this.notification.notify('error', data.message);

      this.fetchVendors();
    })
  };
  clear() {
    this.vendorForm.reset();
    this.submitText = 'Save';
    this.submitted = false;
  }



}
