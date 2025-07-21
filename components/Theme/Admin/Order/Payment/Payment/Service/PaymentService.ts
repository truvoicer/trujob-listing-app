import React from "react";
import { PayPalPaymentDetailsProps } from "./PayPalService";
import { StripePaymentDetailsProps, StripePaymentRequestType } from "./StripeService";

export type PaymentRequestType = "order" | "capture";

export type PaymentProps = {
  onSuccess?: (
    paymentRequestType: StripePaymentRequestType | PaymentRequestType,
    data: Record<string, unknown>
  ) => void;
  onError?: (
    paymentRequestType: StripePaymentRequestType | PaymentRequestType,
    error: Error,
    data?: Record<string, unknown> | null
  ) => void;
  onCancel?: (
    paymentRequestType: StripePaymentRequestType | PaymentRequestType,
    data: Record<string, unknown>
  ) => void;
};
export interface PaymentServiceInterface {
  showDetails(
    props: StripePaymentDetailsProps | PayPalPaymentDetailsProps
  ): null | React.ReactNode;
  renderConfirmation(): null | React.ReactNode;
}
