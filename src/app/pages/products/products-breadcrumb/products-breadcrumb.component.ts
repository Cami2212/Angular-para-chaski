import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Path } from '../../../config';
import { CategoriesService } from '../../../services/categories.service';
import { SubCategoriesService } from '../../../services/sub-categories.service';

@Component({
  selector: 'app-products-breadcrumb',
  templateUrl: './products-breadcrumb.component.html',
  styleUrls: ['./products-breadcrumb.component.css']
})
export class ProductsBreadcrumbComponent implements OnInit {
  path:string= Path.url
  breadCrumb: any

  constructor(private categoriesServices: CategoriesService, private subcategoryServices :SubCategoriesService, private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    let param= this.activatedRoute.snapshot.params["param"]

    this.categoriesServices.getFilterData("url", param).subscribe(resp =>{
      if(Object.keys(resp).length>0){
        for (let i in resp){
        this.breadCrumb= resp[i].name
        let id = Object.keys(resp).toString()
        let value={
          "view": Number(resp[i].view+1)
        }
        this.categoriesServices.patchData(id,value).subscribe(patchData=>{
        })
        }
      }
      else{
        this.subcategoryServices.getFilterData("url", param).subscribe(subresp =>{
            for (let i in subresp){
            this.breadCrumb = subresp[i].name
            let id = Object.keys(subresp).toString()
        let value={
          "view": Number(subresp[i].view+1)
        }
        this.subcategoryServices.patchData(id,value).subscribe(patchData=>{
        })
          }
        })
      }
    })
  }
}
