import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../../configuration/configuration.service';

@Component({
  selector: 'app-department-head-review',
  templateUrl: './department-head-review.component.html',
  styleUrls: ['./department-head-review.component.css']
})
export class DepartmentHeadReviewComponent implements OnInit {
  validationText: string = '';

  constructor(private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService,
    public configurationService: ConfigurationService, private notification: NotifierService) { }
  public saveAlert: boolean = false;
  public updateAlert: boolean = false;
  public headers: any = ['Grade', 'Number Of Employees', 'S', 'M', 'A', 'R', 'T'];

  public selectedItemsList: any = [];
  public selectedFinalizeList: any = [];
  public gradeCheckedIDs: any = [];
  public finalizeCheckedIDs: any = [];
  public selectAllModel: boolean = false;
  public toggleLoader: boolean = false;
  public showEmployee: boolean = false;
  public companyId: any;
  public employeeId: any;
  public deptHeadCounts: any = [];
  public financialYearList: any = [];
  public financialYearModel = '';
  public empKPADetails: any = {
    totalNoOfEmps: '',
    eligibleEmps: '',
    totalNoOfEmpsSelfRating: '',
    totalNoOfEmpsManagerRating: ''
  };

  public gradeList: any = [];
  public finalizeList: any = [];
  public employeeKPAGoalsList: any = [];
  public employeeRatingAndScoreList: any = [];
  public toggleLoader1: boolean = false;
  public toggleLoader2: boolean = false;
  public employeeUpdatedRatingList: any = [];
  public errors: any = [];
  public showErrors: boolean = false;
  public isKPAUpdateDisabled = false;
  public countToggleLoader: boolean = false;
  public submitProcessing: boolean = false;
  public finalizedCount: any = [];
  public remainingCount: any = [];
  p: number = 1;

  ngOnInit(): void {
    this.companyId = sessionStorage.getItem('companyId');
    this.employeeId = sessionStorage.getItem('empId');
    this.fetchFinancialYear();
    this.fetchGradeList();
  }
  fetchGradeList() {
    let url = "grademaster/list/" + this.companyId+ "?search=&page=&size=10";

    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.toggleLoader1 = false;
      let list = data.data.content;
      this.gradeList = list;
      this.gradeList.map(function (obj: any) {
        obj.gradeTempId = obj.gradeId;
        obj.isChecked = false;
      })
      this.finalizeList = list;
      this.finalizeList.map(function (obj: any) {
        obj.finalizeTempId = obj.gradeId;
        obj.selected = false;
      })
    },
      (error) => {
        this.toggleLoader1 = false;
        this.notification.notify('error', 'Something Went Worng');
      })
  }
  fetchFinancialYear() {
    this.spinner.show();
    this.toggleLoader = true;
    this.configurationService.fetchFinancialYear(this.companyId).subscribe((res: any) => {
      this.spinner.hide();
      this.toggleLoader = false;
      this.financialYearList = res.data.content;
    },
      (error) => {
        this.spinner.hide();
        this.toggleLoader = false;
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  fetchDeptHeadCounts() {
    this.countToggleLoader = true;
    let url = 'deptheadreview/list?companyId=' + this.companyId + '&employeeId=' + this.employeeId + '&financialYearId=' + this.financialYearModel;
    this.crudOperationsService.getList(url).subscribe((res: any) => {
      this.countToggleLoader = false;
      // this.notification.notify('success', res.message);
      this.deptHeadCounts = res.data;
    },
      (error) => {
        this.countToggleLoader = false;
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  changeSelection() {
    this.selectedItemsList = this.gradeList.filter((value: any) => {
      return value.isChecked
    });
    this.fetchCheckedIDs();
  }

  fetchCheckedIDs() {
    this.gradeCheckedIDs = []
    this.gradeList.forEach((value: any) => {
      if (value.isChecked) {
        this.gradeCheckedIDs.push(value.gradeTempId);
      }
    });
    this.fetchFilteredEmployeeList();
  }
  selectAll(flag: any) {
    if (!flag) {
      this.gradeList.filter((a: any) => {
        a.isChecked = true;
      })
    } else {
      this.gradeList.filter((a: any) => {
        a.isChecked = false;
      })
    }
    this.fetchCheckedIDs();
    this.selectAllModel = !this.selectAllModel;
  }
  changeFinalize() {
    this.validationText = '';
    this.selectedFinalizeList = this.finalizeList.filter((value: any) => {
      return value.selected
    });
    this.fetchFinalizeIDs();
  }

  fetchFinalizeIDs() {
    this.finalizeCheckedIDs = []
    this.finalizeList.forEach((value: any) => {
      if (value.selected) {
        this.finalizeCheckedIDs.push(value.finalizeTempId);
      }
    });
    let finalizeList = this.finalizeList.filter((f: any) => f.selected === true);
    if (finalizeList.length == 0) {
      this.employeeRatingAndScoreList.map(function (obj: any) {
        if (obj.isFinalized != true) {
          obj.selected = false;
        }
      })
    }
    for (let entry of finalizeList) {
      this.employeeRatingAndScoreList.map(function (obj: any) {
        if (obj.isFinalized != true) {
          if (obj.gradeId == entry.gradeId) {
            obj.selected = true;
          }
        }
      })
    }
  }
  fetchFilteredEmployeeList() {
    this.findEmpRatingsByDepartmentAndFY();
  }

  handleFincialYear() {
    this.deptHeadCounts = [];
    this.fetchEmployeeKPADetails();
    this.fetchDeptHeadCounts();
    this.findEmpRatingsByDepartmentAndFY();
  }
  fetchEmployeeKPADetails() {
    let url = 'deptheadreview/fetch-emp-details?companyId=' + this.companyId + '&employeeId=' + this.employeeId + '&financialYearId=' + this.financialYearModel;
    this.crudOperationsService.getList(url).subscribe((res: any) => {
      // this.notification.notify('success', res.message);
      this.empKPADetails = res.data;
    },
      (error) => {
        this.notification.notify('error', 'Something went wrong!');
      })
  }

  findEmpRatingsByDepartmentAndFY() {
    this.showEmployee = true;
    this.employeeRatingAndScoreList = [];
    this.toggleLoader = true;
    let url = 'deptheadreview/emp-list/dept-fy?companyId=' + this.companyId + '&employeeId=' + this.employeeId + '&financialYearId=' + this.financialYearModel;
    this.crudOperationsService.fetchEmployeeList(JSON.stringify(this.gradeCheckedIDs), url).subscribe((res: any) => {
      // this.notification.notify('success', res.message);
      this.toggleLoader = false;
      this.employeeRatingAndScoreList = res.data;
      this.finalizedCount = this.employeeRatingAndScoreList.filter((f: any) => f.isFinalized === true);
      console.log(this.finalizedCount)
      this.remainingCount = this.employeeRatingAndScoreList.filter((f: any) => f.isFinalized !== true);
      console.log(this.remainingCount)
      this.employeeRatingAndScoreList.map(function (obj: any) {
        obj.selected = obj.isFinalized;
        // if (obj.deptHeadRating == null) {
        //   obj.deptHeadRating = obj.managerRating;
        //   obj.deptHeadTotalScore = obj.managerTotalScore;
        // }
      })
    },
      (error) => {
        this.toggleLoader = false;
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  fetchEmployees(employeeId: number) {
    this.employeeKPAGoalsList = [];
    let url = 'deptheadreview/emp-list?companyId=' + this.companyId + '&employeeId=' + employeeId + '&financialYearId=' + this.financialYearModel;
    this.crudOperationsService.getList(url).subscribe((res: any) => {
      // this.notification.notify('success', res.message);
      this.toggleLoader2 = false;
      this.employeeKPAGoalsList = res.data;
      this.employeeKPAGoalsList.map(function (obj: any) {
        if (obj.deptHeadRating == null) {
          obj.deptHeadRating = obj.appraiserRating;
        }
      })
    },
      (error) => {
        this.toggleLoader2 = false;
        this.notification.notify('error', 'Something went wrong!');
      })
  }

  onClickCheckBox(id: any) {
    this.showErrors = false;
    this.validationText = '';
    const i = this.employeeRatingAndScoreList.findIndex((obj: any) => obj.employeeId == id);
    this.employeeRatingAndScoreList[i].selected = !this.employeeRatingAndScoreList[i].selected;
  }

  loadKPAList(employeeId: number, flag: boolean) {
    this.isKPAUpdateDisabled = flag;
    this.errors = [];
    this.toggleLoader2 = true;
    this.fetchEmployees(employeeId);
  }

  updateEmployeeGoals() {
    this.submitProcessing = true;
    let sumOfRatings = 0;
    let empId = '';
    this.employeeKPAGoalsList.forEach((e: any) => {
      sumOfRatings += e.deptHeadRating;
      empId = e.employeeId;
      this.employeeUpdatedRatingList.push(e);
    });
    sumOfRatings = sumOfRatings / this.employeeKPAGoalsList.length;
    sumOfRatings = Math.round(sumOfRatings * 100) / 100;
    const i = this.employeeRatingAndScoreList.findIndex((obj: any) => obj.employeeId == empId);
    this.employeeRatingAndScoreList[i].deptHeadRating = this.findSmart(sumOfRatings);
    this.employeeRatingAndScoreList[i].deptHeadTotalScore = sumOfRatings;

    let url = 'deptheadreview/update-rating';
    this.crudOperationsService.updateList(this.employeeKPAGoalsList, url).subscribe((res: any) => {
      this.submitProcessing = false;
      this.notification.notify('success', res.message);
      (<any>$('#emp_list')).modal('hide');
    },
      (error) => {
        this.submitProcessing = false;
        this.notification.notify('error', 'Something went wrong!');
      })
  }

  updateEmployeeRatingAndScore() {
    const eItems = this.employeeRatingAndScoreList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      this.submitProcessing = true;
      this.employeeUpdatedRatingList = [];
      for (let i = 0; i < this.employeeRatingAndScoreList.length; i++) {
        if (this.employeeRatingAndScoreList[i].selected) {
          this.employeeUpdatedRatingList.push(this.employeeRatingAndScoreList[i]);
        }
      }
      let url = 'deptheadreview/update-rating-score';
      this.crudOperationsService.updateList(this.employeeUpdatedRatingList, url).subscribe((res: any) => {
        this.submitProcessing = false;
        this.notification.notify('success', res.message);
        this.finalizeList.filter((a: any) => {
          a.selected = false;
        })
        this.findEmpRatingsByDepartmentAndFY();
      },
        (error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something went wrong!');
        })
    } else {
      this.validationText = 'Please select atleast one Employee(s)';
    }
  }
  public findSmart(rating: any) {
    if (rating >= 0 && rating <= 1.49) {
      return "T";
    }
    else if (rating >= 1.5 && rating <= 2.49) {
      return "R";
    }
    else if (rating >= 2.5 && rating <= 3.49) {
      return "A";
    }
    else if (rating >= 3.5 && rating <= 4.49) {
      return "M";
    }
    else if (rating >= 4.5 && rating <= 5) {
      return "S";
    }
    return "NA";
  }
  cancel() {
    this.employeeKPAGoalsList.map(function (obj: any) {
        obj.deptHeadRating = undefined;
        obj.deptHeadRemarks = undefined;
    })
  }
}
