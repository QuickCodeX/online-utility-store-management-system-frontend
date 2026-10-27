export type Role = 'Admin' | 'Staff' | 'Customer';

export interface Session {
  token: string;
  userId: number;
  fullName: string;
  role: Role;
}

export interface LoginResponse extends Session {
  message: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  categoryId: number | null;   // optional: a product may have no category
  category: string | null;
  quantity: number;          // stock available
  isActive?: boolean;        // only returned to the management panel
}

export interface ProductSave {
  name: string;
  description: string;
  price: number;
  categoryId: number | null;
  imageUrl: string | null;
  isActive: boolean;
  initialStock: number;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  productCount: number;
  isActive?: boolean;        // only returned to the management panel
}

export interface CategorySave {
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface InventoryRow {
  inventoryId: number;
  productId: number;
  productName: string;
  category: string | null;
  isArchived: boolean;
  quantityStock: number;
  isLowStock: boolean;
}

export interface CartLine {
  productId: number;
  name: string;
  price: number;             // display only: the server recalculates at checkout
  imageUrl: string | null;
  quantity: number;
  maxStock: number;
}

export interface CheckoutRequest {
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  notes: string | null;
  items: { productId: number; quantity: number }[];
}

export interface OrderPlaced {
  orderId: number;
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
}

export interface OrderSummary {
  id: number;
  orderNumber: string;
  orderDate: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  itemCount?: number;        // customer list
  customerName?: string;     // staff list
  hasBill?: boolean;         // staff list
}

export interface OrderLine {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderDetail {
  id: number;
  orderNumber: string;
  orderDate: string;
  updatedAt: string | null;
  status: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  deliveryName: string;
  deliveryPhone: string;
  deliveryAddress: string;
  notes: string | null;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  total: number;
  billId: number | null;
  items: OrderLine[];
}

export interface BillSummary {
  id: number;
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  billDate: string;
  staffName: string;
  customerName: string;
}

export interface BillDetail {
  id: number;
  orderId: number;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  billDate: string;
  staffName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  items: { productName: string; quantity: number; unitPrice: number; lineTotal: number }[];
}

export interface DashboardData {
  totalOrders: number;
  pendingOrders: number;
  revenue: number | null;    // null for Staff
  activeProducts: number;
  lowStockProducts: number;
  customers: number;
  recentOrders: {
    id: number;
    orderNumber: string;
    customerName: string;
    orderDate: string;
    total: number;
    status: string;
  }[];
}

export interface SalesReport {
  from: string;
  to: string;
  totalSales: number;
  completedOrders: number;
  salesByDay: { date: string; orders: number; total: number }[];
  topProducts: { productName: string; quantitySold: number; revenue: number }[];
}

export interface UserRow {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  address: string | null;
  createdAt: string;
}

// Mirrors the rules enforced by the API (OrdersController.Transitions)
export const NEXT_STATUSES: Record<string, string[]> = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Processing', 'Cancelled'],
  Processing: ['Completed', 'Cancelled']
};

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Completed', 'Cancelled'];

export interface AuditEntry {
  id: number;
  createdAt: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string | null;
}

export interface AuditPage {
  total: number;
  page: number;
  pageSize: number;
  items: AuditEntry[];
}
