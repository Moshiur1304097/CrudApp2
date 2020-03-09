import { ProductService } from './../services/product.service';
import { Observable } from 'rxjs';
import { Component, OnInit, ɵSWITCH_COMPILE_INJECTABLE__POST_R3__ } from '@angular/core';
import { IProduct } from '../models/product';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  product$:Observable<IProduct>;

  constructor(
    private _route:ActivatedRoute,
    private _router: Router,
    private _productService:ProductService,
  ) { }

  ngOnInit() {
    
    this.product$ = this._route.paramMap.pipe(
      switchMap((params: ParamMap) =>
          this._productService.getProductById(Number.parseInt(params.get('id')))
        ));
    
  }

  editProduct(product:IProduct):void{
    this.product$.subscribe(product =>{
      console.log('edit clicked!');
      this._router.navigate(['products/edit/' +product.id]);
    });
  }

}
