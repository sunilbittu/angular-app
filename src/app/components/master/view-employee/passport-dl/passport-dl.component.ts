import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddEmployeeService } from '../../addEmplyee.service';

@Component({
  selector: 'app-passport-dl',
  templateUrl: './passport-dl.component.html',
  styleUrls: ['./passport-dl.component.css']
})
export class PassportDlComponent implements OnInit {

  public passportDetailsForm!: FormGroup;
  public passportDetailsObject!: any;
  public employeeId!: number;
  public enableUpdateButton!: boolean;
  public passportDetailsList!: any;


  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe,
    private employeeService: AddEmployeeService, private notifier: NotifierService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.passportDetailsForm = this.formBuilder.group({

      passportNo: [''],
      passportIssueDate: [''],
      passportExpiryDate: [''],
      passportPlaceOfIssue: [''],
      visaType: [''],
      columnType: ['Both'],
      vehicleDetails: [''],
      drivingLicenseNo: [''],
      drivingLicenseIssueDate: [''],
      drivingLicenseExpiryDate: [''],
      drugLicenseNo: [''],
      drugIssueDate: [''],
      drugExpiryDate: [''],
      twoWheeler: [false],
      fourWheeler: [false]


    })

    //get EmployeeId from session
    this.employeeId = Number(sessionStorage.getItem('Edit-employeeId'));

    //get EmployeePassport Details By Id
    this.getEmployeePassportDetailsById(this.employeeId);

  }



  getEmployeePassportDetailsById(id: number) {

    //spinner show
    this.spinner.show();

    this.employeeService.getEmployeePassportDetailsById(id)
      .subscribe((data: any) => {

        //spinner hide
        this.spinner.hide();

        console.log(data.data);
        this.passportDetailsList = data.data;




        let drivingLicenseExpiryDate = new Date(this.passportDetailsList?.drivingLicenseExpiryDate);
        let drivingLicenseIssuedDate = new Date(this.passportDetailsList?.drivingLicenseIssuedDate);
        let drugExpiryDate = new Date(this.passportDetailsList?.drugExpiryDate);
        let drugIssuedDate = new Date(this.passportDetailsList?.drugIssuedDate);
        let passportExpiryDate = new Date(this.passportDetailsList?.passportExpiryDate);
        let passportIssuedDate = new Date(this.passportDetailsList?.passportIssuedDate);


        if (data.data == null) {
          this.enableUpdateButton = false;
        }



        else {

          this.enableUpdateButton = true;

          this.passportDetailsForm.patchValue({

            passportNo: this.passportDetailsList.passportNo,
            passportIssueDate: passportIssuedDate,
            passportExpiryDate: passportExpiryDate,
            passportPlaceOfIssue: this.passportDetailsList.passportPlaceOfIssue,
            visaType: this.passportDetailsList.visaType,
            columnType:this.passportDetailsList.columnType,
            vehicleDetails: this.passportDetailsList.vehicleDetails,
            drivingLicenseNo: this.passportDetailsList.drivingLicenseNo,
            drivingLicenseIssueDate: drivingLicenseIssuedDate,
            drivingLicenseExpiryDate: drivingLicenseExpiryDate,
            drugLicenseNo: this.passportDetailsList.drivingLicenseNo,
            drugIssueDate: drugIssuedDate,
            drugExpiryDate: drugExpiryDate,
            twoWheeler: this.passportDetailsList.twoWheeler,
            fourWheeler: this.passportDetailsList.fourWheeler

          })

        }



      },
      (error)=>{
         //show hide
         this.spinner.hide();
      })
  }



  updateEmployeePassportDetails(id: number) {

    //spinner show
    this.spinner.show();

    let drivingLicenseExpiryDate = new Date(this.passportDetailsForm.value.drivingLicenseExpiryDate);
    let drivingLicenseIssuedDate = new Date(this.passportDetailsForm.value.drivingLicenseIssueDate);
    let drugExpiryDate = new Date(this.passportDetailsForm.value.drugExpiryDate);
    let drugIssuedDate = new Date(this.passportDetailsForm.value.drugIssueDate);
    let passportExpiryDate = new Date(this.passportDetailsForm.value.passportExpiryDate);
    let passportIssuedDate = new Date(this.passportDetailsForm.value.passportIssueDate);
    //let status = new Date(this.passportDetailsForm.value.passportIssueDate);


    //form object
    this.passportDetailsObject =

    {

      "employeeDetailsId": this.passportDetailsList.employeeDetailsId,
      "drivingLicenseExpiryDate": drivingLicenseExpiryDate,
      "drivingLicenseIssuedDate": drivingLicenseIssuedDate,
      "drivingLicenseNo": this.passportDetailsForm.value.drivingLicenseNo,
      "drugExpiryDate": drugExpiryDate,
      "drugIssuedDate": drugIssuedDate,
      "drugLicenseNo": this.passportDetailsForm.value.drugLicenseNo,
      "fourWheeler": this.passportDetailsForm.value.fourWheeler,
      "passportExpiryDate": passportExpiryDate,
      "passportIssuedDate": passportIssuedDate,
      "passportNo": this.passportDetailsForm.value.passportNo,
      "passportPlaceOfIssue": this.passportDetailsForm.value.passportPlaceOfIssue,
      "visaType": this.passportDetailsForm.value.visaType,
      "columnType": this.passportDetailsForm.value.columnType,
      "twoWheeler": this.passportDetailsForm.value.twoWheeler,
      "vehicleDetails": this.passportDetailsForm.value.vehicleDetails,
      "createdBy": this.passportDetailsList.createdBy,
      "createdDate": this.passportDetailsList.createdDate,
      "isDeleted": this.passportDetailsList.isDeleted,
      "employee": {
        "employeeId": this.employeeId
      }

    }


    //post passportDetailsObject
    this.employeeService.updateEmployeePassportDetails(id, this.passportDetailsObject)
      .subscribe((data: any) => {

        this.notifier.notify('success', data.message);

        //spinner hide
        this.spinner.hide();

        //get EmployeePassport Details By Id
        this.getEmployeePassportDetailsById(this.employeeId);
      },
        (error) => {

          console.log(error);
           //show hide
           this.spinner.hide();
        })



  }



  onSubmit() {

    //spinner show
    this.spinner.show();

    let drivingLicenseExpiryDate = new Date(this.passportDetailsForm.value.drivingLicenseExpiryDate);
    let drivingLicenseIssuedDate = new Date(this.passportDetailsForm.value.drivingLicenseIssueDate);
    let drugExpiryDate = new Date(this.passportDetailsForm.value.drugExpiryDate);
    let drugIssuedDate = new Date(this.passportDetailsForm.value.drugIssueDate);
    let passportExpiryDate = new Date(this.passportDetailsForm.value.passportExpiryDate);
    let passportIssuedDate = new Date(this.passportDetailsForm.value.passportIssueDate);



    if (this.passportDetailsList != null) {
      this.updateEmployeePassportDetails(this.passportDetailsList.employeeDetailsId);
    }

    else {
      //form object
      this.passportDetailsObject =

      {
        "drivingLicenseExpiryDate": drivingLicenseExpiryDate,
        "drivingLicenseIssuedDate": drivingLicenseIssuedDate,
        "drivingLicenseNo": this.passportDetailsForm.value.drivingLicenseNo,
        "drugExpiryDate": drugExpiryDate,
        "drugIssuedDate": drugIssuedDate,
        "drugLicenseNo": this.passportDetailsForm.value.drugLicenseNo,
        "fourWheeler": this.passportDetailsForm.value.fourWheeler,
        "passportExpiryDate": passportExpiryDate,
        "passportIssuedDate": passportIssuedDate,
        "passportNo": this.passportDetailsForm.value.passportNo,
        "passportPlaceOfIssue": this.passportDetailsForm.value.passportPlaceOfIssue,
        "visaType": this.passportDetailsForm.value.visaType,
        "columnType": this.passportDetailsForm.value.columnType,
        "twoWheeler": this.passportDetailsForm.value.twoWheeler,
        "vehicleDetails": this.passportDetailsForm.value.vehicleDetails,
        "employee": {
          "employeeId": this.employeeId
        }
      }


      //post passportDetailsObject
      this.employeeService.postEmployeePassportDetails(this.passportDetailsObject)
        .subscribe((data: any) => {

          this.notifier.notify('success', data.message);

          //spinner hide
        this.spinner.hide();

          //get EmployeePassport Details By Id
          this.getEmployeePassportDetailsById(this.employeeId);

        },
          (error) => {

            console.log(error);
             //show hide
           this.spinner.hide();
          })

    }



  }

}
