import { Country } from "./Country";
import { Currency } from "./Currency";
import { User } from "./User";

export type Price = {
    id: string;
    created_by_user: User;
    country: Country;
    currency: Currency;
    type: string;
    amount: number;

}