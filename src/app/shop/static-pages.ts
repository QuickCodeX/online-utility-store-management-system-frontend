import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="container store-page narrow">
      <h1>About UtilityStore</h1>
      <p class="lead">UtilityStore is a neighbourhood utility shop that now takes orders online.</p>
      <p>We stock everyday groceries, household cleaning products and small electronics. You browse the catalogue, add what you need to a cart,
        and place an order with your delivery address. You pay in cash when the order arrives, so there is no card to enter.</p>
      <p>Behind the shop window, our staff confirm and process each order, and the stock you see is the stock on our shelves.
        You can follow every order's status from your account.</p>
      <p><a routerLink="/shop" class="btn">Browse the shop</a></p>
    </div>`,
  styles: ['.narrow{max-width:760px;margin-inline:auto 0}.lead{font-size:var(--fs-xl);color:var(--pine);font-weight:500}']
})
export class AboutComponent {}

@Component({
  selector: 'app-contact',
  template: `
    <div class="container store-page">
      <h1>Contact us</h1>
      <p class="muted">Questions about an order? Have your order number ready when you get in touch.</p>
      <div class="grid">
        <div class="card card-pad"><span class="ico"><app-icon name="pin"></app-icon></span><h3>Visit</h3><p>Main Market<br>Lahore, Pakistan</p></div>
        <div class="card card-pad"><span class="ico"><app-icon name="phone"></app-icon></span><h3>Call</h3><p>0300 000 0000<br>Daily, 9am to 9pm</p></div>
        <div class="card card-pad"><span class="ico"><app-icon name="mail"></app-icon></span><h3>Email</h3><p>hello&#64;utilitystore.example</p></div>
      </div>
    </div>`,
  styles: ['.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--s-4);margin-top:var(--s-6)}.ico{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:12px;background:var(--leaf-tint);color:var(--leaf-dark);margin-bottom:var(--s-4)}p{margin:0;color:var(--muted)}']
})
export class ContactComponent {}

@Component({
  selector: 'app-not-found',
  template: `
    <div class="container store-page nf">
      <h1>Page not found</h1>
      <p class="muted">That address does not exist. Check the link, or go back to the shop.</p>
      <a routerLink="/" class="btn">Go home</a>
    </div>`,
  styles: ['.nf{padding-block:var(--s-16);text-align:center}']
})
export class NotFoundComponent {}
