import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  statuses = ['Stable', 'Critical', 'Finished'];
  projectForm: FormGroup;
  submitted = false;

  ngOnInit() {
    this.projectForm = new FormGroup({
      'projectName': new FormControl(null, Validators.required, 
          CustomValidators.forbiddenProjectNameAsync.bind(CustomValidators)),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'status': new FormControl('Critical')
    })
  }

  onSubmit() {
    console.log(this.projectForm);
    if (this.projectForm.valid){
      this.submitted = true;
    }
    else {
      this.submitted = false;
    }
  }

  forbiddenProjectName (control: FormControl): {[s: string]: boolean} {
    if (control.value && (control.value).toLowerCase() === this.forbiddenName) {
      return {'forbiddenProjectName': true};
    }
    return null;
  }
}
