import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-manager-goals-review',
  templateUrl: './manager-goals-review.component.html',
  styleUrls: ['./manager-goals-review.component.css']
})
export class ManagerGoalsReviewComponent implements OnInit {

  constructor(private crudeService: CrudOperationsService, private spinner: NgxSpinnerService) { }
  public headers: any = ['KPA Name', 'Designation', 'Departmennt', 'Grade', 'Year', 'Remarks', 'Action'];
  public kpaList: any = [];
  public kpaIds: any = [];
  public itemsPerPage: any;
  public currentPage: any;
  public totalItems: any;

  ngOnInit(): void {
    this.fetchKpaListByCompanyId();
  }
  fetchKpaListByCompanyId() {
    this.spinner.show();
    let companyId = Number(sessionStorage.getItem('companyId'));

    let api: any = 'goal_kpa/list_company/' + companyId + '?page=' + 0 + '&size=10';
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.kpaList = data.data.content;
        //pagination call
      },
        (error) => {
          this.spinner.hide();
        })
  }
  getkpaId(id: any) {
    this.kpaIds.push(id);
    console.log("aa", this.kpaIds);
  }
  approvereviews() {

  }
}
