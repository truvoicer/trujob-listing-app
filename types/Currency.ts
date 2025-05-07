import { Country } from "./Country";

export type Currency = {
    id: string;
    country: Country
    name: string;
    name_plural: string;
    code: string;
    symbol: string;
    created_at: string;
    updated_at: string;
}