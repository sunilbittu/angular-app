import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.css']
})
export class EmailSettingsComponent implements OnInit {
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  popoverTitle = 'Delete';
  popoverMessage = 'Are you sure want to Delete?';
  confirmClicked = false;
  cancelClicked = false;
  public emailForm: any;
  public emailFormObject: any;
  public submitted: boolean = false;
  public emailsList: any;
  public updateButton: boolean = false;
  public requiredErrorText = 'can\'t be blank';
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
  public id: any;
  public fieldTextType: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private crudeOperationService: CrudOperationsService,
    private spinner: NgxSpinnerService, private notification: NotifierService) { }

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required]],
      emailName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      fetchingEncryption: ['', [Validators.required]],
      fetchingProtocol: ['', [Validators.required]],
      fetchingHost: ['', [Validators.required]],
      fetchingPort: ['', [Validators.required]],
      isDefault: [false],
      isDeleteEmailsOnceFetched: [false],
      transferProtocol: [null, [Validators.required]],
      internalNotes: ['', [Validators.required]],
    })
  }

  ngAfterViewInit() {
    //geting Emails list
    this.getEmailsList();
  }
  // convenience getter for easy access to form fields
  get f() { return this.emailForm.controls; }
  //intial model loadform
  createEmailFormModel() {
    //enable submit button
    this.updateButton = false;
    //reset form fields
    this.emailForm.reset();
    this.submitted = false;
  }
  getEmailsList() {
    //spinner show
    this.spinner.show();
    let api: any = "emails-setting/list/" + this.companyId;
    this.crudeOperationService.getList(api)
      .subscribe((data: any) => {
        this.emailsList = data.data.content;
        this.handlePagination(data);
        //spinner hide
        this.spinner.hide();
      },
        (error) => {
          console.log(error);
          //spinner hide
          this.spinner.hide();
          this.notification.notify('error', 'Something went wrong!');
        })
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
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
    this.getEmailsList();
  }

  loadFormData(data: any) {
    this.emailForm.reset();
    this.submitted = false;
    this.emailForm.controls['emailAddress'].patchValue(data.emailAddress);
    this.emailForm.controls['emailName'].patchValue(data.emailName);
    this.emailForm.controls['password'].patchValue(data.password);
    this.emailForm.controls['fetchingProtocol'].patchValue(data.fetchingProtocol);
    this.emailForm.controls['fetchingHost'].patchValue(data.fetchingHost);
    this.emailForm.controls['fetchingPort'].patchValue(data.fetchingPort);
    this.emailForm.controls['fetchingEncryption'].patchValue(data.fetchingEncryption);
    this.emailForm.controls['transferProtocol'].patchValue(data.transferProtocol);
    this.emailForm.controls['internalNotes'].patchValue(data.internalNotes);
    this.emailForm.controls['isDefault'].patchValue(data.isDefault);
    this.emailForm.controls['isDeleteEmailsOnceFetched'].patchValue(data.isDeleteEmailsOnceFetched);

    (<any>$('#add')).modal('show');
  }

  modelShowEdit(data: any) {
    this.loadFormData(data);
    this.updateButton = true;
    this.id = data.id;
  }
  onUpdate() {
    this.emailFormObject =
    {
      "id": this.id,
      "emailAddress": this.emailForm.value.emailAddress,
      "userName": this.emailForm.value.userName,
      "emailName": this.emailForm.value.emailName,
      "password": this.emailForm.value.password,
      "fetchingHost": this.emailForm.value.fetchingHost,
      "fetchingPort": this.emailForm.value.fetchingPort,
      "fetchingProtocol": this.emailForm.value.fetchingProtocol,
      "fetchingEncryption": this.emailForm.value.fetchingEncryption,
      "internalNotes": this.emailForm.value.internalNotes,
      "transferProtocol": this.emailForm.value.transferProtocol,
      "isDefault": this.emailForm.value.isDefault ? this.emailForm.value.isDefault : false,
      "isDeleteEmailsOnceFetched": this.emailForm.value.isDeleteEmailsOnceFetched ? this.emailForm.value.isDeleteEmailsOnceFetched : false,
      "company": { 'companyId': this.companyId }
    }
    if (this.emailForm.valid) {
      let api: any = "emails-setting/" + this.id
      this.crudeOperationService.update(this.emailFormObject, api)
        .subscribe((data: any) => {
          //hide modelpopup
          (<any>$('#add')).modal('hide');
          this.notification.notify('success', 'Email Setting Updated Successfully!');
          //geting Emails list
          this.getEmailsList();
          //spinner hide
          this.spinner.hide();
        },
          (error) => {
            //hide modelpopup
            this.notification.notify('error', 'Something went wrong!');
            //spinner hide
            this.spinner.hide();
            console.log(error);
          })
    }
  }
  onSubmit() {
    console.log("hi ======================= ", this.emailForm.value);
    for (let el in this.emailForm.controls) {
      if (this.emailForm.controls[el].errors) {
        console.log(el)
      }
    }
    this.submitted = true;
    if (this.emailForm.valid) {
      //spinner show
      this.spinner.show();
      this.emailFormObject =
      {
        "emailAddress": this.emailForm.value.emailAddress,
        "emailName": this.emailForm.value.emailName,
        "password": this.emailForm.value.password,
        "fetchingHost": this.emailForm.value.fetchingHost,
        "fetchingPort": this.emailForm.value.fetchingPort,
        "fetchingProtocol": this.emailForm.value.fetchingProtocol,
        "fetchingEncryption": this.emailForm.value.fetchingEncryption,
        "internalNotes": this.emailForm.value.internalNotes,
        "transferProtocol": this.emailForm.value.transferProtocol,
        "isDefault": this.emailForm.value.isDefault ? this.emailForm.value.isDefault : false,
        "isDeleteEmailsOnceFetched": this.emailForm.value.isDeleteEmailsOnceFetched ? this.emailForm.value.isDeleteEmailsOnceFetched : false,
        "company": { 'companyId': this.companyId }
      }
      let api: any = "emails-setting"
      console.log("data is ================ ", this.emailFormObject);
      this.crudeOperationService.create(this.emailFormObject, api)
        .subscribe((data: any) => {
          //hide modelpopup
          (<any>$('#add')).modal('hide');
          this.notification.notify('success', 'Email Setting Saved Successfully!');
          //geting Emails list
          this.getEmailsList();
          //spinner hide
          this.spinner.hide();
        },
          (error) => {
            //hide modelpopup
            this.notification.notify('error', 'Something went wrong!');
            //spinner hide
            this.spinner.hide();
            console.log(error);
          })
    }
  }
  deleteEmail(id: any) {
    this.spinner.show();
    let api: any = "emails-setting"
    this.crudeOperationService.delete(api + "/" + id)
      .subscribe((data: any) => {
        this.notification.notify('success', 'Email Setting Deleted Successfully!');
        //geting Emails list
        this.getEmailsList();
        //spinner hide
        this.spinner.hide();
      },
        (error) => {
          //hide modelpopup
          this.notification.notify('error', 'Something went wrong!');
          //spinner hide
          this.spinner.hide();
          console.log(error);
        })
  }

  resetTheForm(): void {
    this.emailForm.reset();
    this.submitted = false;
  }
}
