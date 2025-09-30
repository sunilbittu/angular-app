import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { EmployeeMastersService } from '../employee.masters.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
declare var $: any;

@Component({
  selector: 'app-funds-realized',
  templateUrl: './funds-realized.component.html',
  styleUrls: ['./funds-realized.component.css']
})
export class FundsRealizedComponent implements OnInit {
  public headers: any = ["Invoice No.", "Candidate Name", "Position Title", "Client Name", "Salary Offered", "Fee","Funds Realized On"];

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public gradeMastersForm!: FormGroup;
  public editButtonEnable!: boolean;
  public gradeList!: any[];
  public fundsList!: any[];
  public gradeObject!: any;
  public gradeId!: any;
  public invoiceNo:any;
  public invoiceObject:any;
  public exist: boolean = false;
  public exist2: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitted: boolean = false;

  public companyId!: number;

  constructor(private formBuilder: FormBuilder,public crudOperationsService: CrudOperationsService, private employeMasterService: EmployeeMastersService,
    private notification: NotifierService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

        //get designation list
    this.findAllInvoicesRealized();
    this.fetchGradeList()
  }

    //clear form values
  modelShow() {
    // this.exist = false;
    // this.exist2 = false;
    // this.gradeMastersForm.reset();
   
    // this.editButtonEnable = false;
    (<any>$('#candidate-invoice-modal')).modal('show');
    //this.changeInvoice();

  }
  public fundsRealizedOn:any;
  public candidateId:any;
  saveInvoice(){

    let formData = {
      'fundsRealizedOn': this.fundsRealizedOn
     }
    
    this.crudOperationsService.update(formData, `candidate/updateStatusDetails/${this.candidateId}`)
      .subscribe((data: any) => {
        this.notification.notify('success', 'Details Updated Successfully!');
        (<any>$('#candidate-invoice-modal')).modal('hide');
       
      },
        (_error) => {
        
          this.notification.notify('error', 'Something Went Wrong')
        })

  }
  clearDropCandidate(){
    
  }

  checkIfalreadyExist2(typedCode: any) {

    if (this.editButtonEnable == true) {
      let gradeList2: any[] = this.gradeList.filter(y => y.gradeId != this.gradeId);

      let code: any[] = gradeList2.filter(
        x => x.gradeCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    } else {
      let code: any[] = this.gradeList.filter(
        x => x.gradeCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    }
  }
  checkIfalreadyExist(typedName: any) {
    if (this.editButtonEnable == true) {
      let gradeList2: any[] = this.gradeList.filter(y => y.gradeId != this.gradeId);

      let name: any[] = gradeList2.filter(
        x => x.gradeName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    } else {
      let name: any[] = this.gradeList.filter(
        x => x.gradeName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    }
  }
  //get designation list
  fetchGradeList() {
    this.spinner.show();
    //getting companyId from session-storage
    //this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.findAllInvoices()
      .subscribe((data: any) => {
        this.spinner.hide();
        this.gradeList = data.data;
        console.log(this.gradeList)
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  findAllInvoicesRealized() {
    this.spinner.show();
    //getting companyId from session-storage
    //this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.findAllInvoicesRealized()
      .subscribe((data: any) => {
        this.spinner.hide();
        this.fundsList = data.data;
        //console.log(this.gradeList)
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  public candidateName:any;
  public positionTitle:any;
  public clientTitle:any;
  public clientAddress:any;
  public clientEmailId:any;
  public jobStartedDate:any;
  public ownerName:any;

  //public invoiceNo:any;
  public invoiceDate:any;
  public attentionTo:any;
  public salaryOffered:any;
  public Fee:any;
  //public fundsRealizedOn:any;

  changeInvoice(){
    //alert(this.invoiceNo);
    this.employeMasterService.findByInvoice(this.invoiceNo)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.invoiceObject = data.data;
        //console.log(this.gradeList)
        this.candidateId = this.invoiceObject.id;
        this.candidateName = this.invoiceObject.candidateId.candidateName;
       this.positionTitle = this.invoiceObject.jobId.positionName;
       this.clientTitle = this.invoiceObject.jobId.clientId.clientName;
       this.clientAddress = this.invoiceObject.jobId.clientId.clientLocation;
       this.ownerName = this.invoiceObject.jobId.jobOwner;

       this.invoiceDate = this.invoiceObject.invoiceDate;
       this.attentionTo = this.invoiceObject.attentionTo;
       this.salaryOffered = this.invoiceObject.salaryOffered;
       this.Fee = this.invoiceObject.Fee;

      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  editGradeMaster(id: number) {
    //show edit button
    this.editButtonEnable = true;

    this.gradeId = id

    this.employeMasterService.getGradeMasterById(id)
      .subscribe((data: any) => {
        const gradeListById = data.data[0]
        this.gradeMastersForm.patchValue({
          gradeCode: gradeListById.gradeCode,
          gradeName: gradeListById.gradeName
        })
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })

  }
  //delete designationMaster
  deleteGradeById(id: number) {
    this.employeMasterService.deleteGradeListById(id)
      .subscribe((data: any) => {
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchGradeList();
      },
        (error) => {
          if (error.error.error == 'Conflict') {
            this.notification.notify('error', error.error.message);
          } else {
            this.notification.notify('error', 'Something Went Worng');
          }
        })
  }
  //update grade master
  updateGradeMaster(id: number) {
    this.submitted = true;

    if (this.gradeMastersForm.valid == true && this.exist == false && this.exist2 == false) {
      this.gradeObject =
      {

        "gradeId ": this.gradeId,
        "gradeCode": this.gradeMastersForm.value.gradeCode,
        "gradeName": this.gradeMastersForm.value.gradeName,

        "company": {
          "companyId": this.companyId
        }

      }

      this.employeMasterService.updateGradeMaster(this.gradeId, this.gradeObject)
        .subscribe((data: any) => {
          this.submitted = false;

          this.notification.notify('success', data.message);
          $('#employeeModelPopup').modal('hide');
          //get designation list
          this.fetchGradeList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })

    }
  }
  //submit form data
  onSubmit() {
    this.submitted = true;

    if (this.gradeMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      $('#employeeModelPopup').modal('hide');

      this.gradeObject =
      {
        "gradeCode": this.gradeMastersForm.value.gradeCode,
        "gradeName": this.gradeMastersForm.value.gradeName,

        "company": {
          "companyId": this.companyId
        }

      }
      console.log(this.gradeObject)

      this.employeMasterService.postGradeMaster(this.gradeObject)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          this.submitted = false;

          //get designation list
          this.fetchGradeList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })

    }
  }
}
