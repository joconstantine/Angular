import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AuthService, AuthResponseData } from "./auth.service";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder/placeholder.directive";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    isLoginMode = true;
    isLoading = false;
    @ViewChild(PlaceHolderDirective, {static: false}) alertHost: PlaceHolderDirective;
    //error: string = null;
    private closeSub: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnDestroy() {
        //this.closeSub.unsubscribe();
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }

        const email = form.value['email'];
        const password = form.value['password'];

        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;
        if (this.isLoginMode) {
            // authObs = this.authService.login(email, password);
            this.store.dispatch(
                new AuthActions.LoginStart({
                    email: email,
                    password: password,
            }));
        } else {
            authObs = this.authService.signup(email, password);
        }

        authObs.subscribe(
            resData => {
                console.log(resData);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            errorMessage => {
                console.log(errorMessage);
                //this.error = errorMessage;
                this.showErrorAlert(errorMessage);
                this.isLoading = false;
            }
        );
    }

    // onHandleError() {
    //     this.error = null;
    // }

    private showErrorAlert(errorMessage: string) {
        // const alertCmp = new AlertComponent(); // This won't work
        const alertCompFactory = 
            this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();//clear all added before
        
        const componentRef = hostViewContainerRef.createComponent(alertCompFactory);
        componentRef.instance.message = errorMessage;
        this.closeSub = componentRef.instance.close.subscribe(
            () => {
                this.closeSub.unsubscribe();
                hostViewContainerRef.clear();//remove the alert box
            }
        );

    }
}