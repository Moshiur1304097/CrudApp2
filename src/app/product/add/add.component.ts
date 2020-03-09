import { switchMap } from 'rxjs/operators';
import { ProductService } from './../services/product.service';
import { LookupService } from './../services/lookup.service';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Lookup } from '../models/lookup';
import { Product } from '../models/product';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';

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
  private _observableSubscription: Array<Subscription>= [];

  constructor(
    private _formBuilder: FormBuilder,
    private _lookupService: LookupService,
    private _productService: ProductService,
    private _router: Router,
    private _route:ActivatedRoute,
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

    const product$ = this._route.paramMap.pipe(
      switchMap((params: ParamMap) =>
      this._productService.getProductById(Number.parseInt(params.get('id')))
      ));


      product$.subscribe(product =>{

        if(!isNullOrUndefined(product)){
          console.log(product);
          this,this.productForm.get('id').setValue(product.id);
          this,this.productForm.get('name').setValue(product.name);
          this,this.productForm.get('code').setValue(product.code);
          this,this.productForm.get('category').setValue(product.category.code);
          this,this.productForm.get('unit').setValue(product.unit.code);
          this,this.productForm.get('salesRate').setValue(product.salesRate);
          this,this.productForm.get('purchaseRate').setValue(product.purchaseRate);

        }
      });

  }

  ngOnDestroy(){
    this._observableSubscription.forEach(item => {
      item.unsubscribe();
      console.log(item, 'unsubscribed');
    });
  }

  save($event:any):void{

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

  private saveProduct():void{
    
    const product = new Product();

       // map data from form to product
    product.id = this.productForm.get('id').value;
    product.name = this.productForm.get('name').value;
    product.code = this.productForm.get('code').value;

    product.unit = this.getLookupObjFromCode(this.productForm.get('unit').value);
    product.category =this.getLookupObjFromCode(this.productForm.get('category').value);
  

    product.purchaseRate = this.productForm.get('purchaseRate').value;
    product.salesRate = this.productForm.get('salesRate').value;

    //save to database
    if(product.id==0){
      this._productService.addNewProduct(product);
    }
  
    this._productService.updateProduct(product);

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
