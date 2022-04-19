import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  DomSanitizer
} from '@angular/platform-browser';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {

  EmployeeForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.EmployeeForm = this.fb.group({
        name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(20)]),
        designation: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(20)]),
        contact: this.fb.array([]),
        skills: this.fb.array([]),
        dob: new FormControl('', [Validators.required]),
      }),
      this.addSkills();
    this.addPhone(0);
  }

  get skills(): FormArray {
    return this.EmployeeForm.get("skills") as FormArray
  }
  get phone(): FormArray {
    return this.EmployeeForm.get("contact") as FormArray
  }

  newSkill(): FormControl {
    return new FormControl('', [Validators.required,Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(15)])
  }

  newPhone(): FormGroup {
    return this.fb.group({
      type: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])
    })
  }

  addSkills() {
    this.skills.push(this.newSkill());
  }

  addPhone(i) {
    if (i < 3) {
      this.phone.push(this.newPhone());
    } else {
      window.alert("Can Not Add more than 4 Numbers")
    }
  }

  removeSkills(i: number) {
    this.skills.removeAt(i);
  }
  removePhone(i: number) {
    this.phone.removeAt(i);
  }

  jsonData = []
  submit() {
    console.log(this.EmployeeForm.value);
    this.jsonData.push(this.EmployeeForm.value)
    var displayJSON = document.getElementById("JSON");
    displayJSON.innerHTML = JSON.stringify(this.jsonData);
    this.EmployeeForm.reset();
  }

  downloadUrl;
  filename = "";
  downloadJSON() {
    var res = this.jsonData;
    this.filename = "JSONFILE" + (Math.floor((Math.random() * 10000) + 1));
    var data = JSON.stringify(res);
    var url = this.sanitizer.bypassSecurityTrustUrl(
      "data:text/json;charset=UTF-8," + encodeURIComponent(data)
    );
    this.downloadUrl = url;
    console.log(this.downloadUrl);

  }
}
