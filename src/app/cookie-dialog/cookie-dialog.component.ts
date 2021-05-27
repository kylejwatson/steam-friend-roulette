import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { defaultValues } from '../cookie';

@Component({
  selector: 'app-cookie-dialog',
  templateUrl: './cookie-dialog.component.html',
  styleUrls: ['./cookie-dialog.component.scss']
})
export class CookieDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private cookie: CookieService
  ) {
    this.formGroup = formBuilder.group(defaultValues);
  }

  ngOnInit(): void {
    try {
      const cookiesAllowed = JSON.parse(this.cookie.get('cookiePermission'));
      this.formGroup.setValue(cookiesAllowed);
    } catch (error) {

    }
  }

  onFormSubmit(): void {
    if (this.formGroup.value.cookiePermission) {
      this.cookie.put('cookiePermission', JSON.stringify(this.formGroup.value));
    }
    for (const key of Object.keys(this.formGroup.value)) {
      if (!this.formGroup.value[key]) {
        this.cookie.remove(key);
      }
    }
  }

  setAll(checked: boolean): void {
    for (const key of Object.keys(this.formGroup.value)) {
      this.formGroup.value[key] = checked;
    }
    this.formGroup.setValue(this.formGroup.value);
  }

  allChecked(): boolean {
    return Object.values(this.formGroup.value).every(value => value);
  }

  someChecked(): boolean {
    return !this.allChecked() && Object.values(this.formGroup.value).some(value => value);
  }
}
