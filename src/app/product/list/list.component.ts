import { ProductService } from './../services/product.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { IProduct } from '../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  products: Observable<IProduct[]> = null;

  constructor(  
    private _router:Router,
    private _productService:ProductService
  ) { }

  ngOnInit() {
    this.products= this._productService.getAllProducts();
  }


  deleteProduct(product):void{
    const result = this._productService.deleteProduct(product);
    console.log(result);
  }

  viewProduct(product: IProduct):void{
    this._router.navigate(['products/view/'+product.id]);
  }

}
