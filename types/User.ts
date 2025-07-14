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

export type UserRequest = {
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
}
export type UpdateUserRequest = UserRequest;
export type CreateUserRequest = UserRequest;

export type UserProfile = {
    id: number;
    phone: string | null;
    dob: string | null;
}
export type UserProfileRequest = {
    phone?: string | null;
    dob?: string | null;
}
export type UpdateUserProfileRequest = UserProfileRequest;
export type CreateUserProfileRequest = UserProfileRequest;

export type UserSetting = {
    id: number;
    country: Country | null;
    currency: Currency | null;
    language: Language | null;
    timezone: string | null;
    app_theme: 'light' | 'dark' | null;
    push_notifications: boolean;
}

export type UserSettingRequest = {
    country_id?: number | null;
    currency_id?: number | null;
    language_id?: number | null;
    timezone?: string | null;
    app_theme?: 'light' | 'dark';
    push_notifications?: boolean;
}

export type CreateUserSettingRequest = UserSettingRequest;
export type UpdateUserSettingRequest = UserSettingRequest;