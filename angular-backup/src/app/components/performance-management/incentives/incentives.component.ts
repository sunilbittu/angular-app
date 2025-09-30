import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-incentives',
  templateUrl: './incentives.component.html',
  styleUrls: ['./incentives.component.css']
})
export class IncentivesComponent implements OnInit {

  public companyId = Number(sessionStorage.getItem("companyId"));
  public departmentData: any;
  public selectedDepartment: any;
  public departmentModel: any;
  public headers2: any = ["Recruiter Name", "Candidate Name", "Joined Date", "Salary Offered", "Regular Incentive", "Additional Incentive", "Total","Payment Date", "Action"];
  public employeeList: any;
  public selectedDepartmentName: any;
  public leaveYear: any = [];
  public branchData: any;
  public selectedBranch: any;
  public branchModel: any;
  public toggleScreen: any;
  public employeeData: any;
  public designationData: any;
  public designationModel: any;
  public projectName: any;
  public categoryName: any;
  public designationName: any;
  public gradeName: any;
  public departmentName: any;
  public branchName: any;
  public employeeCode: any;
  public lastName: any;
  public firstName: any;
  public leavesList: any;
  public currentYear: any;
  public leaveMasterIndividualId: any;
  public employeesLoansData: any;
  public employeesTdsData: any;
  public encashMentAmount: any;
  public requiredErrorText = 'can\'t be blank';
  public headers3: any = ["Loan Type", "Date", "Loan Amount", "Installment Amount", "Installment Months", "Start Recovery Month", "Start Recovery Year", "Status"];

  constructor(public crudOperationsService: CrudOperationsService,
    public employeeMastersService: EmployeeMastersService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    //this.fetchBranches();
    this.getLeaveYearList();
  }
  
  public getLeaveYearList() {
    this.spinner.show();
    let api = 'leaveyear/list/' + this.companyId + '?page=0&size=100';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.leaveYear = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  fetchBranches() {
    this.spinner.show();
    this.employeeMastersService.getBranchMaster(this.companyId).subscribe((data: any) => {
      this.spinner.hide();
      this.branchData = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  fetchDepartments() {
    this.employeeMastersService.getDepartmentListByBranchId(this.branchModel).subscribe((data: any) => {
      this.departmentData = data.data;
    })
  }
  
  public leaveYearValidation:boolean=false;
  public submitted: boolean = false; 
  fetchEmployees() {
    this.submitted=true;
    this.toggleScreen = true;
    //console.log(this.branchModel);
    //console.log(this.departmentModel);
    if (!this.branchModel) {
      this.leaveYearValidation = true;
  } else {
      this.leaveYearValidation = false; 
  }
  this.spinner.show();
    let api: any = "candidate/findAllInvoicesRealized?year="+this.branchModel+'&quater='+this.departmentModel;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.employeeList = data.data;
    })
  }

  getDepartment(data: any) {
    this.selectedDepartment = this.departmentModel;
  }
  public editObject:any;
  editPromotion(data: any) {
    this.editObject = data;
  }

  clearData() {
    this.toggleScreen = false;
    this.employeeList = "";
    this.departmentModel = "";
    this.branchModel = "";
  }



  // taxprojection/tdsDeductedTillNow/{employeeId}

  terminateEmployee() {
    // let api: any = "leavemasterindividual/terminateEmployee/" + data.employeeId;
    // this.crudOperationsService.getList(api).subscribe((resp: any) => {
    //   console.log(data.firstName, " terminated successfully")
    //   this.fetchEmployees();

    // })
    let formData = {
      'paidDate': new Date()
     }
    
    this.crudOperationsService.update(formData, `candidate/updateStatusDetails/${this.editObject.id}`)
      .subscribe((data: any) => {
        //this.notification.notify('success', 'Details Updated Successfully!');
        //(<any>$('#candidate-invoice-modal')).modal('hide');
        this.fetchEmployees();
       
      },
        (_error) => {
        
          //this.notification.notify('error', 'Something Went Wrong')
        })
  }

  clearPromotion() {
    this.designationModel = "";
  }

}
