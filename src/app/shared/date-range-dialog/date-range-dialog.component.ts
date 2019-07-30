import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialogRef, ErrorStateMatcher } from '@angular/material';

// export const FormErrors: { [key: string]: string } = {
//   required: 'This is a required field',
//   pattern: 'Email must be a valid email address (leia@alderaan.net).',
//   minLength: 'Password must contain at least 8 characters.',
//   mismatch: 'Passwords don\'t match.',
//   notValid: 'Passwords must contain at least 3 unique characters.'
// };
  
// Error when the parent is invalid
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'app-date-range-dialog',
  templateUrl: './date-range-dialog.component.html',
  styleUrls: ['./date-range-dialog.component.css']
})
export class DateRangeDialogComponent implements OnInit {

  form: FormGroup;
  errorMatcher = new CrossFieldErrorMatcher();
  // formErrors = FormErrors;
  
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DateRangeDialogComponent>) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      startDate: '',
      endDate: new Date()
    }, { 
      validator: this.checkDatesValidator 
    })
  }

  checkDatesValidator(group: FormGroup) {
    if ((!group.controls.endDate.value) || (!group.controls.startDate.value) || (group.controls.endDate.value < group.controls.startDate.value)) {
      return { notValid: true }
    }
    return null;
  }

  submit(form) {
    console.log( this.form.value.startDate, this.form.value.endDate );    
    if (this.form.valid) {
      this.dialogRef.close(`{ "startDate": "${form.value.startDate}", "endDate": "${form.value.endDate}" }`);
    }    
  }
 
  hasError = (controlName: string, errorName: string) =>{
    return this.form.controls[controlName].hasError(errorName);
  }
}
