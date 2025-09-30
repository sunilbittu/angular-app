import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { idLocale } from 'ngx-bootstrap/chronos';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  public requestHeader: any = ['Sr No.', 'Document Name', 'Document Type', 'Status', 'Action'];
  public approveHeader: any = ['Sr No.', 'Document Name', 'Document Type', 'Requested By', 'Description', 'Status', 'Action'];
  public headers1: any = ['Sr No.', 'Document Name', 'Document Type', 'Mandatory', 'Action'];

  public documentForm = this.formBuilder.group({
    documentName: ['', Validators.required],
    documentType: [null, Validators.required],
    documentFile: ['']
  })

  public requestDocForm: any = this.formBuilder.group({
    documentName: ['', Validators.required],
    documentType: [null, Validators.required],
    requestDescription: ['', Validators.required],
    docStatus: ['Open']
  })

  public approveDocumentForm: any = this.formBuilder.group({
    docStatus: ['Approve'],
    letter: [null, Validators.required],
    approvedescription: ['', Validators.required]
  });

  @ViewChild('attachFile') attachFile: any;

  public documentsAttachmentList!: any[];
  public documentsMasterList!: any[];
  public requestDocList!: any[];
  public approveDocList!: any[];
  public letterTemplateList: any = [];
  public companyId!: any;
  public documentId: any = '';
  public employeeId!: any;
  public isHrRole: any = false;
  public selectedFile!: File;
  public submitted: boolean = false;
  public submittedReqDoc: boolean = false;
  public submittedApprove: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitProcessing: boolean = false;
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public isFileSelected: boolean = false;
  public cancelClicked: any;

  constructor(public crudOperationsService: CrudOperationsService,
    private notificationService: NotifierService, private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    let role = sessionStorage.getItem('Edit-employee-role');
    if (role === "HR" || role === "Human Resource" || role === "ROLE_HR_HEAD" || role === "ROLE_HR") {
      this.isHrRole = true;
    } else {
      this.isHrRole = false;
    }
    this.employeeId = sessionStorage.getItem('Edit-employeeId');
    this.companyId = sessionStorage.getItem('companyId');
    this.fetchDocumentsMasterList();
    this.fetchDocumentAttachmentList(this.employeeId)
    this.fetchAllLetterTemplate();
    this.fetchApproveDocumentList();
    this.fetchOpenDocumentList(this.employeeId);
  }


  get doc_form_() { return this.documentForm.controls; };
  get form_() { return this.requestDocForm.controls; };
  get approve_form_() { return this.approveDocumentForm.controls; };

  //fetching documetsMasterList
  fetchDocumentsMasterList() {
    let api: any = 'documentmaster/dropdownList?companyId=' + this.companyId;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {

        this.documentsMasterList = data.data;
      },
        (error) => {
          this.notificationService.notify('error', 'Something went wrong');
        })

  }

  //fetch DocuumentAtachmentList
  fetchDocumentAttachmentList(id: number) {
    let api: any = 'employeedocumentsattachmentdetail/list_by_employee/' + id;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.documentsAttachmentList = data.data;
      },
        (error) => {
          this.notificationService.notify('error', 'Something went wrong');
        })
  }

  fetchOpenDocumentList(id: number) {
    let api: any = 'employeedocumentsattachmentdetail/open-list-by-employee/' + id;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.requestDocList = data.data;
      },
        (error) => {
          this.notificationService.notify('error', 'Something went wrong');
        })
  }

  fetchApproveDocumentList() {
    let api: any = 'employeedocumentsattachmentdetail/approve-list-by-employee';
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.approveDocList = data.data;
      },
        (error) => {
          this.notificationService.notify('error', 'Something went wrong');
        })
  }

  //Gets called when the user selects an File
  public onFileChanged(event: any) {
    //Select File
    this.isFileSelected = true;
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  onSubmit() {
    this.submittedReqDoc = true;
    if (this.requestDocForm.valid) {
      this.spinner.show();
      let obj = {
        'documentName': this.requestDocForm.value.documentName,
        'documentMaster': { 'documentId': this.requestDocForm.value.documentType },
        'employee': { 'employeeId': this.employeeId },
        'requestDescription': this.requestDocForm.value.requestDescription,
        'docStatus': this.requestDocForm.value.docStatus,
      }

      this.crudOperationsService.create(obj, 'employeedocumentsattachmentdetail')
        .subscribe((data: any) => {
          this.submittedReqDoc = false;
          this.notificationService.notify('success', data.message);
          this.spinner.hide();
          this.fetchOpenDocumentList(this.employeeId);
          this.fetchApproveDocumentList();
          this.cancel();
        },
          (error) => {
            this.notificationService.notify('error', 'Sommething Went Wrong');
            this.spinner.hide();
          })
    }
  }

  //downloade file

  downloadeDocumentAttachment(filePath: string, fileName: string) {
    this.crudOperationsService.downloadeDocument(filePath)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: "application/octet-stream" });
        let url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        anchor.target = "_blank";
        anchor.click();
        //window.location.href = response.url;
        //fileSaver.saveAs(blob, 'employees.json');
      },

        (error) => {
          console.log('Error downloading the file');
        }

      )
  }

  deleteDocumentAttachement(id: number) {

    //spinner show
    this.spinner.show();

    let api: any = 'employeedocumentsattachmentdetail/' + id;
    this.crudOperationsService.delete(api)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);
        //spinner hide
        this.spinner.hide();
        //fetching fetchDocumentAttachmentList
        this.fetchDocumentAttachmentList(this.employeeId);
        this.fetchApproveDocumentList();
      },
        (error) => {
          this.notificationService.notify('error', 'Something went wrong');
          //spinner hide
          this.spinner.hide();
        })
  }

  public cancel(): void {
    this.submittedReqDoc = false;
    this.requestDocForm.reset();
    this.requestDocForm.controls['docStatus'].patchValue('Open');
  }

  public cancelDoc(): void {
    this.submitted = false;
    this.documentForm.reset();
  }

  public approve(id: any): void {
    this.clearApprove();
    this.documentId = id
  }

  public submitStatus(): void {
    this.submittedApprove = true;
    if (this.approveDocumentForm.valid) {
      this.spinner.show();
      let obj = {
        'approvedescription': this.approveDocumentForm.value.approvedescription,
        'docStatus': this.approveDocumentForm.value.docStatus,
        'letterId': { 'templateId': this.approveDocumentForm.value.letter },
      }

      this.crudOperationsService.update(obj, 'employeedocumentsattachmentdetail/' + this.documentId)
        .subscribe((data: any) => {
          this.submitted = false;
          this.notificationService.notify('success', data.message);
          (<any>$('#approve-document')).modal('hide');
          this.spinner.hide();
          this.fetchDocumentAttachmentList(this.employeeId);
          this.fetchApproveDocumentList();
          this.cancel();
        },
          (error) => {
            this.notificationService.notify('error', 'Sommething Went Wrong');
            this.spinner.hide();
          })
    }
  }

  public clearApprove(): void {
    this.documentId = '';
    this.submittedApprove = false;
    this.approveDocumentForm.reset();
    this.approveDocumentForm.controls['docStatus'].patchValue('Approve');
  }

  fetchAllLetterTemplate() {
    let api: any = 'lettertemplatecreation/list?companyId=' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.letterTemplateList = data.data;
    },
      (error) => {
        this.notificationService.notify('error', 'Something Went Worng for Letter Template');
      })
  }

  downloadDocumentAttachment(id: any) {
    let downloadApi = 'employeedocumentsattachmentdetail/employeedocumentsdownloade?id=' + id;
    let fileName = 'Template.pdf';
    let fileType = 'application/pdf';
    this.crudOperationsService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: fileType });
        let url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;
        anchor.target = "_blank";
        anchor.click();
      },
        (error) => {
          this.notificationService.notify('error', 'Error while downloading the file');
        }
      )
  }

  onSubmitAttchment() {
    this.submitted = true;
    if (this.isFileSelected == true) {

      //spinner show
      this.spinner.show();

      console.log(this.documentForm.value);

      const fileBrowser = this.attachFile.nativeElement;
      if (fileBrowser.files && fileBrowser.files[0]) {

        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('documentName', this.documentForm.value.documentName);
        formData.append('documentId', this.documentForm.value.documentType);
        formData.append('employeeId', this.employeeId);

        console.log(formData);

        this.crudOperationsService.uploadeDocument(formData)
          .subscribe((data: any) => {
            this.submitted = false;
            this.isFileSelected = false;

            this.notificationService.notify('success', data.message);

            //spinner hide
            this.spinner.hide();

            //fetching fetchDocumentAttachmentList
            this.fetchDocumentAttachmentList(this.employeeId);
            //form reset
            this.documentForm.reset();

          },
            (error) => {
              this.notificationService.notify('error', 'Sommething Went Wrong');
              //spinner hide
              this.spinner.hide();

            })
      }

    }

  }

}
