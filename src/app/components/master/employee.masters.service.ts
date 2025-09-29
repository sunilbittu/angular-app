import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class EmployeeMastersService {
  
    public global_URL: string = environment.BASE_URL;
  
  
    constructor(private http: HttpClient) { }



    //adding branch master
    public addBranchMasters(Object:any){
        return this.http.post(this.global_URL+"branchdetail",Object);
    }

    //getting branch master details
    public getBranchMaster(id:number,pageNumber:Number = 0){
      return this.http.get(this.global_URL+"branchdetail/list_company/"+id+"?searchParam="+ "&page=" + pageNumber + "&size=10");
    }

    //delete BranchDetails
    public deleteBranchDetails(id:number){
      return this.http.delete(this.global_URL+"branchdetail/"+id+"");
    }

    //get BranchDetailsById
    public BranchDetailsById(id:number){
      return this.http.get(this.global_URL+"branchdetail/"+id+"");
    }


    //update BranchDetails
    public updateBranchDetails(id:number,Object:any){
      return this.http.put(this.global_URL+"branchdetail/"+id+"",Object);
    }


    // DepartmentMater Services

    //post DepartmentMaster
    public postDepartmentMaster(Object:any){
      return this.http.post(this.global_URL+"department",Object);
    }

    //get DepartmentMasterList
    public getDepartmentList(id:number,pageNumber:Number = 0){
      return this.http.get(this.global_URL+"department/list_company/"+id+"?search="+ "&page=" + pageNumber + "&size=10");
    }

     //get DepartmentMasterList
     public getDepartmentListByBranchId(id:number){
      return this.http.get(this.global_URL+"department/dropdownList_departments/"+id+"")
    }

    //get departmentListById
    public getDepartmentMasterById(id:number){
      return this.http.get(this.global_URL+"department/"+id+"");
    }

    //delete departmentMasterById
    public deleteDepartmentListById(id:number){
      return this.http.delete(this.global_URL+"department/"+id+"");
    }

    //update departmentMaster
    public updateDepartmentMaster(id:number,Object:any){

      return this.http.put(this.global_URL+"department/"+id+"",Object);
    }



    // DesignationMater Services

    //post DesignationMater
    public postDesignationMaster(Object:any){
      return this.http.post(this.global_URL+"designation",Object);
    }

    //get DesignationMater
    public getDesignationList(id:number){
      return this.http.get(this.global_URL+"designation/list_company/"+id+'?search=&page=' + 0 + '&size=' + 200)
    }

    //get DesignationMaterById
    public getDesignationMasterById(id:number){
      return this.http.get(this.global_URL+"designation/"+id+"");
    }

    //delete DesignationMaterById
    public deleteDesignationListById(id:number){
      return this.http.delete(this.global_URL+"designation/"+id+"");
    }

    //update DesignationMater
    public updateDesignationMaster(id:number,Object:any){

      return this.http.put(this.global_URL+"designation/"+id+"",Object);
    }


    // VaccinationMater Services

    //post VaccinationMater
    public postVaccinationMaster(Object:any){
      return this.http.post(this.global_URL+"vaccination",Object);
    }

    //get VaccinationMater
    public getVaccinationList(id:number,pageNumber:Number = 0){
      return this.http.get(this.global_URL+"vaccination/list_company/"+id+"?searchParam="+ "&page=" + pageNumber + "&size=10");
    }

    //get VaccinationMaterById
    public getVaccinationMasterById(id:number){
      return this.http.get(this.global_URL+"vaccination/"+id+"");
    }

    //delete VaccinationMaterById
    public deleteVaccinationListById(id:number){
      return this.http.delete(this.global_URL+"vaccination/"+id+"");
    }

    //update VaccinationMater
    public updateVaccinationMaster(id:number,Object:any){

      return this.http.put(this.global_URL+"vaccination/"+id+"",Object);
    }




    // GradeMater Services

    //post GradeMater
    public postGradeMaster(Object:any){
      return this.http.post(this.global_URL+"grademaster",Object);
    }

    //get GradeMater
    public getGradeMasterList(id:number,pageNumber:Number = 0){
      return this.http.get(this.global_URL+"grademaster/list/"+id+"?search="+ "&page=" + pageNumber + "&size=10");
    }

    public findAllInvoices(){
      return this.http.get(this.global_URL+"candidate/findAllInvoices")
    }

    public findAllInvoicesRealized(){
      return this.http.get(this.global_URL+"candidate/findAllInvoicesRealized?year=&quater=")
    }

    public findByInvoice(id:number){
      return this.http.get(this.global_URL+"candidate/findByInvoice?invoiceNo="+id)
    }

    //get GradeMaterById
    public getGradeMasterById(id:number){
      return this.http.get(this.global_URL+"grademaster/"+id+"");
    }

    //delete GradeMaterById
    public deleteGradeListById(id:number){
      return this.http.delete(this.global_URL+"grademaster/"+id+"");
    }

    //update GradeMater
    public updateGradeMaster(id:number,Object:any){
      return this.http.put(this.global_URL+"grademaster/"+id+"",Object);
    }




    // CostCenterMater Services

    //post CostCenterMater
    public postCostCenterMaster(Object:any){
      return this.http.post(this.global_URL+"costcentermaster",Object);
    }

    //get CostCenterMater
    public getCostCenterMasterList(id:number,pageNumber:Number = 0) {
      return this.http.get(this.global_URL+"costcentermaster/list/"+id+"?search="+ "&page=" + pageNumber + "&size=10");
    }

    //get CostCenterMaterById
    public getCostCenterMasterById(id:number){
      return this.http.get(this.global_URL+"costcentermaster/"+id+"");
    }

    //delete CostCenterMaterById
    public deleteCostCenterListById(id:number){
      return this.http.delete(this.global_URL+"costcentermaster/"+id+"");
    }

    //update CostCenterMater
    public updateCostCenterMaster(id:number,Object:any){
      return this.http.put(this.global_URL+"costcentermaster/"+id+"",Object);
    }


    // ProjectMater Services

    //post ProjectMater
    public postProjectMaster(Object:any){
      return this.http.post(this.global_URL+"projectmaster",Object);
    }

    //get ProjectMater
    public getProjectMasterList(id:number,pageNumber:Number = 0){
      return this.http.get(this.global_URL+"projectmaster/list/"+id+"?search=" + "&page=" + pageNumber + "&size=100");
    }

    public getProjectMasterListForPage(id:number,pageNumber:Number = 0){
      return this.http.get(this.global_URL+"projectmaster/list/"+id+"?search=" + "&page=" + pageNumber + "&size=10");
    }

    //get ProjectMaterById
    public getProjectMasterById(id:number){
      return this.http.get(this.global_URL+"projectmaster/"+id+"");
    }

    //delete ProjectMaterById
    public deleteProjectListById(id:number){
      return this.http.delete(this.global_URL+"projectmaster/"+id+"");
    }

    //update ProjectMater
    public updateProjectMaster(id:number,Object:any){
      return this.http.put(this.global_URL+"projectmaster/"+id+"",Object);
    }




    // CategoryMater Services

    //post CategoryMater
    public postCategoryMaster(Object:any){
      return this.http.post(this.global_URL+"categorymaster",Object);
    }

    //get CategoryMater
    public getCategoryMasterList(id:number,pageNumber:Number = 0){
      return this.http.get(this.global_URL+"categorymaster/list/"+id+"?search=" + "&page=" + pageNumber + "&size=10");
    }

     //get CategoryMater
     public getBankMasterList(id:number){
      return this.http.get(this.global_URL+"bankmaster/list_company/"+id+"?search=&page=&size=10");
    }


    //get CategoryMaterById
    public getCategoryMasterById(id:number){
      return this.http.get(this.global_URL+"categorymaster/"+id+"");
    }

    //delete CategoryMaterById
    public deleteCategoryListById(id:number){
      return this.http.delete(this.global_URL+"categorymaster/"+id+"");
    }

    //update CategoryMater
    public updateCategoryMaster(id:number,Object:any){
      return this.http.put(this.global_URL+"categorymaster/"+id+"",Object);
    }

      // Currency Services

    //post CurrencyMater
    public postCurrencyMaster(Object:any){
      return this.http.post(this.global_URL+"currency",Object);
    }

    //get CurrencyMater
    public getCurrencyList(id:number,pageNumber:Number = 0){
      return this.http.get(this.global_URL+"currency/list_company/"+id+"?search="+"&page="+pageNumber+"&size=10");
    }

    //get CurrencyMaterById
    public getCurrencyMasterById(id:number){
      return this.http.get(this.global_URL+"currency/"+id+"");
    }

    //delete CurrencyMaterById
    public deleteCurrencyListById(id:number){
      return this.http.delete(this.global_URL+"currency/"+id+"");
    }

    //update CurrencyMater
    public updateCurrencyMaster(id:number,Object:any){

      return this.http.put(this.global_URL+"currency/"+id+"",Object);
    }


    //post TechnologyMaster
    public postTechnologyMaster(Object:any){
      return this.http.post(this.global_URL+"technologymaster",Object);
    }

    //get TechnologyMaster
    public getTechnologyList(id:number){
      return this.http.get(this.global_URL+"technologymaster/list_company/"+id+"")
    }

    //get TechnologyMasterById
    public getTechnologyMasterById(id:number){
      return this.http.get(this.global_URL+"technologymaster/"+id+"");
    }

    //delete TechnologyMasterById
    public deleteTechnologyListById(id:number){
      return this.http.delete(this.global_URL+"technologymaster/"+id+"");
    }

    //update TechnologyMaster
    public updateTechnologyMaster(id:number,Object:any){

      return this.http.put(this.global_URL+"technologymaster/"+id+"",Object);
    }

  
  }