import PayPalConfirmation from "../Provider/PayPal/PayPalConfirmation";
import PayPalDetails from "../Provider/PayPal/PayPalDetails";
import { PaymentDetailsProps, PaymentService } from "./PaymentService";

export class PayPalService extends PaymentService {
    public showDetails(props: PaymentDetailsProps): null|React.ReactNode {
        return <PayPalDetails {...props} />;
    }

    public renderConfirmation(): null|React.ReactNode {
        return <PayPalConfirmation />;
    }

}