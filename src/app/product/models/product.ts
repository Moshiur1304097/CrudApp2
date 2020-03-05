import { Lookup } from './lookup';

export interface IProduct{
    id:number;
    name: string;
    code: string;
    category: Lookup;
    unit: Lookup;
    salesRate: number;
    purchaseRate: number;
}

export class Product {

}

