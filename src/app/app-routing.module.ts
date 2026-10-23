import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Admin dashboard (Admin and Staff only). /admin/login is its own sign-in page;
  // everything else inside is protected by adminGuard in the module. The API enforces the same rules.
  {
    path: 'admin',
    loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule)
  },
  // Customer website (everything else)
  {
    path: '',
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
