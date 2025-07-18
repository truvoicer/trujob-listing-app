import ProductOrderItem from "@/components/Theme/Admin/Order/Product/ProductOrderItem";
import { OrderItem } from "@/types/Order";
import React from "react";
import { ProductableOrderService } from "./ProductableOrderService";
import ProductOrderSummaryItem from "@/components/Theme/Admin/Order/Product/ProductOrderSummaryItem";
import ProductSubscriptionOrderSummaryItem from "@/components/Theme/Admin/Order/Product/ProductSubscriptionOrderSummaryItem";

export class ProductOrderItemService extends ProductableOrderService {
    renderOrderSummaryRow(
        item: OrderItem, 
        index: number, 
        props: Record<string, unknown>
    ): React.Component | React.Component[] | React.ReactNode | React.ReactNode[] | null {
        return <ProductOrderItem item={item} index={index} {...props} />;
    }

    renderOrderShippingSummaryRow(
        item: OrderItem, 
        index: number, 
        props: Record<string, unknown>
    ): React.Component | React.Component[] | React.ReactNode | React.ReactNode[] | null {
        return <ProductOrderSummaryItem item={item} index={index} {...props} />;
    }

    renderSubscriptionOrderSummaryRow(
        item: OrderItem, 
        index: number, 
        props: Record<string, unknown>
    ): React.Component | React.Component[] | React.ReactNode | React.ReactNode[] | null {
        return <ProductSubscriptionOrderSummaryItem item={item} index={index} {...props} />;
    }

    static getInstance(): ProductOrderItemService {
        return new ProductOrderItemService();
    }
}