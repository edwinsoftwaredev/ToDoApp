import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LandingComponent } from './landing/landing.component';
import {LandingGuard} from './landing/landing.guard';

/**
 * Something to remember is that if you TYPE a child path directly in the url direction bar of the browser,
 * the parent is going to be reset or you will see whole reload on the browser.
 * When there is a link and is used to route to a child then angular will make the process of routing, which
 * prevent to see a reload in the parent component.
 */

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full',
    canActivate: [LandingGuard]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
