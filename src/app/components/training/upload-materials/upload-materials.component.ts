import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-upload-materials',
  templateUrl: './upload-materials.component.html',
  styleUrls: ['./upload-materials.component.css']
})
export class UploadMaterialsComponent implements OnInit {
  manageTrainingId: any;

  constructor(private formBuilder: FormBuilder, public datePipe: DatePipe, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService) { }
  @ViewChild('scrollMe') private myScrollContainer: any;

  public headerLoan: any = ["S.No", "Training Code", "Technology", "Trainer Name", "Start Date", "End Date", "Documents", "Action"];
  public headerLoan2: any = ["Document Name", "Document Type", "Action"];
  public companyId!: number;
  public saveAlert: boolean = false;
  public employeeId!: any;
  public endDate: Date = new Date("2023-01-16");  
  public editButtonEnable!: boolean;
  public loanObject!: any;
  public installmentAmount: any;
  public validationDocumentType:boolean=false;
  public loanAmount: any;
  public installmentMonths: any;
  public year: any;
  public month: any;
  public loanDate: any;
  public loanType: any;
  public status: any;
  public remarks: any;
  public downloadId: any;
  public searchModel = '';
  public loanData: any = [];
  public loanData2: any = [];
  public advanceData: any = [];
  public document: any = {};
  public loanAdvType: any = '';
  public submitProcessing = false;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public selectedPaymentDate: any;
  public now = new Date();
  public empId: any = Number(sessionStorage.getItem('empId'));
  public documentType:any;

  p: number = 1;
 

  public documentForm = this.formBuilder.group({
    documentType: ['', Validators.required],
    documentName: ['', Validators.required],
    selectedFile:['',Validators.required]
  })

  ngOnInit(): void {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.getAllEmployees();
  }

  get form_() { return this.documentForm.controls; };


  getAllEmployees() {
    this.spinner.show();
    let api = 'manage-training/list2/' + this.companyId ;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.loanData=data.data.content;

      this.spinner.hide();
      //pagination call
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }




  modelShow() {

    this.documentForm.reset();
    //hide edit button
    this.downloadId = 0;
    this.editButtonEnable = false;

  }

  modelShowEdit(data: any) {
if(data.endDate >this.now){
 this.validationDocumentType=true;
}else{  
  this.validationDocumentType=false;
}
this.documentForm.reset();
this.manageTrainingId=data.manageTrainingId;
    (<any>$('#employeeModelPopup')).modal('show');
  }

  search() {
    this.getAllEmployees();
  }

  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = 'trainingmaterial/trainingmaterialdownload?filePath=' + filePath;
    this.crudOperationsService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: "application/octet-stream" }); // must match the Accept type
        const filename = fileName;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        console.log(fileName)
        anchor.download = filename;
        anchor.href = url;
        anchor.click();
      },
        (error) => {
          this.notification.notify('error', 'Error while downloading the file');
        }
      )
  }
  viewDocument( data: any) {
    this.downloadId = data.manageTrainingId;
    (<any>$('#donwload_doc')).modal('show');
    let api = 'trainingmaterial/list_material/' + this.downloadId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.loanData2=data.data.content;
      this.spinner.hide();
      //pagination call
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  public fileSelected: boolean = false;

  public selectedFile: any;
  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileSelected = false;
  }

  submit() {
    // trainingmaterial
    this.submitted = true;
    for (let el in this.documentForm.controls) {
      if (this.documentForm.controls[el].errors) {
        console.log(el)
      }
    }
    if (this.documentForm.valid) {
      let formData2 = this.getFormData();
      let str = JSON.stringify(formData2);
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('form16', str);
      this.update(formData, `trainingmaterial`);
    }
  }




  update(formData: any, api: string) {
    this.submitProcessing = true;
    
    formData.append('file', this.selectedFile);
    this.crudOperationsService.uploadeDocument1(api,formData)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#employeeModelPopup')).modal('hide');
        this.submitProcessing = false;
        this.getAllEmployees();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {
    let data = {
      documentType: this.documentForm.value.documentType,
      documentName: this.documentForm.value.documentName,
      manageTraining: {
        "manageTrainingId": this.manageTrainingId
      },
      company: {
          "companyId": this.companyId
        }
    }
    return data;
  }

  clear() {
    this.submitted = false;
    this.documentForm.controls['documentType'].patchValue('');
    this.documentForm.controls['documentName'].patchValue('');
  }

  onAppliedDateValueChange(event: any) {
    this.selectedPaymentDate = new Date(event);
  }

}
