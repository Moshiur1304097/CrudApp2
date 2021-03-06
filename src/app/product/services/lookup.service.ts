import { Injectable } from '@angular/core';
import { Lookup } from '../models/lookup';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

   private units: Array<Lookup> = [
      { name: "PCS", code:"1",category:1},
      { name: "Cartoon", code:"2",category:1},
      { name: "Gram", code:"3",category:1},
      { name: "Ltr", code:"4",category:1},
   ];

   private productCategories: Array<Lookup> = [
      { name: "Pickle", code:"1",category:1},
      { name: "Rice", code:"2",category:1},
      { name: "Oil", code:"3",category:1},
      { name: "Masala", code:"4",category:1},
   ];


  constructor() { }
  
  getProductCategories():Observable<Lookup[]>{
    return of(this.productCategories);
  }

  getUnits():Observable<Lookup[]>{
    return of(this.units);
  }

}
