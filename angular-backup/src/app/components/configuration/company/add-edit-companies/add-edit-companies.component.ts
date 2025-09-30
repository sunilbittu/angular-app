import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfigurationService } from '../../configuration.service';
import { ShareDataService } from 'src/app/services/sharaData.service';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-add-edit-companies',
  templateUrl: './add-edit-companies.component.html',
  styleUrls: ['./add-edit-companies.component.css']
})
export class AddEditCompaniesComponent implements OnInit {

  public attendanceMonths: any = ['Normal Month', 'Previous Month', '26-25', '21-20'];
  public softwareStartMonths: any = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  public options: any = ['No', 'Yes'];
  public attendanceYears: any = ['Calender', 'Financial'];
  public countryList: any = [];
  public stateList: any = [];
  public cityList: any = [];
  public countryId = '';
  public stateId: any;
  public cityData: any;
  public title: string = '';
  public subscription: any;
  public companyData: any;
  public submitText: string = '';
  public cityId: any;
  public attendenceYearModel: string = this.attendanceYears[0];
  public softwareStartMonthModel: string = this.softwareStartMonths[0];
  public attendenceMonthModel = this.attendanceMonths[0];
  public companyId: any;
  public updateAlert: boolean = false;
  public saveAlert: boolean = false;
  isCompanyExist: any;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';

  constructor(public fb: FormBuilder, public configurationService: ConfigurationService, public location: Location,
    public comapnyShareService: ShareDataService, private crudOperationsService: CrudOperationsService,
    private notification: NotifierService) {
  }

  form = this.fb.group({
    companyName: ["", Validators.required],
    line1: ["", Validators.required],
    line2: [""],
    city: ["", Validators.required],
    pinCode: ["", Validators.required],
    panNumber: [""],
    email: [""],
    attendenceMonth: [this.attendanceMonths[0]],
    softwareStartMonth: [this.softwareStartMonths[0], Validators.required],
    softwareStartYear: ["2021", Validators.required],
    pfRegistrationNumber: [""],
    regionalOffice: [""],
    pfGroup: [""],
    codeStartAt: [1],
    suffix: [""],
    prefix: [""],
    state: ["", Validators.required],
    country: ["", Validators.required],
    contactNumber: ["", Validators.required],
    companyWebsite: ["", Validators.required],
    attendenceYear: [this.attendanceYears[0], Validators.required],
    companyCode: ["", Validators.required],
    esicRegistrationNo: [""],
    localOffice: [""],
    principleEmployer: [""],
    designation: [""],
    cbaeCode: [""],
    mbaeCode: [""],
  });
  get form_() { return this.form.controls; };

  ngOnInit(): void {
    this.fetchCountries();
    this.subscription = this.comapnyShareService.currentMessage.subscribe((message) => {
      this.companyData = message;
    });
    if (this.companyData == 'Add') {
      this.title = 'Add';
      this.submitText = 'Save';
    } else {
      this.title = 'Edit';
      this.submitText = 'Update';
      this.fetchCompanyById(this.companyData.companyId);
    }
  }

  fetchCompanyById(companyId: any) {
    this.configurationService.fetchCompanyById(companyId).subscribe((res: any) => {
      this.companyData = res.data;
      this.setFormValue(res.data);
    })
  }

  submitCompany() {
    if (!this.isCompanyExist) {
      this.submitted = true;
      if (this.form.valid) {
        if (this.submitText == 'Save') {
          this.form.value.city = this.cityData;
          this.configurationService.saveCompany(this.form.value).subscribe((res: any) => {
            if (res.status == "success") {
              this.notification.notify('success', 'Company Created Successfully!');
              this.location.back();
              this.submitted = false;
            }
          })
        } else {
          this.form.value.city = this.cityData;
          this.configurationService.updateCompany(Number(this.companyData.companyId), this.form.value).subscribe((res: any) => {
            if (res.status == "success") {
              this.notification.notify('success', 'Company Updated Successfully!');
              this.location.back();
              this.submitted = false;
            }
          })
        }
      }
    }
  }
  fetchCountries() {
    this.configurationService.fetchCountries().subscribe((res: any) => {
      this.countryList = res.data.content;
    })
  }

  fetchStates() {
    this.configurationService.fetchStates(this.countryId).subscribe((res: any) => {
      this.stateList = res.data;
    })
  }
  fetchCities() {
    this.configurationService.fetchCities(this.stateId).subscribe((res: any) => {
      this.cityList = res.data;
    })
  }
  changeCountry() {
    this.stateList = [];
    this.cityList = [];
    this.fetchStates();
  }
  changeState() {
    this.cityList = [];
    this.fetchCities();
  }
  changeCity() {
    const index = this.cityList.findIndex((x: any) => x.cityId === this.cityId);
    this.cityData = this.cityList[index];
    this.form.controls['pinCode'].setValue(this.cityData.pincode);
  }

  changeAttendanceMonth() {
    this.form.controls['attendenceMonth'].setValue(this.attendenceMonthModel);
  }
  changeSoftwareStartMonth() {
    this.form.controls['softwareStartMonth'].setValue(this.softwareStartMonthModel);
  }
  changeAttendanceYear() {
    this.form.controls['attendenceYear'].setValue(this.attendenceYearModel);
  }

  backClicked() {
    this.location.back();
  }

  setFormValue(data: any) {
    this.form.controls['companyName'].setValue(data.companyName);
    this.form.controls['line1'].setValue(data.line1);
    this.form.controls['line2'].setValue(data.line2);
    this.form.controls['panNumber'].setValue(data.panNumber);
    this.form.controls['email'].setValue(data.email);
    this.form.controls['attendenceMonth'].setValue(data.attendenceMonth);
    this.form.controls['softwareStartMonth'].setValue(data.softwareStartMonth);
    this.form.controls['pfRegistrationNumber'].setValue(data.pfRegistrationNumber);
    this.form.controls['regionalOffice'].setValue(data.regionalOffice);
    this.form.controls['pfGroup'].setValue(data.pfGroup);
    this.form.controls['codeStartAt'].setValue(data.codeStartAt);
    this.form.controls['suffix'].setValue(data.suffix);
    this.form.controls['prefix'].setValue(data.prefix);
    this.form.controls['contactNumber'].setValue(data.contactNumber);
    this.form.controls['companyWebsite'].setValue(data.companyWebsite);
    this.form.controls['attendenceYear'].setValue(data.attendenceYear);
    this.form.controls['companyCode'].setValue(data.companyCode);
    this.form.controls['esicRegistrationNo'].setValue(data.esicRegistrationNo);
    this.form.controls['localOffice'].setValue(data.localOffice);
    this.form.controls['principleEmployer'].setValue(data.principleEmployer);
    this.form.controls['designation'].setValue(data.designation);
    this.form.controls['cbaeCode'].setValue(data.cbaeCode);
    this.form.controls['mbaeCode'].setValue(data.mbaeCode);
    this.form.controls['city'].setValue(data.city.name);
    this.cityData = data.city;
    if (data.city != null) {
      this.form.controls['state'].setValue(data.city.state.name);
      this.form.controls['country'].setValue(data.city.state.country.name);
      this.form.controls['city'].setValue(data.city.name);
      this.form.controls['pinCode'].setValue(data.city.pincode);
    }
    this.countryId = this.cityData.state.country.countryId;
    this.stateId = this.cityData.state.stateId;
    this.cityId = this.cityData.cityId;
    this.fetchCountries();
    this.fetchStates();
    this.fetchCities();
  }

  check() {
    this.isCompanyExist = false;
    let api = 'company/validate?name=' + this.form.value.companyName;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isCompanyExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
}

