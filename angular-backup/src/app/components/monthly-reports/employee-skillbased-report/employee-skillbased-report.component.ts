import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
@Component({
  selector: 'app-employee-skillbased-report',
  templateUrl: './employee-skillbased-report.component.html',
  styleUrls: ['./employee-skillbased-report.component.css']
})
export class EmployeeSkillbasedReportComponent implements OnInit {
  public headers: any = ["Branch Name", "Department Name", "Skill Name", "No.of Resources"];
  public headersCount: any = ["Employee Code", "Employee Name", "Skill Name", "Experience", "Remarks"];
  public companyId!: number;
  public employeesSkillCountList: any;
  public employeesSkillList: any;
  public branchDetailsList!: any[];
  public departmentsList: any;
  public branchModel: any = '';
  public departmentModel: any = '';
  public skillName: any = '';
  public employeesSkillDetaisList: any
  p: number = 1;
  public skillDetaisList: any;
  public invalidSkill = false;
  public selectedBranchId!: Number;
  public selectedDeptId!: Number;
  public selectedSkillName!: String;
  constructor(private crudOperationsService: CrudOperationsService, private crureService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService, private employeMasterService: EmployeeMastersService) { }
  ngOnInit(): void {
    this.fetchEmployeesListBySkillCount();
    this.fetchBranchDetailsList();
    this.fetchSkillsDetails();
  }
  onModelClose() {
    this.p = 1;
  }
  fetchEmployeesListBySkillCount() {
    //spinner show
    this.spinner.show();
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "employee/employee_skill_details_data/" + this.companyId
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesSkillCountList = data.data;
        this.employeesSkillList = data.data;
        //spinner hide
        this.spinner.hide();
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        })
  }
  fetchBranchDetailsList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {
        this.branchDetailsList = data.data.content;
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  fetchEmployeesDepartments(id: number) {
    //get companyId
    let api: any = "department/dropdownList_departments/" + id;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.departmentsList = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  //calling departmments based on branchId
  onchangeBranch(id: any) {
    this.fetchEmployeesDepartments(id);
  }
  onChangeSkill() {
    this.invalidSkill = false;
  }
  exportTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName='employee-skill-based-report'
    if (type == 'EXCEL') {
      fileName=fileName+'.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = "reports/employees_skills_details_report/" + type + "?companyId=" + this.companyId;
    this.crureService.downloadDocument(api)
      .subscribe((response: any) => {
        //spinner hide
        this.spinner.hide();
        let blob: any = new Blob([response], { type: fileType });
        const url = window.URL.createObjectURL(blob);
        if (type != 'EXCEL') {
          window.open(url);
        }
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;

        anchor.click();        //window.location.href = response.url;
        //this._FileSaverService.save(blob,'Employee_Branch_Report');
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        }
      )
  }
  fetchEmployeesSkillsData(branchId: Number, departmentId: Number, skillName: String) {
    this.selectedBranchId=branchId;
    this.selectedDeptId=departmentId;
    this.selectedSkillName=skillName;

    //spinner show
    this.spinner.show();
    //clear array data
    this.employeesSkillDetaisList = [];
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "employee/employee_skill_details/" + branchId + "/" + departmentId + "/" + skillName + "/" + this.companyId
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesSkillDetaisList = data.data;
        //spinner hide
        this.spinner.hide();
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        })
  }
  fetchSkillsDetails() {
    //spinner show
    this.spinner.show();
    let api: any = "employeeskilldetail/skilldropdowndetails"
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.skillDetaisList = data.data;
        console.log("THE DATA IS : =========================" ,data.data)
        //spinner hide
        this.spinner.hide();
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        })
  }
  submit(branch: any, department: Number, skillName: String) {
    if (skillName) {
      this.invalidSkill = false;
      this.spinner.show();
      let temp: any = [];
      if (branch && department && skillName) {
        temp = this.employeesSkillList.filter((s: any) => s.branch_id == branch && s.department_id == department && s.skill_name == skillName);
      } else if (branch && skillName) {
        temp = this.employeesSkillList.filter((s: any) => s.branch_id == branch && s.skill_name == skillName);
      } else if (department && skillName) {
        temp = this.employeesSkillList.filter((s: any) => s.department_id == department && s.skill_name == skillName);
      } else if (skillName) {
        temp = this.employeesSkillList.filter((s: any) => s.skill_name == skillName);
      } else {
        this.invalidSkill = true;
      }
      this.employeesSkillCountList = temp;
      this.spinner.hide();
    } else {
      this.invalidSkill = true;
    }
  }
  clear() {
    this.branchModel = '';
    this.departmentModel = '';
    this.skillName = '';
    this.invalidSkill = false;
    this.employeesSkillCountList = this.employeesSkillList;
  }

  exportTable2(type: string) {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    //spinner show
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'Skill Based Reports.xls';
      let api: any = "reports/skillReport/exportExcel/"+this.selectedBranchId+"/"+this.selectedDeptId+"/"+this.selectedSkillName+"/"+this.companyId;
      this.crureService.exportExcelReport(api,fileType)
    }
    else {
      fileType = 'Skill Based Reports.pdf';
      let api: any = "reports/skillReport/exportPDF/"+this.selectedBranchId+"/"+this.selectedDeptId+"/"+this.selectedSkillName+"/"+this.companyId;
      this.crureService.exportPDF(api,fileType)
    }
  }
}
