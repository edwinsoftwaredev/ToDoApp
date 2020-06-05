import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './auth.guard';
import { AuthComponent } from './auth.component';


const routes: Routes = [
  {
    path: 'signin',
    component: SignInComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'signup',
    component: SignUpComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
