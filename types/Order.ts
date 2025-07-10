import { Address } from "@/components/blocks/Admin/User/Address/ManageAddress";
import { Product } from "./Product";
import { PaymentGateway } from "./PaymentGateway";
import { Price } from "./Price";
import { User } from "./User";
import { Discount } from "./Discount";
import { TaxRate } from "./Tax";

export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded"
  | "failed";

export type Order = {
  id: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  items: OrderItem[];
  total_price: number;
  total_quantity: number;
  total_tax: number;
  total_discount: number;
  final_total: number;
  total_items: number;
  average_price_per_item: number;
  total_price_after_discounts: number;
  total_price_after_tax: number;
  total_price_after_tax_and_discounts: number;
  default_discounts: Discount[];
  default_tax_rates: TaxRate[];
  billing_address: Address;
  shipping_address: Address;
  created_at: string;
  updated_at: string;
};

export type OrderRequest = {
  items?: OrderItem[];
  billing_address_id?: number;
  shipping_address_id?: number;
  status?: OrderStatus;
};
export interface StoreOrderRequest extends OrderRequest {
  items: OrderItem[];
}
export type UpdateOrderRequest = OrderRequest;

export interface OrderSummary extends Order {
  total_shipping_cost: number;
  total_price_with_shipping: number;
}

export type OrderItem = {
  id: number;
  order_itemable_id: number;
  order_itemable_type: "product";
  entity: Product;
  default_discounts: Discount[];
  default_tax_rates: TaxRate[];
  discounts: Discount[];
  tax_rates: TaxRate[];
  total_price: number;
  quantity: number;
  tax_without_price: number;
  total_price_with_tax: number;
  discount: number;
  total_tax: number;
  total_price_after_discount: number;
  total_price_after_tax_and_discount: number;
};

export type Transaction = {
  id: number;
  user: User;
  price: Price;
  payment_gateway: PaymentGateway;
  billing_address: Address;
  shipping_address: Address;
  created_at: string;
  updated_at: string;
};
