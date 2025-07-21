import PayPalConfirmation from "../Provider/PayPal/PayPalConfirmation";
import PayPalDetails from "../Provider/PayPal/PayPalDetails";
import { PaymentServiceInterface } from "./PaymentService";

export type PayPalPaymentRequestType = "order" | "capture" | "approve" | "cancel";
export type PayPalPaymentDetailsProps = {
    showNext?: () => void;
    showPrevious?: () => void;
    goToNext?: () => void;
};
export class PayPalService implements PaymentServiceInterface {
    public showDetails(props: PayPalPaymentDetailsProps): null|React.ReactNode {
        return <PayPalDetails {...props} />;
    }

    public renderConfirmation(): null|React.ReactNode {
        return <PayPalConfirmation />;
    }

}