import React from "react";

export class PaymentService {

    public showDetails(): null|React.ReactNode {
        return null;
    }

    public static getInstance(): PaymentService {
        return new PaymentService();
    }
}