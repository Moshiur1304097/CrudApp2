import { ProductService } from './../services/product.service';
import { LookupService } from './../services/lookup.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Lookup } from '../models/lookup';
import { Product } from '../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  productForm =this._formBuilder.group({});
  units:Observable<Lookup[]>;
  categories:Observable<Lookup[]>;

  formSubmitted = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _lookupService: LookupService,
    private _productService: ProductService,
    private _router: Router,
    ) { }

  ngOnInit() {
    this.productForm.addControl('id', new FormControl(''));
    this.productForm.addControl('name', new FormControl('',[Validators.required]));
    this.productForm.addControl('code', new FormControl('',[Validators.required]));
    this.productForm.addControl('unit', new FormControl('',[Validators.required]));
    this.productForm.addControl('category', new FormControl('',[Validators.required]));
    this.productForm.addControl('salesRate', new FormControl('',[Validators.required]));
    this.productForm.addControl('purchaseRate', new FormControl('',[Validators.required]));
    
    this.units = this._lookupService.getUnits();
    this.categories = this._lookupService.getProductCategories();

  }
  save($event):void{

    this.formSubmitted =true;

    if(!this.productForm.valid)
    {
      return;
    }

    this.saveProduct();

    // navigate back to products list
    this._router.navigate(['/products']);

  }

  saveAndContinue($event):void{

    this.formSubmitted =true;

    if(!this.productForm.valid)
    {
      return;
    }

    this.saveProduct();
    
  }

  private saveProduct(){
    const product = new Product();

    product.id = this.productForm.get('id').value;
    product.name = this.productForm.get('name').value;
    product.code = this.productForm.get('code').value;

    product.category =this.getLookupObjFromCode(this.productForm.get('category').value);
    product.unit = this.getLookupObjFromCode(this.productForm.get('unit').value);

    product.purchaseRate = this.productForm.get('purchaseRate').value;
    product.salesRate = this.productForm.get('salesRate').value;
  
    this._productService.addNewProduct(product);

  }

  getLookupObjFromCode(code: string): Lookup {
    var lookup:Lookup =null;
    const subscription = this.units.subscribe(lookups =>{
      lookup =lookups.find(item => item.code ==code)
    })

    subscription.unsubscribe();
    return lookup;
  }


}
