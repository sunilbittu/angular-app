import { Component, OnInit, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
@Component({
  selector: 'app-documents-center',
  templateUrl: './documents-center.component.html',
  styleUrls: ['./documents-center.component.css']
})
export class DocumentsCenterComponent implements OnInit {

  public documentCenterForm: any;
  public documentCenterFormObject: any;
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public employeeId: any = Number(sessionStorage.getItem("empId"));
  documentCenterList: any;
  public documentCenterId: any;
  public libraryType: string = "";
  public title: string = "";
  public uploadedType: string = "";
  public textData: string = "";
  public libraryType2: string = "";
  public title2: string = "";
  public uploadedType2: string = "";
  public textData2: string = "";
  public selectedFile!: File;
  @ViewChild('attachFile') attachFile: any;
  public uploadDocumentButton: any;
  public cancelClicked: any;
  public submitted: boolean = false;

  constructor(private crudOperationsService: CrudOperationsService, private notification: NotifierService,
    private crudeService: CrudOperationsService, private notificationService: NotifierService, private spinner: NgxSpinnerService) { }
  public modelText: any = "Text";
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public headers: any = ["S.No.", "Library Type", "Title", "Uploaded Type", "Text Data", "Action"];
  public enableUpdateButton: any;
  public typeModel: any = "text";
  public uploadedTypeModel: any = "";

  ngOnInit(): void {
    this.fetchDocumentCenterList();
  }
  public selectedLibraryType='';
  selected(){
    console.log(this.selectedLibraryType);
    sessionStorage.setItem("selectedLibraryType",this.selectedLibraryType);
    //this.fetchDocumentCenterList();
  }
  public searchModel='';
  fetchDocumentCenterList() {
    this.spinner.show();
    let api = "documentcenter/list_company/" + this.companyId+//"?type="+this.selectedLibraryType
    "?search="+this.searchModel;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.documentCenterList = data.data;
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })
  }

  downloadFile(filePath: any) {
    let downloadApi = 'documentcenter/documentcenter_download?filePath=' + filePath;
    this.crudOperationsService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: "application/octet-stream" }); // must match the Accept type
        const filename = filePath;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.download = filename;
        anchor.href = url;
        anchor.click();
      })
  }

  clear1() {
    this.libraryType = "";
    this.title = "";
    this.uploadedType = "";
    this.textData = "";
    this.submitted = false;
  }
  clear2() {
    this.libraryType2 = "";
    this.title2 = "";
    this.uploadedType2 = "";
    this.textData2 = "";
    this.submitted = false;
  }

  changeType() {
    // typeModel
    if (this.uploadedType == "file") {
      this.typeModel = "file";
      this.modelText = "File";
      this.uploadDocumentButton = true;
    }
    else if (this.uploadedType == "text") {
      this.typeModel = "text";
      this.modelText = "Text";
      this.uploadDocumentButton = false;
    }
    else {
      this.typeModel = "link";
      this.modelText = "Link";
      this.uploadDocumentButton = false;
    }

  }

  editDocumentCenter(doc: any) {
    this.documentCenterId = doc.documentCenterId;
    this.libraryType2 = doc.libraryType;
    this.title2 = doc.title;
    this.uploadedType2 = doc.uploadedType;
    this.textData2 = doc.textData;

  }
  updateDocumentCenter() {
    this.submitted = true;
    let object = { 'libraryType': this.libraryType2, 'title': this.title2, 'uploadedType': this.uploadedType2, 'textData': this.textData }
    let api: any = 'documentcenter/' + this.documentCenterId;
    this.crudOperationsService.update(object, api).subscribe((data: any) => {
      (<any>$('#myModal-edit')).modal('hide');
      console.log(data);
      this.clear2();
      this.fetchDocumentCenterList();
    })

  }
  createDocumentCenter() {
    this.submitted = true;
    if (this.checkDocumentCenter()) {
      let Object = {
        libraryType: this.libraryType,
        title: this.title,
        uploadedType: this.uploadedType,
        textData: this.textData,
        company: {
          companyId: this.companyId
        },
        employeeId: this.employeeId
      }

      let api: any = "documentcenter"
      this.crudOperationsService.create(Object, api)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          (<any>$('#myModal-add')).modal('hide');
          this.clear1();
          this.ngOnInit();
        },
          (error) => {
            this.notification.notify('error', 'Something Went Wrong');
            //show hide

          })
    }
  }

  checkDocumentCenter() {
    return this.libraryType && this.title && this.uploadedType && this.textData;
  }

  createDocumentCenterFileUpload() {
    this.submitted = true;
    if (this.checkDocumentCenter()) {
      let api: any = "documentcenter/documentcenter_fileupload"
      const fileBrowser = this.attachFile.nativeElement;
      if (fileBrowser.files && fileBrowser.files[0]) {

        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('libraryType', this.libraryType);
        formData.append('title', this.title);
        formData.append('uploadedType', this.uploadedType);
        formData.append('companyId', this.companyId);
        formData.append('employeeId', this.employeeId);
        this.crudOperationsService.create(formData, api)
          .subscribe((data: any) => {
            this.notificationService.notify('success', data.message);
            //fetching fetchDocumentAttachmentList
            this.fetchDocumentCenterList();
            //form reset
            this.clear1();

          },
            (error) => {
              this.notificationService.notify('error', 'Sommething Went Wrong');
            })
      }
    }
  }
  onFileChanged($event: any) {

    if (this.typeModel == "file") {
      this.selectedFile = $event.target.files[0];
      console.log(this.selectedFile);
    }
    else {

      this.selectedFile == null;
    }

  }
  deleteDocumentCenter(id: Number) {
    let api: any = 'documentcenter/' + id;
    this.crudOperationsService.delete(api).subscribe((data: any) => {
      this.notification.notify('success', data.message);

      this.fetchDocumentCenterList();
    },
      (error) => {
        this.notificationService.notify('error', 'Sommething Went Wrong');
      })
  }
}