import { OrderItem } from "@/types/Order";

export class ProductableOrderService {
    renderOrderSummaryRow(
        _item: OrderItem, 
        _index: number, 
        _props: Record<string, unknown>
    ): React.Component | React.Component[] | React.ReactNode | React.ReactNode[] | null {
        return null; // This should be overridden by subclasses
    }
    renderOrderShippingSummaryRow(
        _item: OrderItem, 
        _index: number, 
        _props: Record<string, unknown>
    ): React.Component | React.Component[] | React.ReactNode | React.ReactNode[] | null {
        return null; // This should be overridden by subclasses
    }


    renderSubscriptionOrderSummaryRow(
        item: OrderItem, 
        index: number, 
        props: Record<string, unknown>
    ): React.Component | React.Component[] | React.ReactNode | React.ReactNode[] | null {
        return null;
    }
}