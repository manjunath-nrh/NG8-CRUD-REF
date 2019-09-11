import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DatePipe } from '@angular/common';



/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  productForm: FormGroup;
  id = '';
  prod_name = '';
  prod_desc = '';
  prod_price: number = null;
  isLoadingResults = false;

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder, private datePipe: DatePipe) { }


  ngOnInit() {
    let date = new Date();
    console.log(this.datePipe.transform(date,'M/d/yyyy,h:mm a'));

    this.getProduct(this.route.snapshot.params.id);
    this.productForm = this.formBuilder.group({
      prod_name : [null, Validators.required],
      prod_desc : [null, Validators.required],
      prod_price : [null, Validators.required],
      updated_at : [date]
    });
  }


  getProduct(id: any) {
    this.api.getProduct(id).subscribe((data: any) => {
      this.id = data.id;
      this.productForm.setValue({
        prod_name: data.prod_name,
        prod_desc: data.prod_desc,
        prod_price: data.prod_price,
        updated_at : data.updated_at
      });
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.updateProduct(this.id, this.productForm.value)
      .subscribe(
        (res: any) => {
          const id = res.id;
          this.isLoadingResults = false;
          this.router.navigate(['/product-details', id]);
        }, (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }

  productDetails() {
    this.router.navigate(['/product-details', this.id]);
  }

}
