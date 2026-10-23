import { Component, Input } from '@angular/core';

// "Cart > Delivery > Done" progress indicator shown on the cart, checkout and confirmation pages
@Component({
  selector: 'app-steps',
  template: `
    <ol class="steps" aria-label="Checkout progress">
      <li *ngFor="let s of labels; let i = index" [class.done]="i + 1 < current" [class.now]="i + 1 === current"
          [attr.aria-current]="i + 1 === current ? 'step' : null">
        <span class="n">{{ i + 1 < current ? '✓' : i + 1 }}</span><span class="t">{{ s }}</span>
      </li>
    </ol>`,
  styles: [`
    .steps { display: flex; gap: var(--s-2); list-style: none; margin: 0 0 var(--s-8); padding: 0; flex-wrap: wrap; }
    li { display: flex; align-items: center; gap: var(--s-2); color: var(--muted); font-size: var(--fs-sm); font-weight: 500; }
    li + li::before { content: ''; width: 28px; height: 1px; background: #c9d3cc; margin-right: var(--s-2); }
    .n { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; border: 1px solid #c9d3cc; background: var(--white); font-size: var(--fs-xs); font-weight: 700; }
    .now { color: var(--ink); font-weight: 600; }
    .now .n { background: var(--leaf); border-color: var(--leaf); color: #fff; }
    .done .n { background: var(--leaf-tint); border-color: var(--leaf); color: var(--leaf-dark); }
    @media (max-width: 479px) { li + li::before { width: 14px; margin-right: 0; } li:not(.now) .t { display: none; } }
  `]
})
export class StepsComponent {
  @Input() current = 1;
  readonly labels = ['Cart', 'Delivery & payment', 'Done'];
}
