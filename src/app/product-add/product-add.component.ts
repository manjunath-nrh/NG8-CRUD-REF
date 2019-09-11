import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  productForm: FormGroup;
  prod_name = '';
  prod_desc = '';
  prod_price: number = null;
  isLoadingResults = false;

  constructor(private router: Router, private api: ApiService, private formBuilder: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit() {

    const date = new Date();
    console.log(this.datePipe.transform(date, 'dd-MM-yyyy'));

    this.productForm = this.formBuilder.group({
      prod_name : [null, Validators.required],
      prod_desc : [null, Validators.required],
      prod_price : [null, Validators.required],
      updated_at : [date]
    });
  }

  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.addProduct(this.productForm.value)
      .subscribe(
        (res: any) => {
          const id = res.id;
          this.isLoadingResults = false;
          this.router.navigate(['/product-details', id]);
        }, (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        });
  }

}
