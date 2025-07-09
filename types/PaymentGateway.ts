export type PaymentGateway = {
    id: number;
    name: string;
    label: string;
    description: string;
    icon: string;
    is_active: boolean;
    is_default: boolean;
    is_integrated?: boolean;
    settings: Record<string, unknown>;
    required_fields?: Array<RequiredField>;
    site?: {
        [key: string]: string | number | boolean | null | undefined | Record<string, unknown>;
        name?: string;
        label?: string;
        is_active?: boolean;
        is_default?: boolean;
        environment?: 'sandbox' | 'production';
        settings: Record<string, unknown>;
    };
    created_at: string;
    updated_at: string;
}

export type RequiredField = {
    name: string;
    label: string;
    type: "string" | "boolean";
}

export type PaymentGatewayRequest = {
    name?: string;
    description?: string;
    label?: string;
    icon?: string;
    is_active?: boolean;
    is_default?: boolean;
    settings?: Record<string, unknown>;
    required_fields?: Array<RequiredField>;
}
export interface CreatePaymentGateway extends PaymentGatewayRequest {
    name: string;
    label: string;
    description: string;
    icon: string;
    is_active: boolean;
    is_default: boolean;
    settings: Record<string, unknown>;
    required_fields?: Array<RequiredField>;
}
export interface UpdatePaymentGateway extends PaymentGatewayRequest {
    id: number;
}