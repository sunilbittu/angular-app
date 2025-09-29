import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-manage-trainers',
  templateUrl: './manage-trainers.component.html',
  styleUrls: ['./manage-trainers.component.css']
})
export class ManageTrainersComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe) { }

  public headers: any = ['Trainer Id', 'Trainer Name', 'Type', 'Contact Number', 'Email', 'Technology', 'Experience', 'Company', 'Actions'];
  public technologies: any = [];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public trainersList: any = [];
  public type: any = '';
  public id: any = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitText = '';
  public api = 'manage-trainers'
  public submitProcessing = false;
  public employeeDetails: any = {};
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public isForViewAndSubmitDisabled: boolean = false;
  public submitErrorText: any = '';
  public showExternal: boolean = true;
  public employeeList!: any[];
  public isForEdit: any = false;
  public isValidEmail: boolean = true;

  // pagination
  public p: number = 1;
  public itemsPerPage: any;
  public totalItems: any;
  public currentPage: any;
  public totalElements: number = 0;
  public showingFrom: number = 0;
  public showingTo: number = 0;
  public pageNumber: Number = 0;
  public pageSize: number = 20;

  public trainersForm = this.formBuilder.group({
    employee: [''],
    trainerId: ['', Validators.required],
    trainerName: ['', Validators.required],
    contactNo: ['', Validators.required],
    email: ['', Validators.required],
    technology: [null, Validators.required],
    experience: ['', Validators.required],
    company: ['', Validators.required],
  })

  get form_() { return this.trainersForm.controls; };

  get _form() { return this.trainersForm.value };

  ngOnInit(): void {
    this.getTrainersList();
  }
  ngAfterViewInit(): void {
    this.getAllEmployees();
    this.getAllTechnologies();
  }
  getAllTechnologies() {
    let listApi = 'technologymaster/dropdownList?companyId=' + this.companyId;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.technologies = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })

  }

  getAllEmployees() {
    let listApi = `employee/emp_list_company/${this.companyId}`;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }

  getEmpDetails(id: any) {
    this.crudOperationsService.getList(this.api + '/getEmployeeDetails/' + id)
      .subscribe((data: any) => {
        if (data.data) {
          this.employeeDetails = data.data;
          this.setJoiningData(this.employeeDetails);
          this.form_['trainerId'].patchValue(this.employeeDetails.trainerId);
          this.form_['trainerName'].patchValue(this.employeeDetails.trainerName);
          this.form_['contactNo'].patchValue(this.employeeDetails.contactNumber);
          this.form_['email'].patchValue(this.employeeDetails.email);
          this.form_['company'].patchValue(this.employeeDetails.companyName);
        } else {
          this.notification.notify('error', 'Personal Details not Found for this Employee!, Please check once');
          this.form_['trainerId'].patchValue('');
          this.form_['trainerName'].patchValue('');
          this.form_['contactNo'].patchValue('');
          this.form_['email'].patchValue('');
          this.form_['company'].patchValue('');
        }
      });
  }
  setJoiningData(data: any) {
    let doj = new Date(data.doj);
    var todayDate = new Date();
    let dojyear = todayDate.getFullYear() - doj.getFullYear();
    let dojmonth = todayDate.getMonth() - doj.getMonth();
    var dojday = todayDate.getDate() - doj.getDate();

    if (dojmonth <= 0) {
      dojyear--;
      dojmonth = (12 + dojmonth);
    }
    if (todayDate < doj) {
      dojmonth--;
      dojday = 30 + dojday;
    }
    if (dojmonth == 12) {
      dojyear = dojyear + 1;
      dojmonth = 0;
    }
    this.form_['experience'].patchValue(dojyear + '.' + dojmonth);
  }
  getTrainersList() {
    this.spinner.show();
    let api = this.api + '/list/' + this.companyId + '?page=' + this.pageNumber + '&size=' + this.pageSize;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.trainersList = data.data.content;
      //pagination call
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  public handlePagination(data: any): void {
    this.totalElements = data.data.totalElements;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.pageSize;
    this.showingFrom = (data.data.pageable.pageNumber * this.pageSize) + 1;
    const to = (data.data.pageable.pageNumber + 1) * this.pageSize;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  public pageChanged(event: any): void {
    this.pageNumber = event - 1;
    this.getTrainersList();
  }

  changeName() {
    let result = this.employeeList.find((e: any) => e.employeeId == this._form.employee);
    this.getEmpDetails(result.employeeId);
  }

  modelShow() {
    this.isForEdit = false;
    this.clear();
  }

  modelShowView(data: any) {
    this.loadFormData(data, true);
  }
  loadFormData(data: any, isForView: boolean) {
    this.trainersForm.reset();
    this.setJoiningData(data);
    this.form_['trainerId'].patchValue(data.trainerDetails.trainerId);
    this.form_['trainerName'].patchValue(data.trainerDetails.trainerName);
    this.form_['contactNo'].patchValue(data.trainerDetails.contactNumber);
    this.form_['email'].patchValue(data.trainerDetails.email);
    this.form_['company'].patchValue(data.trainerDetails.companyName);
    this.form_['experience'].patchValue(data.trainerDetails.experience);
    this.form_['technology'].patchValue(data.trainerDetails.technology);
    this.form_['employee'].patchValue(data.trainerDetails.trainerId);
    this.type = data.type;
    if (isForView) {
      this.isForViewAndSubmitDisabled = true;
      this.trainersForm.disable();
    } else {
      this.isForViewAndSubmitDisabled = false;
      this.trainersForm.enable();
    }
    (<any>$('#addPopup')).modal('show');
  }

  modelShowEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.id = data.trainerId;
    this.loadFormData(data, false);
    this.showExternal = data.type == 'External' ? true : false;
    this.isForEdit = true;
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (this.trainersForm.valid && this.isValidEmail) {
      let formData = this.getFormData();
      if (this.submitText !== 'Update') {
        this.save(formData, this.api);
      } else {
        this.update(formData, this.api + `/${this.id}`);
      }
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify(data.status, data.message);
        this.submitProcessing = false;
        if (data.status == 'success') {
          (<any>$('#addPopup')).modal('hide');
          this.ngOnInit();
          this.clear();
        }
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
        this.notification.notify(data.status, data.message);
        this.submitProcessing = false;
        if (data.status == 'success') {
          (<any>$('#addPopup')).modal('hide');
          this.ngOnInit();
          this.clear();
        }
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {
    let companyId = {
      'companyId': this.companyId
    };
    let technologyId = {
      'technologyId': Number(this.trainersForm.value.technology)
    }
    console.log(this.trainersForm.value.trainerId, '>>>> id')
    let trainerDetails = {
      "trainerId": this.trainersForm.value.trainerId,
      "trainerName": this.trainersForm.value.trainerName,
      "contactNumber": this.trainersForm.value.contactNo,
      "email": this.trainersForm.value.email,
      "technology": this.trainersForm.value.technology,
      "experience": this.trainersForm.value.experience,
      "companyId": 0,
      "companyName": this.trainersForm.value.company,
    }
    if (!this.isForEdit && !this.showExternal) {
      trainerDetails.companyId = this.employeeDetails.companyId;
    }
    let object = {
      "trainerDetails": trainerDetails,
      "companyId": companyId,
      "type": this.type,
      "technologyId": technologyId
    };
    return object;
  }

  clear() {
    this.submitted = false;
    this.isForViewAndSubmitDisabled = false;
    this.trainersForm.reset();
    this.id = undefined;
    this.submitText = 'Create';
    this.type = 'External';
    this.isValidEmail = true;
    this.handleReferencedType(this.type);
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }

  public seqNumber = 0;
  handleReferencedType(type: any) {
    this.showExternal = type == 'External' ? true : false;
    if (this.showExternal) {
      if (this.submitText != 'Update') {
        this.trainersForm.reset();
        this.spinner.show();
        let api = this.api + '/getExtSeqNumber';
        this.crudOperationsService.getList(api).subscribe((data: any) => {
          this.spinner.hide();
          this.seqNumber = data.data;
          this.form_['trainerId'].patchValue('EXT' + (this.seqNumber + 1));
        },
          (error) => {
            this.spinner.hide();
            console.log(error);
          })
      }
    } else {
      this.trainersForm.reset();
    }
  }

  validateMail() {
    let regexp: any = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    this.isValidEmail = regexp.test(this.trainersForm.value.email);
  }
}
