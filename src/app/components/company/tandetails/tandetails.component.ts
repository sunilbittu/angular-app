import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../../configuration/configuration.service';

@Component({
  selector: 'app-tandetails',
  templateUrl: './tandetails.component.html',
  styleUrls: ['./tandetails.component.css']
})
export class TANDetailsComponent implements OnInit {

  public tabDetailsForm!: any;
  public countryList1!: any;
  public statesList1!: any;
  public cityList1!: any;
  public companyId: any=Number(sessionStorage.getItem("companyId"));


  public countryList2!: any;
  public statesList2!: any;
  public cityList2!: any;

  public tabDetailsObject: any;

  public tanDetailsByCompanyId: any;

  public editButton!: any;





  constructor(private formBuilder: FormBuilder, private crudeService: CrudOperationsService
    , private alertService: NotifierService, private commonService: ConfigurationService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.tabDetailsForm = this.formBuilder.group({


      tanNo: [],
      tanRegisterAt: [],
      tdsCircle: [],
      deDuctorType: [],
      Address1: [],
      Address2: [],
      Address3: [],
      country1: [],
      state1: [],
      city1: [],

      emailId1: [],

      phone1: [],

      name: [],
      panNo: [],
      designnation: [],
      fathersName: [],
      mobileNo: [],
      emailId2: [],

      phone2: [],

      isGovtDeductor: [false],
      paoCode: [],
      paoRegNo: [],
      daooCode: [],
      daoRegNo: [],
      country2: [],
      state2: [],
      city2: [],

      selectministry: [],
      otherMinistry: []



      
    })

    //disable isGovtDeductor 
   // this.disbaleIsGovtDeductor();

    //get coutryList
    this.fetchCountries1();

    //get coutryList
    this.fetchCountries2();


    //edit tan details
    this.editTandetails()

  }


  //disable isGovtDeductor 
  disbaleIsGovtDeductor() {
    //alert(this.tabDetailsForm.value.isGovtDeductor)


    if (this.tabDetailsForm.value.isGovtDeductor == false) {



      this.tabDetailsForm.get('paoCode')?.disable();
      this.tabDetailsForm.get('paoRegNo')?.disable();
      this.tabDetailsForm.get('daooCode')?.disable();
      this.tabDetailsForm.get('daoRegNo')?.disable();
      this.tabDetailsForm.controls['country2'].disable({ onlySelf: true });
      this.tabDetailsForm.controls['state2'].disable({ onlySelf: true });
      this.tabDetailsForm.controls['city2'].disable({ onlySelf: true });
      this.tabDetailsForm.get('pincode2')?.disable();
      this.tabDetailsForm.controls['selectministry'].disable({ onlySelf: true });
      this.tabDetailsForm.controls['otherMinistry'].disable({ onlySelf: true });
    }

    else {


      this.tabDetailsForm.get('paoCode')?.enable();
      this.tabDetailsForm.get('paoRegNo')?.enable();
      this.tabDetailsForm.get('daooCode')?.enable();
      this.tabDetailsForm.get('daoRegNo')?.enable();
      this.tabDetailsForm.controls['country2'].enable({ onlySelf: true });
      this.tabDetailsForm.controls['state2'].enable({ onlySelf: true });
      this.tabDetailsForm.controls['city2'].enable({ onlySelf: true });
      this.tabDetailsForm.get('pincode2')?.enable();
      this.tabDetailsForm.controls['selectministry'].enable({ onlySelf: true });
      this.tabDetailsForm.controls['otherMinistry'].enable({ onlySelf: true });

    }



  }


  fetchCountries1() {

    this.companyId = sessionStorage.getItem('companyId');
    let api: any = "country/list?search=&page=&size";
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.countryList1 = data.data
      })
  }


  fetchStates1() {

    let api: any = "state/dropdownList_other/" + this.tabDetailsForm.value.country1;
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.statesList1 = data.data

      })
  }

  fetchCityList1() {
    let api: any = "city/dropdownList_other/" + this.tabDetailsForm.value.state1;
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.cityList1 = data.data

      })
  }







  fetchCountries2() {

    let api: any = "country/list?search=&page=&size";
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.countryList2 = data.data
      })
  }


  fetchStates2() {

    let api: any = "state/dropdownList_other/" + this.tabDetailsForm.value.country2;
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.statesList2 = data.data

      })
  }

  fetchCityList2() {
    let api: any = "city/dropdownList_other/" + this.tabDetailsForm.value.state2;
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.cityList2 = data.data

        this.tabDetailsForm.patchValue({

          pincode2: this.cityList2.pincode
        })

      })
  }



  //fetch countries
  fetchCountriesTanReg() {
    this.commonService.fetchCountries().subscribe((res: any) => {

      this.countryList1 = res.data;
    })
  }


  //fetch countries
  fetchCountriesForGovt() {

    this.commonService.fetchCountries().subscribe((res: any) => {

      this.countryList2 = res.data;
    })
  }





  //fetch Present states
  fetchTanRegStates(id: number) {

    this.commonService.fetchStates(id).subscribe((res: any) => {

      this.statesList1 = res.data;
      
    })
  }

  // //fetch Present cities
  fetchTanRegCities(id: number) {
    this.commonService.fetchCities(id).subscribe((res: any) => {
      this.cityList1 = res.data;

    })
  }



  //fetch Permenent states
  fetchForGovtStates(id: number) {

    this.commonService.fetchStates(id).subscribe((res: any) => {

      this.statesList2 = res.data;

    })
  }

  //fetch Permenent cities
  fetchForGovtCities(id: number) {
    this.commonService.fetchCities(id).subscribe((res: any) => {

      this.cityList2 = res.data;

    })
  }


  



  //edit tan details
  editTandetails() {
    

    //show spinner
    this.spinner.show();

    let api: any = "companytanresponsiblepersondetail/list_company/" + this.companyId;

    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.tanDetailsByCompanyId = data.data;
        //show hide
        this.spinner.hide();

        if (this.tanDetailsByCompanyId != null) {
          //enable edit button
          this.editButton = true;

          console.log(this.tanDetailsByCompanyId.companyTanDetail.city.state.country.countryId);

          //fetch TanRegStates
          this.fetchTanRegStates(this.tanDetailsByCompanyId.companyTanDetail.city.state.country.countryId);

          //fetch TanRegcities
          this.fetchTanRegCities(this.tanDetailsByCompanyId.companyTanDetail.city.state.stateId);

          //fetch ForGovtStates
          this.fetchForGovtStates(this.tanDetailsByCompanyId.companyForGovernmentDeductor.city.state.country.countryId);

          //fetch ForGovtcities
          this.fetchForGovtCities(this.tanDetailsByCompanyId.companyForGovernmentDeductor.city.state.stateId);

          this.tabDetailsForm.patchValue({

            tanNo: this.tanDetailsByCompanyId.companyTanDetail.tanNo,
            tanRegisterAt: this.tanDetailsByCompanyId.companyTanDetail.tanRegisteredAt,
            tdsCircle: this.tanDetailsByCompanyId.companyTanDetail.tdsCircle,
            deDuctorType: this.tanDetailsByCompanyId.companyTanDetail.deductorType,
            Address1: this.tanDetailsByCompanyId.companyTanDetail.line1,
            Address2: this.tanDetailsByCompanyId.companyTanDetail.line2,
            Address3: this.tanDetailsByCompanyId.companyTanDetail.line3,
            country1: this.tanDetailsByCompanyId.companyTanDetail.city.state.country.countryId,
            state1: this.tanDetailsByCompanyId.companyTanDetail.city.state.stateId,
            city1: this.tanDetailsByCompanyId.companyTanDetail.city.cityId,

            emailId1: this.tanDetailsByCompanyId.companyTanDetail.email,

            phone1: this.tanDetailsByCompanyId.companyTanDetail.phoneNo,

            name: this.tanDetailsByCompanyId.responsiblePersonName,
            panNo: this.tanDetailsByCompanyId.panNo,
            designnation: this.tanDetailsByCompanyId.designation,
            fathersName: this.tanDetailsByCompanyId.fatherName,
            mobileNo: this.tanDetailsByCompanyId.mobileNo,
            emailId2: this.tanDetailsByCompanyId.email,

            phone2: this.tanDetailsByCompanyId.phone,

            //isGovtDeductor: this.tanDetailsByCompanyId.companyForGovernmentDeductor.isGovernmentDeductor,
            isGovtDeductor: false,

            paoCode: this.tanDetailsByCompanyId.companyForGovernmentDeductor.paoCode,
            paoRegNo: this.tanDetailsByCompanyId.companyForGovernmentDeductor.paoRegNo,
            daooCode: this.tanDetailsByCompanyId.companyForGovernmentDeductor.ddoCode,
            daoRegNo: this.tanDetailsByCompanyId.companyForGovernmentDeductor.ddoRegNo,
            country2: this.tanDetailsByCompanyId.companyForGovernmentDeductor.city.state.country.countryId,
            state2: this.tanDetailsByCompanyId.companyForGovernmentDeductor.city.state.stateId,
            city2: this.tanDetailsByCompanyId.companyForGovernmentDeductor.city.cityId,

            selectministry: this.tanDetailsByCompanyId.companyForGovernmentDeductor.ministry,
            otherMinistry: this.tanDetailsByCompanyId.companyForGovernmentDeductor.otherMinistry



          })
          this.tabDetailsForm.get('isGovtDeductor')?.enable();
        }

        else {

          //disa edit button
          this.editButton = false;

           //show hide
        this.spinner.hide();
        }

      },
        (error) => {
          this.alertService.notify('error', 'Something Went Wrong');
           //show hide
        this.spinner.hide();
        })

  }


  //update form
  updateTandetails() {
    //show spinner
    this.spinner.show();

    console.log(this.tabDetailsForm.value);



    this.tabDetailsObject =

    {
      "companyTanResponsiblePersonDetailsId": this.tanDetailsByCompanyId.companyTanResponsiblePersonDetailsId,
      "responsiblePersonName": this.tabDetailsForm.value.name,
      "panNo": this.tabDetailsForm.value.panNo,
      "designation": this.tabDetailsForm.value.designnation,
      "fatherName": this.tabDetailsForm.value.fathersName,
      "mobileNo": this.tabDetailsForm.value.mobileNo,
      "email": this.tabDetailsForm.value.emailId2,
      "phone": this.tabDetailsForm.value.phone2,
      "createdBy": this.tanDetailsByCompanyId.createdBy,
      "createdDate": this.tanDetailsByCompanyId.createdDate,
      "isDeleted": this.tanDetailsByCompanyId.isDeleted,
      "company": {
        "companyId": 1
      },
      "companyForGovernmentDeductor": {
        "governmentDeductorId": this.tanDetailsByCompanyId.companyForGovernmentDeductor.governmentDeductorId,
        "ddoCode": this.tabDetailsForm.value.daooCode,
        "ddoRegNo": this.tabDetailsForm.value.daoRegNo,
        "isGovernmentDeductor": this.tabDetailsForm.value.isGovtDeductor,
        "otherMinistry": this.tabDetailsForm.value.otherMinistry,
        "paoCode": this.tabDetailsForm.value.paoCode,
        "paoRegNo": this.tabDetailsForm.value.paoRegNo,
        "createdBy": this.tanDetailsByCompanyId.companyForGovernmentDeductor.createdBy,
        "createdDate": this.tanDetailsByCompanyId.companyForGovernmentDeductor.createdDate,
        "isDeleted": this.tanDetailsByCompanyId.companyForGovernmentDeductor.isDeleted,
        "company": {
          "companyId": this.companyId
        },
        "ministry": this.tabDetailsForm.selectministry,
        "city": {
          "cityId": this.tabDetailsForm.value.city2
        }
      },
      "companyTanDetail": {
        "companyTanDetailsId": this.tanDetailsByCompanyId.companyTanDetail.companyTanDetailsId,
        "email": this.tabDetailsForm.value.emailId1,
        "line1": this.tabDetailsForm.value.Address1,
        "line2": this.tabDetailsForm.value.Address2,
        "line3": this.tabDetailsForm.value.Address3,
        "tanNo": this.tabDetailsForm.value.tanNo,
        "tanRegisteredAt": this.tabDetailsForm.value.tanRegisterAt,
        "tdsCircle": this.tabDetailsForm.value.tdsCircle,
        "phoneNo": this.tabDetailsForm.value.phone1,
        "createdBy": this.tanDetailsByCompanyId.companyTanDetail.createdBy,
        "createdDate": this.tanDetailsByCompanyId.companyTanDetail.createdDate,
        "isDeleted": this.tanDetailsByCompanyId.companyTanDetail.isDeleted,
        "city": {
          "cityId": this.tabDetailsForm.value.city1
        },
        "company": {
          "companyId": this.companyId
        },
        "deductorType": this.tabDetailsForm.deDuctorType
      }
    }


    let api: any = "companytanresponsiblepersondetail/" + this.tanDetailsByCompanyId.companyTanResponsiblePersonDetailsId
    this.crudeService.update(this.tabDetailsObject, api)
      .subscribe((data: any) => {

        this.alertService.notify('success', data.message);
         //show hide
         this.spinner.hide();

        this.tabDetailsForm.reset();

        this.editTandetails();
      },
        (error) => {
          this.alertService.notify('error', 'Something Went Wrong');
           //show hide
        this.spinner.hide();
        })




  }


  //submit form
  onSubmit() {

    //show spinner
    this.spinner.show();

    this.tabDetailsObject =

    {
      "responsiblePersonName": this.tabDetailsForm.value.name,
      "panNo": this.tabDetailsForm.value.panNo,
      "designation": this.tabDetailsForm.value.designnation,
      "fatherName": this.tabDetailsForm.value.fathersName,
      "mobileNo": this.tabDetailsForm.value.mobileNo,
      "email": this.tabDetailsForm.value.emailId2,
      "phone": this.tabDetailsForm.value.phone2,
      "company": {
        "companyId": this.companyId
      },
      "companyForGovernmentDeductor": {
        "ddoCode": this.tabDetailsForm.value.daooCode,
        "ddoRegNo": this.tabDetailsForm.value.daoRegNo,
        "isGovernmentDeductor": this.tabDetailsForm.value.isGovtDeductor,
        "otherMinistry": this.tabDetailsForm.value.otherMinistry,
        "paoCode": this.tabDetailsForm.value.paoCode,
        "paoRegNo": this.tabDetailsForm.value.paoRegNo,
        "company": {
          "companyId": this.companyId
        },
        "ministry": this.tabDetailsForm.selectministry ,
        "city": {
          "cityId": this.tabDetailsForm.value.city2
        }
      },
      "companyTanDetail": {
        "email": this.tabDetailsForm.value.emailId1,
        "line1": this.tabDetailsForm.value.Address1,
        "line2": this.tabDetailsForm.value.Address2,
        "line3": this.tabDetailsForm.value.Address3,
        "tanNo": this.tabDetailsForm.value.tanNo,
        "tanRegisteredAt": this.tabDetailsForm.value.tanRegisterAt,
        "tdsCircle": this.tabDetailsForm.value.tdsCircle,
        "phoneNo": this.tabDetailsForm.value.phone1,
        "city": {
          "cityId": this.tabDetailsForm.value.city1
        },
        "company": {
          "companyId": this.companyId
        },
        "deductorType": this.tabDetailsForm.deDuctorType
      }
    }


    let api: any = "companytanresponsiblepersondetail"
    this.crudeService.create(this.tabDetailsObject, api)
      .subscribe((data: any) => {


        this.alertService.notify('success', data.message);
        //show hide
        this.spinner.hide();
        this.tabDetailsForm.reset()
        //edit function
        this.editTandetails();
      },
        (error) => {
          this.alertService.notify('error', 'Something Went Wrong');
           //show hide
        this.spinner.hide();
        })




  }




}
