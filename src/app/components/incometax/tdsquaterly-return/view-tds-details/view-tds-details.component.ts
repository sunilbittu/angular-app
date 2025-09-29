import { Component, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ShareDataService } from 'src/app/services/sharaData.service';

@Component({
  selector: 'app-view-tds-details',
  templateUrl: './view-tds-details.component.html',
  styleUrls: ['./view-tds-details.component.css']
})
export class ViewTdsDetailsComponent implements OnInit {

  constructor(public crudOperationsService:CrudOperationsService,public shareDataService:ShareDataService) { }
  public companyDetails:any = {};
  public challanList:any=[];
  public annexureList:any=[];
  public slaryDetails:any=[];
  public QuarterModel:any;
  public headers1:any=["Company","Tax No.","TAN No","TAN Regd At","TDS Circle","Deductor Type","Address","City","Pin Code","State","Email","Phone","Responsible Person Name","Father Name","Mobile No.","Res Phone","Res Email"];
  public headers2:any=["Payment Mode","Bank Name","Challan Amt.","Challan No.","Cheque No.","TDS Amt.","Surcharge","Edu Cess","Interest","Other","Deposit Date"];
  public headers3:any=["Emp Code","Name","Tax No.","Challan No.","TDS Amt.","TDS Depositing","Income Tax","Surcharge","Edu. Cess","Month","Gross Salary"];
  public headers4:any=["Emp Code","Emp Name","Tax No.","DOJ","DOL","Gender","Age","Gross Earning","Profesinal Tax","Chargable Income","Total Taxable Income","Income Tax","Surcharge","Education Cess","Net Taxable","Total Tax Deduction for Year",
  "TDS Deduction Previous Employee","80C","80CCG","80D","80E","80G","80CCD(1B)","Others","Standard Deduction","Examptions","HRA Examptions","Rebate(87A)","Other Examptions","LTA Examptions"
  ,"Leave Encashment Examptions","Gratuity Examption","Previous Employer Taxable Income","Landlord Pan1","Landlard Name1"];
  ngOnInit(): void {
   this.shareDataService.currentMessage.subscribe((message) =>{
      this.QuarterModel = message
      console.log('data',this.QuarterModel);
      
    });


    let companyId=Number(sessionStorage.getItem('companyId'));
    let url1 ="companytanresponsiblepersondetail/company_tan_details_for_quaterly/"+companyId;
    this.crudOperationsService.getList(url1).subscribe((data:any)=>{
      this.companyDetails = data.data;
        console.log(this.companyDetails);
    })
    let url2="challandeposit/company_challan_details_for_quaterly/"+companyId+"/"+this.QuarterModel;
    this.crudOperationsService.getList(url2).subscribe((data:any)=>{
      console.log(data);
      this.challanList=data.data;
    })
    let url3="challandeposit/company_annexure_details_for_quaterly/"+companyId+"/"+this.QuarterModel;
    this.crudOperationsService.getList(url3).subscribe((data:any)=>{
      console.log(data);
      this.annexureList=data.data;
    });
    let url4="challandeposit/company_salary_details_for_quaterly/"+companyId+"/"+this.QuarterModel;
    this.crudOperationsService.getList(url4).subscribe((data:any)=>{
      console.log(data);
      this.slaryDetails=data.data;
    });
  }

}
