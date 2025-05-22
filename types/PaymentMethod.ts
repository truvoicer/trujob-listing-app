export type PaymentMethod = {
    id: number;
    name: string;
    description: string;
    icon: string;
    is_active: boolean;
    is_default: boolean;
    settings: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export type PaymentMethodRequest = {
    name?: string;
    description?: string;
    icon?: string;
    is_active?: boolean;
    is_default?: boolean;
    settings?: Record<string, any>;
}
export interface CreatePaymentMethod extends PaymentMethodRequest {
    name: string;
    description: string;
    icon: string;
    is_active: boolean;
    is_default: boolean;
    settings: Record<string, any>;
}
export interface UpdatePaymentMethod extends PaymentMethodRequest {
    id: number;
}