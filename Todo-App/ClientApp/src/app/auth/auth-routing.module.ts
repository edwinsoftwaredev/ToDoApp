import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment, UrlSegmentGroup, Route } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './auth.guard';
import { AuthComponent } from './auth.component';

/**
 * Something to remember is that if you TYPE a child path directly in the url direction bar of the browser,
 * the parent is going to be reset or you will see whole reload on the browser.
 * When there is a link and is used to route to a child then angular will make the process of routing, which
 * prevent to see a reload in the parent component.
 */

const routes: Routes = [
  {
    matcher: authPathMatcher,
    component: AuthComponent,
    children: [{
        path: 'signin',
        component: SignInComponent
      }, {
        path: 'signup',
        component: SignUpComponent
    }],
    canActivate: [AuthGuard]
  }
];

export function authPathMatcher(url: UrlSegment[], group: UrlSegmentGroup, route: Route) {

  /**
   * Here I am using a empty UrlSegment[] as consumed because nothing in this function will consume the original url segment.
   * So, if the url is http://localhost:4200/signin and using this function as it is, I will keep all
   * the segments of the original urlSegment[] array when the router removes the segments from the
   * "consumed"(check the property of the object) urlSegment[] array wich is empty.
   * Note that if the urlSegment[] is  something like this: http://localhost:4200/signin?passive=true then,
   * using this function matcher as it already is, the parameters in the segment; /signin?passive=true
   * are going to be preserved.
   *
   * go to this link to check for other uses: https://github.com/angular/angular/issues/23866#issuecomment-388527483
   */

  const notConsumedUrl: UrlSegment[] = [];

  return url.toString() === 'signin' || url.toString() === 'signup' ? {consumed: notConsumedUrl} : null;
}

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }