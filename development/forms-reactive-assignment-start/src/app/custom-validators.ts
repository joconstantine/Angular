import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

export class CustomValidators {
    static forbiddenName = "test";

    static forbiddenProjectNameAsync (control: FormControl): Promise<any> | Observable<any> {
        const promise = new Promise<any>(
          (resolve, reject) => {
            setTimeout(() => {
              if (control.value && (control.value).toLowerCase() === this.forbiddenName) {
                resolve({'forbiddenProjectName': true});
              } else {
               resolve(null);
              }
            }, 1000);
          }
        );
        return promise;
      }
}