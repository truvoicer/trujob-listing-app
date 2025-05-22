export type PaymentGateway = {
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

export type PaymentGatewayRequest = {
    name?: string;
    description?: string;
    icon?: string;
    is_active?: boolean;
    is_default?: boolean;
    settings?: Record<string, any>;
}
export interface CreatePaymentGateway extends PaymentGatewayRequest {
    name: string;
    description: string;
    icon: string;
    is_active: boolean;
    is_default: boolean;
    settings: Record<string, any>;
}
export interface UpdatePaymentGateway extends PaymentGatewayRequest {
    id: number;
}