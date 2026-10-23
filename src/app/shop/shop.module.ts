import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { customerGuard } from '../core/guards';
import { SharedModule } from '../shared/shared.module';
import { AccountComponent } from '../shared/account.component';
import { CartComponent } from './cart.component';
import { CheckoutComponent } from './checkout.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { MyOrdersComponent } from './my-orders.component';
import { OrderConfirmationComponent } from './order-confirmation.component';
import { OrderViewComponent } from './order-view.component';
import { ProductDetailComponent } from './product-detail.component';
import { RegisterComponent } from './register.component';
import { ShopLayoutComponent } from './shop-layout.component';
import { ShopComponent } from './shop.component';
import { AboutComponent, ContactComponent, NotFoundComponent } from './static-pages';

const routes: Routes = [
  // Full-page customer sign-in / sign-up: outside the store layout, so they show only the form
  { path: 'account/login', component: LoginComponent, title: 'Log in · UtilityStore' },
  { path: 'account/register', component: RegisterComponent, title: 'Sign up · UtilityStore' },
  { path: 'login', redirectTo: 'account/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'account/register', pathMatch: 'full' },
  {
    path: '',
    component: ShopLayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'UtilityStore' },
      { path: 'shop', component: ShopComponent, title: 'Shop · UtilityStore' },
      { path: 'product/:id', component: ProductDetailComponent, title: 'Product · UtilityStore' },
      { path: 'cart', component: CartComponent, title: 'Cart · UtilityStore' },
      { path: 'checkout', component: CheckoutComponent, canActivate: [customerGuard], title: 'Checkout · UtilityStore' },
      { path: 'order-confirmation/:id', component: OrderConfirmationComponent, canActivate: [customerGuard] },
      { path: 'orders', component: MyOrdersComponent, canActivate: [customerGuard], title: 'My orders · UtilityStore' },
      { path: 'orders/:id', component: OrderViewComponent, canActivate: [customerGuard], title: 'Order · UtilityStore' },
      { path: 'account', component: AccountComponent, canActivate: [customerGuard], title: 'My account · UtilityStore' },
      { path: 'about', component: AboutComponent, title: 'About · UtilityStore' },
      { path: 'contact', component: ContactComponent, title: 'Contact · UtilityStore' },
      { path: '**', component: NotFoundComponent, title: 'Not found · UtilityStore' }
    ]
  }
];

@NgModule({
  declarations: [
    ShopLayoutComponent, HomeComponent, ShopComponent, ProductDetailComponent, CartComponent, CheckoutComponent,
    OrderConfirmationComponent, MyOrdersComponent, OrderViewComponent, LoginComponent, RegisterComponent,
    AboutComponent, ContactComponent, NotFoundComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class ShopModule {}
