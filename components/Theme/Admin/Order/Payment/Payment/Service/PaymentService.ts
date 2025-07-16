import React from "react";

export type PaymentRequestType = "order" | "capture";
export type PaymentDetailsProps = {
    onSuccess?: (paymentRequestType: PaymentRequestType, data: Record<string, unknown>) => void;
    onError?: (
      paymentRequestType: PaymentRequestType,
      error: Error,
      data?: Record<string, unknown> | null
    ) => void;
    onCancel?: (paymentRequestType: PaymentRequestType, data: Record<string, unknown>) => void;
};

export class PaymentService {

    public showDetails(props: PaymentDetailsProps): null|React.ReactNode {
        return null;
    }
    public renderConfirmation(): null|React.ReactNode {
        return null;
    }

}