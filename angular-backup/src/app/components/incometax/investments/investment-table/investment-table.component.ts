import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ShareDataService } from 'src/app/services/sharaData.service';

@Component({
  selector: 'app-investment-table',
  templateUrl: './investment-table.component.html',
  styleUrls: ['./investment-table.component.css']
})
export class InvestmentTableComponent implements OnInit {
  public investmentId: any;
  public yearModel: any = "";
  public investmentYear: any = [];
  public investmentData: any = [];
  public employeeId = Number(sessionStorage.getItem("empId"));
  public investmentEmployeeId: any;
  public toggleLoader: boolean = false;
  public invNameModel: any = '';
  public invDeclareModel: Number = 0;
  public invMadeModel: Number = 0;
  public invremarksModel: any;
  public tds_date: any;
  public invDateModel: any;
  public evidanceModel: any;
  public invType: any;
  public invProof: any;
  public invtypes: any = [];
  public invtypes1: any = [{ id: 1, type: 'Section 80C' },
  { id: 2, type: 'Section 80CCC' }, { id: 3, type: 'Section 80CCD' }, { id: 4, type: 'Other Section' }, { id: 5, type: 'House Rent Allowences' },
  { id: 6, type: 'Deduction of Interest on borrowing' }, { id: 7, type: 'Leave Travel concessions' }
  ];
  public InvestmentType: any;
  public id: any;
  public filepath: any;
  public submitted: boolean = false;
  public tdsDateModal: any = '';
  constructor(public router: Router, public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public shareDataService: ShareDataService, public datePipe: DatePipe, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.shareDataService.currentMessage.subscribe((message: any) => {
      this.investmentEmployeeId = message.employeeId
      console.log('data', this.investmentEmployeeId);
    });
    let companyId = sessionStorage.getItem("companyId")
    let url = "financialyear/list-by/" + companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log(data);
      this.investmentYear = data.data.content;
    })
  }
  getInvestmentdata() {
    this.toggleLoader = true;
    this.investmentData = [];

    if (this.investmentEmployeeId == 'Default' || this.investmentEmployeeId == undefined) {
      this.id = this.employeeId;
    } else {
      this.id = this.investmentEmployeeId;
    }
    // const id = this.investmentEmployeeId == 'Default' || undefined ? this.employeeId : this.investmentEmployeeId;
    let url = 'employeeinvestment/list_by_employee/' + this.id + '?financialYearId=' + Number(this.yearModel);
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.toggleLoader = false;
      this.investmentData = data.data.content;
      console.log("data", this.investmentData);
      // this.investmentYear=data.data.content;
    })
  }
  // employeeinvestment/list_by_employee/1?financialYearId=362
  addInvestment() {
    this.router.navigateByUrl('HRMS/Income-tax/check-investments/add-investments');
  }
  edit(data: any) {
    this.investmentId = data.employeeInvestmentId;
    this.getTdsInvestmentList();
    this.invNameModel = data.investmentsName;
    this.invDeclareModel = data.declared;
    this.invMadeModel = data.made;
    this.invremarksModel = data.remarks;
    this.invDateModel = data.investmentDate;
    this.invType = data.investmentType;
    this.invProof = data.fileName;
    this.filepath = data.filePath;
  }
  public selectedFile: any;
  onFileChanged(event: any) {
    //Select File
    this.selectedFile = event.target.files[0];
  }

  Investmentclick(type: any) {
    this.invType = type;
  }
  getTdsInvestmentList() {
    this.invtypes = [];
    let companyId = Number(sessionStorage.getItem("companyId"));
    let url = "tdsinvestmentlimit/tds_investment_list/" + companyId + '/' + this.yearModel;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log('tds', data);
      let tdsList = data.data;
      // tdsList.
      for (let i = 0; i < tdsList.length; i++) {
        for (let j = 0; j < this.invtypes1.length; j++) {
          if (tdsList[i].investmentType == this.invtypes1[j].type) {
            this.invtypes.push(this.invtypes1[j]);
          }
        }
      }
      console.log('list', this.invtypes);
    });
  }
  onTdsDateValueChange(event: any) {
    let selectedDate = new Date(event);
    this.tds_date = this.datePipe.transform(selectedDate, 'dd-MM-yyyy');
    this.tdsDateModal = this.tds_date;
    console.log(this.tds_date);
  }
  update() {
    this.submitted = true;
    if (this.checkForm()) {
      this.spinner.show();
      let obj = {
        financialYear: {
          financialYearId: Number(this.yearModel)
        },
        employee: {
          employeeId: this.id
        },
        investmentsName: this.invNameModel,
        investmentDate: this.tds_date,
        declared: Number(this.invDeclareModel),
        made: Number(this.invMadeModel),
        remarks: this.invremarksModel,
        investmentType: this.invType
      }
      let str = JSON.stringify(obj)
      console.log('str', str)
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('employeeInvestmentDTO', str);
      this.crudOperationsService.updateData('employeeinvestment/' + this.investmentId, formData).subscribe((data) => {
        this.spinner.hide();
        this.submitted = false;
        this.notification.notify('success', 'Investment updated successfully');
        this.getInvestmentdata();
        this.cancel();
      })
    }
  }

  checkForm() {
    return this.invNameModel && this.tdsDateModal && (this.evidanceModel || this.invProof);
  }
  cancel() {
    (<any>$('#update-model')).modal('hide');
    this.evidanceModel = "";
    this.invNameModel = '';
    this.invDeclareModel = 0;
    this.invMadeModel = 0;
    this.invremarksModel = "";
    this.invType = '';
    this.invProof = '';
  }

  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = 'employeeinvestment/investmentresourcedownload?filePath=' + filePath;
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
}
