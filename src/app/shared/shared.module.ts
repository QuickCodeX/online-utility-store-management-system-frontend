import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { IconComponent } from './icon.component';
import { MoneyPipe } from './money.pipe';
import { ProductCardComponent } from './product-card.component';
import { StatusBadgeComponent } from './status-badge.component';
import { StepsComponent } from './steps.component';
import { ToastContainerComponent } from './toast-container.component';

const declarations = [
  MoneyPipe, StatusBadgeComponent, ToastContainerComponent, ProductCardComponent, AccountComponent,
  IconComponent, StepsComponent
];

@NgModule({
  declarations,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [...declarations, CommonModule, RouterModule, FormsModule, ReactiveFormsModule]
})
export class SharedModule {}
