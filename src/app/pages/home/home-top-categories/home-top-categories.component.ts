import {
  Component,
  OnInit,
} from '@angular/core';

import { Path } from '../../../config';
import { CategoriesService } from '../../../services/categories.service';

@Component({
  selector: 'app-home-top-categories',
  templateUrl: './home-top-categories.component.html',
  styleUrls: ['./home-top-categories.component.css']
})
export class HomeTopCategoriesComponent implements OnInit {
  path:string = Path.url;
	categories:any[] = [];
	preload:boolean = false;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.preload = true;

		/*=============================================
		Tomamos la data de las categorias
		=============================================*/

		let getCategories:any = [];

		this.categoriesService.getFilterData("state","show")
		.subscribe( resp => {
			let i;
			for(i in resp){
				getCategories.push(resp[i])
			}
			/*=============================================
			Ordenamos de mayor vistas a menor vistas el arreglo de objetos
			=============================================*/
			getCategories.sort(function(a,b){
				return(b.view - a.view)
			})
			/*=============================================
			Filtramos hasta 6 categorías
			=============================================*/
			getCategories.forEach((category, index)=>{
				if(index < 6){
					this.categories[index] = getCategories[index];
					this.preload = false;
				}
			})
		})
	}
}
