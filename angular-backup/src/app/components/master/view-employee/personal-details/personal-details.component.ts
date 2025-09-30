import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigurationService } from 'src/app/components/configuration/configuration.service';
import { AddEmployeeService } from '../../addEmplyee.service';
declare var $: any;


@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent implements OnInit {



  public personalDetailsForm!: FormGroup;
  public countrypresentList!: any[];
  public countrypermenentList!: any[];
  public presentStateList: any = [];
  public presentCityList: any = [];

  public permenentStateList: any = [];
  public permenentCityList: any = [];

  public personalObject!: any;

  public employeeId!: number;

  public enableUpdateButton!: boolean;

  public personalDetailsEmployee!: any;

  public presentCityIdValue: any;
  public permenentCityIdValue: any;
  public submitted: boolean=false;
  public requiredErrorText = 'can\'t be blank';
  marritalstatus: any;



  constructor(private commonService: ConfigurationService, private formBuilder: FormBuilder,
    private datePipe: DatePipe, public employeeService: AddEmployeeService,
    private notificationService: NotifierService, private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {

      //fetch present countries
      this.fetchCountriesPresent();

      //fetch permenent countries
      this.fetchCountriesPermenent();

         //get Employee Personal details By Id
    this.getEmployeePersonalDdetailsById(this.employeeId);
    
    this.initializeForm();

this.marriageStatus();


   
  }
  get form_() { return this.personalDetailsForm.controls};

  //fetch countries
  fetchCountriesPresent() {
    //get EmployeeId from session
    this.employeeId = Number(sessionStorage.getItem('Edit-employeeId'));
    this.commonService.fetchCountries().subscribe((res: any) => {

      this.countrypresentList = res.data.content;
    })
  }

  initializeForm(){
    this.personalDetailsForm = this.formBuilder.group({
      PresentAddress1: ['',Validators.required],
      PresentAddress2: [''],
      PresentCountry: ['',Validators.required],
      PresentState: ['',Validators.required],
      PresentCity: ['',Validators.required],
      PermenentAddress1: ['',Validators.required],
      PermenentAddress2: [''],
      PermenentCountry: ['',Validators.required],
      PermenentState: ['',Validators.required],
      PermenentCity: ['',Validators.required],
      TelephoneNumber: [''],
      PersonalNo: ['',Validators.required],
      OfficeMobileNo: [''],
      EmergencyContactName: [''],
      EmergencyContactNo: [''],
      ESICDespensary: [''],
      EmailPersonal: ['',Validators.required],
      EmailOfficial: [''],
      MaritalStatus: [''],
      MarriageDate: [''],
      NoOfChilds: [''],
      AgeUnder18: [''],
      AgeAbove18: [''],
      BloodGroup: [''],
      Height: [''],
      Weight: [''],
      Spectacles: [''],
      ModeOfRecruitment: [''],
      ReferenceBy: []
    });
  }


  //fetch countries
  fetchCountriesPermenent() {
    //get EmployeeId from session
    this.employeeId = Number(sessionStorage.getItem('Edit-employeeId'));
    this.commonService.fetchCountries().subscribe((res: any) => {

      this.countrypermenentList = res.data.content;
    })
  }





  //fetch Present states
  fetchPresentStates(id: number) {

    this.commonService.fetchStates(id).subscribe((res: any) => {

      this.presentStateList = res.data;
    })
  }

  // //fetch Present cities
  fetchPresentCities(id: number) {
    this.commonService.fetchCities(id).subscribe((res: any) => {
      this.presentCityList = res.data;
      console.log('presentCityList', this.presentCityList);
    })
  }



  //fetch Permenent states
  fetchPermenentStates(id: number) {

    this.commonService.fetchStates(id).subscribe((res: any) => {

      this.permenentStateList = res.data;
    })
  }

  //fetch Permenent cities
  fetchPermenentCities(id: number) {
    this.commonService.fetchCities(id).subscribe((res: any) => {

      this.permenentCityList = res.data;

      console.log('console.log(this.permenentCityList) ' + this.permenentCityList)

    })
  }



  //fetch present CountryList 
  onChangePresentCountries() {
    const countryId = this.personalDetailsForm.value['PresentCountry'];
    this.commonService.fetchStates(countryId).subscribe((res: any) => {
      this.presentStateList = res.data;
      if(this.personalDetailsForm.value['PermenentCountry'] == '') {
        this.personalDetailsForm.controls['PermenentCountry'].setValue(this.personalDetailsForm.value['PresentCountry']);
        this.permenentStateList = res.data;
      }
    })
  }

  //fetch present stateList 
  onChangePresentState() {
    const stateId = this.personalDetailsForm.value['PresentState'];
    
    this.commonService.fetchCities(stateId).subscribe((res: any) => {
      this.presentCityList = res.data;
      if(this.personalDetailsForm.value['PermenentState'] == '') {
        this.personalDetailsForm.controls['PermenentState'].setValue(this.personalDetailsForm.value['PresentState']);
        this.permenentCityList = res.data;
      }
      console.log('presentCityList', this.presentCityList);
    })
  }

  onChangePresentCity() {
    if(this.personalDetailsForm.value['PermenentCity'] == '' || this.personalDetailsForm.value['PermenentCity'] == undefined) {
      this.personalDetailsForm.controls['PermenentCity'].setValue(this.personalDetailsForm.value['PresentCity']);
      this.permenentCityIdValue = this.personalDetailsForm.value['PresentCity'];
    }
  }


  //fetch permenent CountryList 
  onChangePermenentCountries() {
    // const countryId = event.target.options[event.target.options.selectedIndex].value;
    const stateId = this.personalDetailsForm.value['PermenentCountry'];
    this.commonService.fetchStates(stateId).subscribe((res: any) => {
      this.permenentStateList = res.data;
    })
  }

  //fetch permenent StateList 
  onChangePermenentState() {
    // const stateId = event.target.options[event.target.options.selectedIndex].value;
    const stateId = this.personalDetailsForm.value['PermenentState'];

    this.commonService.fetchCities(stateId).subscribe((res: any) => {

      this.permenentCityList = res.data;

      console.log('console.log(this.permenentCityList) ' + this.permenentCityList)

    })
  }




  //fetch present cityId 
  // onChangePresentCity(event: any) {
  //   this.presentCityId = event.target.options[event.target.options.selectedIndex].value;
  //  alert(this.presentCityId);
  // }

  //fetch permenent cityId 
  // onChangePermenentCity(event: any) {
  //   this.permenentCityId = event.target.options[event.target.options.selectedIndex].value;
  //   alert(this.permenentCityId);
  // }


  getEmployeePersonalDdetailsById(id: number) {

    //show spinner
    this.spinner.show();
    this.employeeService.getEmployeePersonalDetailsById(id)
      .subscribe((data: any) => {

        //show spinner
    this.spinner.hide();

        this.personalDetailsEmployee = data.data;


        if (data.data == null) {
          this.enableUpdateButton = false
        }

        else {
          this.enableUpdateButton = true;

          let marrageDate = new Date(this.personalDetailsEmployee.marriageDate);

          //calling present state function
          this.fetchPresentStates(this.personalDetailsEmployee.city1.state.country.countryId);

          //calling present city
          this.fetchPresentCities(this.personalDetailsEmployee.city1.state.stateId);

          //calling permenent state function
          this.fetchPermenentStates(this.personalDetailsEmployee.city2.state.country.countryId);

          //calling permenent cities
          this.fetchPermenentCities(this.personalDetailsEmployee.city2.state.stateId)

          this.personalDetailsForm.patchValue({

            PresentAddress1: this.personalDetailsEmployee.presentAddress1,
            PresentAddress2: this.personalDetailsEmployee.presentAddress2,
            PresentCountry: this.personalDetailsEmployee.city1.state.country.countryId,
            PresentState: this.personalDetailsEmployee.city1.state.stateId,
            PresentCity: this.personalDetailsEmployee.city1.cityId,


            PermenentAddress1: this.personalDetailsEmployee.permanentAddress1,
            PermenentAddress2: this.personalDetailsEmployee.permanentAddress2,
            PermenentCountry: this.personalDetailsEmployee.city2.state.country.countryId,
            PermenentState: this.personalDetailsEmployee.city2.state.stateId,
            PermenentCity: this.personalDetailsEmployee.city2.cityId,


            TelephoneNumber: this.personalDetailsEmployee.telephoneNo,
            PersonalNo: this.personalDetailsEmployee.personalNo,
            OfficeMobileNo: this.personalDetailsEmployee.officeMobile,
            EmergencyContactName: this.personalDetailsEmployee.emergencyContactName,
            EmergencyContactNo: this.personalDetailsEmployee.emergencyContactNo,
            ESICDespensary: this.personalDetailsEmployee.esicDispensary,
            EmailPersonal: this.personalDetailsEmployee.personalEmail,
            EmailOfficial: this.personalDetailsEmployee.officalEmail,
            MaritalStatus: this.personalDetailsEmployee.maritalStatus,
            MarriageDate: marrageDate,
            NoOfChilds: this.personalDetailsEmployee.noOfChildrens,
            AgeUnder18: this.personalDetailsEmployee.ageUnder18,
            AgeAbove18: this.personalDetailsEmployee.ageAbove18,
            BloodGroup: this.personalDetailsEmployee.bloodGroup,
            Height: this.personalDetailsEmployee.height,
            Weight: this.personalDetailsEmployee.weight,
            Spectacles: this.personalDetailsEmployee.spectacles,
            ModeOfRecruitment: this.personalDetailsEmployee.modeOfRecruitment,
            ReferenceBy: this.personalDetailsEmployee.referenceBy

          })
        }
      },
      (error:any)=>{
        this.notificationService.notify('error', 'Something Wennt Wrong');
          //show hide
          this.spinner.hide();
      })
  }


  updateEmplooyeePersonalDetails(id: number) {
    this.submitted=true;
  
    if(this.personalDetailsForm.valid == true ){

    //show spinner
    this.spinner.show();

    let marrageDate = new Date(this.personalDetailsForm.value.MarriageDate);



    this.personalObject =

    {

      "personalDetailsId": this.personalDetailsEmployee.personalDetailsId,
      "bloodGroup": this.personalDetailsForm.value.BloodGroup,
      "emergencyContactName": this.personalDetailsForm.value.EmergencyContactName,
      "emergencyContactNo": this.personalDetailsForm.value.EmergencyContactNo,
      "esicDispensary": this.personalDetailsForm.value.ESICDespensary,
      "height": this.personalDetailsForm.value.Height,
      "maritalStatus": this.personalDetailsForm.value.MaritalStatus,
      "marriageDate": marrageDate,
      "modeOfRecruitment": this.personalDetailsForm.value.ModeOfRecruitment,
      "noOfChildrens": this.personalDetailsForm.value.NoOfChilds,
      "ageUnder18": this.personalDetailsForm.value.AgeUnder18,
      "ageAbove18": this.personalDetailsForm.value.AgeAbove18,
      "officalEmail": this.personalDetailsForm.value.EmailOfficial,
      "officeMobile": this.personalDetailsForm.value.OfficeMobileNo,
      "permanentAddress1": this.personalDetailsForm.value.PermenentAddress1,
      "permanentAddress2": this.personalDetailsForm.value.PermenentAddress2,
      //"permanentCityId": this.personalDetailsForm.value.PermenentCity,
      "city1": {
        "cityId": this.personalDetailsForm.value.PresentCity
      },
      "personalEmail": this.personalDetailsForm.value.EmailPersonal,
      "personalNo": this.personalDetailsForm.value.PersonalNo,
      "presentAddress1": this.personalDetailsForm.value.PresentAddress1,
      "presentAddress2": this.personalDetailsForm.value.PresentAddress2,
      //"presentCityId": this.personalDetailsForm.value.PresentCity,
      "city2": {
        "cityId": this.personalDetailsForm.value.PermenentCity
      },
      "referenceBy": this.personalDetailsForm.value.ReferenceBy,
      "spectacles": this.personalDetailsForm.value.Spectacles,
      "telephoneNo": this.personalDetailsForm.value.TelephoneNumber,
      "weight": this.personalDetailsForm.value.Weight,
      "createdBy": this.personalDetailsEmployee.createdBy,
      "createdDate": this.personalDetailsEmployee.createdDate,
      "isDeleted": this.personalDetailsEmployee.isDeleted,
      "employee": {
        "employeeId": this.employeeId
      }
    }

    console.log(this.personalObject);


    this.employeeService.UpdateEmployeePersonalDetails(this.personalDetailsEmployee.personalDetailsId, this.personalObject)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);
        this.submitted=false;

        //show hide
        this.spinner.hide();

        //get Employee Personal details By Id
        this.getEmployeePersonalDdetailsById(this.employeeId);
      },
        (error) => {
          //show hide
          this.spinner.hide();
          if (error.error.status == 500) {
            this.notificationService.notify('error', error.error.message);
          } else {
            this.notificationService.notify('error', 'Something Wennt Wrong');
          }
        })

      }
  }


  onSubmit() {

    this.submitted=true;
  
    if(this.personalDetailsForm.valid == true ){

    //alert(this.personalDetailsForm.value['PresentCity']);



    //show spinner
    this.spinner.show();

    // alert(this.personalDetailsForm.value['PresentCity']);

    //alert(this.personalDetailsForm.value['PermenentCity']);


    if (this.personalDetailsEmployee != null) {

      // this.updateEmplooyeePersonalDetails(this.personalDetailsEmployee.personalDetailsId);

    }

    else {

      let marrageDate = new Date(this.personalDetailsForm.value.MarriageDate);




      this.personalObject =

      {

        "bloodGroup": this.personalDetailsForm.value.BloodGroup,
        "emergencyContactName": this.personalDetailsForm.value.EmergencyContactName,
        "emergencyContactNo": this.personalDetailsForm.value.EmergencyContactNo,
        "esicDispensary": this.personalDetailsForm.value.ESICDespensary,
        "height": this.personalDetailsForm.value.Height,
        "maritalStatus": this.personalDetailsForm.value.MaritalStatus,
        "marriageDate": marrageDate,
        "modeOfRecruitment": this.personalDetailsForm.value.ModeOfRecruitment,
        "noOfChildrens": this.personalDetailsForm.value.NoOfChilds,
        "ageUnder18": this.personalDetailsForm.value.AgeUnder18,
        "ageAbove18": this.personalDetailsForm.value.AgeAbove18,
        "officalEmail": this.personalDetailsForm.value.EmailOfficial,
        "officeMobile": this.personalDetailsForm.value.OfficeMobileNo,
        "permanentAddress1": this.personalDetailsForm.value.PermenentAddress1,
        "permanentAddress2": this.personalDetailsForm.value.PermenentAddress2,
        // "permanentCityId": this.personalDetailsForm.value.PermenentCity,
        "city1": {
          "cityId": this.personalDetailsForm.value.PresentCity
        },
        "personalEmail": this.personalDetailsForm.value.EmailPersonal,
        "personalNo": this.personalDetailsForm.value.PersonalNo,
        "presentAddress1": this.personalDetailsForm.value.PresentAddress1,
        "presentAddress2": this.personalDetailsForm.value.PresentAddress2,
        // "presentCityId": this.personalDetailsForm.value.PresentCity,
        "city2": {
          "cityId": this.personalDetailsForm.value.PermenentCity
        },
        "referenceBy": this.personalDetailsForm.value.ReferenceBy,
        "spectacles": this.personalDetailsForm.value.Spectacles,
        "telephoneNo": this.personalDetailsForm.value.TelephoneNumber,
        "weight": this.personalDetailsForm.value.Weight,
        "employee": {
          "employeeId": this.employeeId
        }
      }


      console.log(this.personalObject);

      this.employeeService.PostEmployeePersonalDetails(this.personalObject)
        .subscribe((data: any) => {
          this.notificationService.notify('success', data.message);
          this.submitted=false;

          //show hide
            this.spinner.hide();

          // get Employee Personal details By Id
          this.getEmployeePersonalDdetailsById(this.employeeId);
        },
          (error) => {
            this.notificationService.notify('error', 'Something Wennt Wrong');
            //show hide
          this.spinner.hide();
          })

    }



  }

  }



  marriageStatus(){

    this.marritalstatus = this.personalDetailsForm.value.MaritalStatus;
console.log(this.marritalstatus,"marriage status")
    if(this.marritalstatus=="Married"){
      // this.personalDetailsForm.get('MarriageDate')?.enable();
      this.personalDetailsForm.controls['MarriageDate'].enable({onlySelf:true});
      this.personalDetailsForm.controls['NoOfChilds'].enable({onlySelf:true});
      this.personalDetailsForm.controls['AgeUnder18'].enable({onlySelf:true});
      this.personalDetailsForm.controls['AgeAbove18'].enable({onlySelf:true});
    }else{
      // this.personalDetailsForm.get('MarriageDate')?.disable();
      this.personalDetailsForm.controls['MarriageDate'].disable({onlySelf:true});
      this.personalDetailsForm.controls['NoOfChilds'].disable({onlySelf:true});
      this.personalDetailsForm.controls['AgeUnder18'].disable({onlySelf:true});
      this.personalDetailsForm.controls['AgeAbove18'].disable({onlySelf:true});
    }
  }


}
