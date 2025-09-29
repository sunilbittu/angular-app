import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../validators/passwordMatchValidator'
import { RegistrationService } from '../../services/registration.service';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { gloabalMatching, noWhitespace } from 'src/app/validators/gloabal.validator';


@Component({
  selector: 'app-register-org',
  templateUrl: './register-org.component.html',
  styleUrls: ['./register-org.component.css']
})
export class RegisterOrgComponent implements OnInit {

  public signUpForm!: FormGroup;
  submitted = false;
  public countryList!: any;
  public statesList!: any;
  public citiesList!: any;
  public organisationFormData: any;

  public countryText: string = '';
  public stateText: string = '';
  public cityText: string = '';

  public emailExistant: any;


  constructor(private formBuilder: FormBuilder,
    private OrgService: RegistrationService,
    private notifier: NotifierService,
    private spinner: NgxSpinnerService,
    private route: Router
  ) { }

  ngOnInit(): void {

    //reactive form validations
    localStorage.setItem('token', "");
    localStorage.setItem("type", "");

    this.signUpForm = this.formBuilder.group({


      // organisationName: ['', [Validators.required, Validators.minLength(5), noWhitespace]],
      // orgEmail: ['', [Validators.required, Validators.email]],
      addressLane1: ['', Validators.required],
      addressLane2: ['', Validators.required],
      // orgAddress: ['', Validators.required],
      // country: ['', Validators.required],
      state: ['', Validators.required],
      // city: ['', Validators.required],
      // postalCode: ['', Validators.required],
      // CountryCode: ['', Validators.required],
      // phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10),
      // Validators.pattern("^[0-9]*$")]],
      gstNumber: ['', Validators.required],
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10),
      Validators.pattern("^[0-9]*$")]],
      username: [''],
      password: ['', Validators.required],
      conformPassword: ['', Validators.required],
      // acceptTerms: [false, Validators.requiredTrue]

    },

      {
        validator: MustMatch('password', 'conformPassword')
      });


    //getting country list
    this.getCountryList();



  }



  //get form controls
  get form() {
    return this.signUpForm.controls;
  }



  //getting country values
  getCountryList() {



    //getting country list
    this.OrgService.getCountryList()
      .subscribe((data) => {

        this.countryList = data;
        //console.log(this.countryList);

      },

        (error) => {

          console.log(error);

        }

      )

  }



  //getting states by country-id
  getStatesList($event: any) {

    this.countryText = $event.target.options[$event.target.options.selectedIndex].text;

    this.OrgService.getStatesListByCountryId(this.signUpForm.value.country)
      .subscribe((data) => {
        this.statesList = data;
      },

        (error) => {
          console.log(error);
        })

  }


  //getting city list by State-Id
  getCityList($event: any) {

    this.stateText = $event.target.options[$event.target.options.selectedIndex].text;

    this.OrgService.getCitiesListByStatesId(this.signUpForm.value.state)
      .subscribe((cities) => {

        this.citiesList = cities;
      },

        (error) => {
          console.log(error);
        }

      )
  }


  //setting postcode by city selection
  setPostCode($event: any) {

    this.cityText = $event.target.options[$event.target.options.selectedIndex].text;

    this.signUpForm.patchValue({
      postalCode: this.signUpForm.value.city
    })
  }



  //register organisation details
  onRegister() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.signUpForm.invalid) {
      return;
    }

    console.log(JSON.stringify(this.signUpForm.value));

    //show spinner
    this.spinner.show();


    this.organisationFormData = {

      "city": this.cityText,
      "contactEmail": this.signUpForm.value.contactEmail,
      "contactName": this.signUpForm.value.contactName,
      "contactNumber": this.signUpForm.value.contactNumber,
      "country": this.countryText,
      "gstn": this.signUpForm.value.gstNumber,
      "line1": this.signUpForm.value.addressLane1,
      "line2": this.signUpForm.value.addressLane2,
      "orgAddress": this.signUpForm.value.orgAddress,
      "orgEmail": this.signUpForm.value.orgEmail,
      "orgName": this.signUpForm.value.organisationName,
      "orgNumber": this.signUpForm.value.CountryCode + this.signUpForm.value.phoneNumber,
      "password": this.signUpForm.value.password,
      "state": this.stateText,
      "userName": this.signUpForm.value.contactEmail

    }


    //calling rgister service method
    this.OrgService.registerOrganisation(this.organisationFormData)
      .subscribe((responce) => {

        console.log(responce);

        setTimeout(() => {

          this.spinner.hide();
          this.notifier.notify('success', "Registration Success");
          this.route.navigateByUrl('/login');

        }, 1000)

        //this.openModal();

      }
        ,

        (error) => {

          // console.log(error)
          // this.spinner.hide();
          setTimeout(() => {

            this.spinner.hide();
            this.notifier.notify('success', "Registration Success");
            this.route.navigateByUrl('/login');
  
          }, 1000)

        })





  }

  cancel(){
    this.route.navigateByUrl('/login');
  }



  //Email check
  public isEmailCheck() {


    const emailControl = this.signUpForm.get('orgEmail');

    //alert('isEmailCheck');

    this.emailExistant = this.signUpForm.get('orgEmail')?.value;

    //calling email service rest api
    this.OrgService.checkEmailExits(this.emailExistant)
      .subscribe((data) => {

      },

        (error) => {
          if(error.error.text != 'NOT EXIST'){
              setTimeout(() => {


                this.notifier.notify('error', error.error.message);


              }, 1000)

              emailControl?.setValidators([gloabalMatching(this.emailExistant), Validators.required, Validators.email]);
              emailControl?.updateValueAndValidity();
          }
        }
      )

  }





  //Username check
  public isUsernameExits() {


    const userNameControl = this.signUpForm.get('username');


    //calling username service rest api
    this.OrgService.checkUsernameExits(this.signUpForm.get('username')?.value)
      .subscribe((data) => {


      },

        (error) => {
          if(error.error.text != 'NOT EXIST'){

              setTimeout(() => {


                this.notifier.notify('error', error.error.message);


              }, 1000)

              userNameControl?.setValidators([gloabalMatching(this.signUpForm.get('username')?.value),
              Validators.required]);
              userNameControl?.updateValueAndValidity();
          }
        }
      )

  }




  //contactEmail check
  public isContactEmailExits() {


    const contactEmailControl = this.signUpForm.get('contactEmail');


    //calling username service rest api
    this.OrgService.checkContactEmailExits(this.signUpForm.get('contactEmail')?.value)
      .subscribe((data) => {


      },

        (error) => {
          // console.log(JSON.stringify(error));
          // alert(JSON.stringify(error.error.text));
         if(error.error.text != 'NOT EXIST'){
              setTimeout(() => {


                //this.notifier.notify('error', error.error.message);


              }, 1000)

              contactEmailControl?.setValidators([gloabalMatching(this.signUpForm.get('contactEmail')?.value),
              Validators.required]);
              contactEmailControl?.updateValueAndValidity();
            }
        }
      )

  }




  //contactEmail check
  public isContactNumberExits() {


    const contactNumberControl = this.signUpForm.get('contactNumber');


    //calling username service rest api
    this.OrgService.checkContactNumberExits(this.signUpForm.get('contactNumber')?.value)
      .subscribe((data) => {

      },

        (error) => {
          if(error.error.text != 'NOT EXIST'){
          setTimeout(() => {


            this.notifier.notify('error', error.error.message);


          }, 1000)

          contactNumberControl?.setValidators([gloabalMatching(this.signUpForm.get('contactNumber')?.value),
          Validators.required]);
          contactNumberControl?.updateValueAndValidity();
        }
        }
      )

  }



  //function for model popup
  openModal() {
    const buttonModal = document.getElementById("openModalButton");
    console.log('buttonModal', buttonModal)
    buttonModal!.click()
  }

}
