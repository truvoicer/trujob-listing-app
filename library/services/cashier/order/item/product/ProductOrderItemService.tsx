import ProductOrderItem from "@/components/Theme/Admin/Order/Product/ProductOrderItem";
import { OrderItem } from "@/types/Cashier";
import React from "react";

export class ProductOrderItemService {
    renderOrderItem(item: OrderItem, index: number, props: Record<string, any>): React.Component | React.Component[] | React.ReactNode | React.ReactNode[] | null {
        return <ProductOrderItem item={item} index={index} {...props} />;
    }
}