import { Country } from "./Country";
import { Currency } from "./Currency";
import { Language } from "./Language";

export type User = {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export type UserProfile = {
    id: number;
    country: Country | null;
    currency: Currency | null;
    language: Language | null;
    phone: string | null;
    dob: string | null;
}