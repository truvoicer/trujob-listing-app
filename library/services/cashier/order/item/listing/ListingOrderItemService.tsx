import ListingOrderItem from "@/components/Theme/Admin/Order/Listing/ListingOrderItem";
import { OrderItem } from "@/types/Cashier";
import React from "react";

export class ListingOrderItemService {
    renderOrderItem(item: OrderItem, index: number, props: Record<string, any>): React.Component | React.Component[] | React.ReactNode | React.ReactNode[] | null {
        return <ListingOrderItem item={item} index={index} {...props} />;
    }
}