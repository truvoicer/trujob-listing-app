import PayPalDetails from "../Provider/PayPal/PayPalDetails";
import { PaymentService } from "./PaymentService";

export class PayPalService extends PaymentService {
    
        public showDetails(): null|React.ReactNode {
            return <PayPalDetails />;
        }
}