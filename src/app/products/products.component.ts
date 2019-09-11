import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  displayedColumns: string[] = ['prod_name', 'prod_price'];

  data: Product[] = [];
  isLoadingResults = true;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getProducts()
    .subscribe(
    (res: any) => {
      this.data = res;
      console.log(this.data);
      this.isLoadingResults = false;
    },
    err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

}
