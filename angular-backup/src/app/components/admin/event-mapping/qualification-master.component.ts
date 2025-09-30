import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { identifierName } from '@angular/compiler';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-qualification-master',
  templateUrl: './qualification-master.component.html',
  styleUrls: ['./qualification-master.component.css']
})
export class EventMappingComponent implements OnInit {

  public qualificationMasterForm = this.formBuilder.group({
    qualificationCode: ['', Validators.required],
    qualificationName: ['', Validators.required],
    qualificationType: ['', Validators.required],
  })
  editButtonEnable: boolean = false;
  id: any;
  get form_() { return this.qualificationMasterForm.controls; };
  public submitText: string = '';
  public qualificationObject: any;
  public submitProcessing: boolean = false;
  public employeeList = [];
  public eventsList = [];
  public roleList = [];
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public submitted: boolean = false;

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public cancelClicked: boolean = false;

  constructor(private formBuilder: FormBuilder, private notification: NotifierService, private crudOperationsService: CrudOperationsService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchQualificationsListByCompanyId();

    let url = 'employee/search-list/' + this.companyId + '?search=' + "" + '&page=' + "0" + '&size=200';
      this.crudOperationsService.getList(url)
        .subscribe((data: any) => {

          this.employeeList = data.data.content;
          
        })
        this.fetchAnnouncements();
        this.fetchRoleList();
  }

  fetchAnnouncements() {
    this.spinner.show();
    let api = "announcement/" + sessionStorage.getItem("companyId") + "/Event";
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.eventsList = data.data;
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })
  }

  fetchRoleList() {
    //getting companyId from session-storage
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "roles/eventRolesList?companyId=" + this.companyId;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.roleList = data.data;
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  public headers: any = ["User Name", "Event Name", "Role", "Action"];
  public qualifications: any = [];

  onSubmit() {
    if (this.submitText == 'Update') {
      this.updateQualificationData();
    }
    if (this.submitText == 'Save') {
      this.saveQualificationData();
    }
  }
  updateQualificationData() {
    this.submitted = true;
    if (this.qualificationMasterForm.valid) {
      //show spinner
      this.spinner.show();
      this.qualificationObject =
      {
        'qualificationCode': this.qualificationMasterForm.value.qualificationCode,
        'qualificationName': this.qualificationMasterForm.value.qualificationName,
        'qualificationType': this.qualificationMasterForm.value.qualificationType,
        "remarks":"event",
        'company': {
          'companyId': this.companyId
        }
      }

      let api: any = 'qualificationmaster/'+this.id;
      this.crudOperationsService.update(this.qualificationObject, api)
        .subscribe((data: any) => {
        
            this.notification.notify('success', data.message);
            this.resetTheForm();
            //show hide
            this.spinner.hide();
            //hide modelpopup
            (<any>$('#addQualification')).modal('hide');
            this.fetchQualificationsListByCompanyId();
          //}
          
        },
          (error) => {
            this.notification.notify('error', 'Something Went Wrong');
            //show hide
            this.spinner.hide();
          })
    }
  }

  clickAdd() {
    this.resetTheForm();
  }
  resetTheForm() {
    this.submitted = false;
    this.id = undefined;
    this.submitText = 'Save';
    this.qualificationMasterForm.reset();
  }

  saveQualificationData() {
    this.submitted = true;
    if (this.qualificationMasterForm.valid) {
      //show spinner
      this.spinner.show();
      this.qualificationObject =
      {
        'qualificationCode': this.qualificationMasterForm.value.qualificationCode,
        'qualificationName': this.qualificationMasterForm.value.qualificationName,
        'qualificationType': this.qualificationMasterForm.value.qualificationType,
        "remarks":"event",
        'company': {
          'companyId': this.companyId
        }
      }

      let api: any = 'qualificationmaster'
      this.crudOperationsService.create(this.qualificationObject, api)
        .subscribe((data: any) => {
          if(data.httpStatus=='CONFLICT'){
            this.spinner.hide();
              //hide modelpopup
            (<any>$('#addQualification')).modal('hide');
            this.notification.notify('error', "User Name & Event Name is duplicate");
          }else{

              this.notification.notify('success', data.message);
              this.resetTheForm();
              //show hide
              this.spinner.hide();
              //hide modelpopup
              (<any>$('#addQualification')).modal('hide');
              this.fetchQualificationsListByCompanyId();
          }
        },
          (error) => {
            this.notification.notify('error', 'Something Went Wrong');
            //show hide
            this.spinner.hide();
          })
    }
  }

  fetchQualificationsListByCompanyId() {
    this.spinner.show();
    let api: any = 'qualificationmaster/event-mapping-list_company/' + this.companyId + '';
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.qualifications = data.data;
        this.spinner.hide();
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Wrong');
        })
  }

  //delete designationMaster
  deleteById(id: number) {
    let api: any = "qualificationmaster/" + id;
    this.crudOperationsService.delete(api)
      .subscribe((data: any) => {
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchQualificationsListByCompanyId();
      },
        (error) => {
          if (error.error.error == 'Conflict') {
            this.notification.notify('error', error.error.message);
          } else {
            this.notification.notify('error', 'Something Went Worng');
          }
        })
  }

  //append form controls
  edit(data: any) {
    //show edit button
    this.editButtonEnable = true;
    this.submitText = 'Update';
    this.id = data.qualificationId;
    this.qualificationMasterForm.patchValue({
      qualificationCode: data.qualificationCode,
      qualificationName: data.qualificationName,
      qualificationType: data.qualificationType
    })
  }

}
