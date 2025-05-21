import { useContext, useEffect, useState } from "react";
import CountrySelect from "../../Locale/Country/CountrySelect";
import { connect } from "react-redux";
import { SETTINGS_STATE } from "@/library/redux/constants/settings-constants";
import { SITE_STATE } from "@/library/redux/constants/site-constants";
import { Country } from "@/types/Country";
import CurrencySelect from "../../Locale/Currency/CurrencySelect";
import { Currency } from "@/types/Currency";
import Form from "@/components/form/Form";
import { FormikProps, FormikValues } from "formik";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { UrlHelpers } from "@/helpers/UrlHelpers";

export const SITE_SETTINGS_SUCCESS_NOTIFICATION = 'SITE_SETTINGS_SUCCESS_NOTIFICATION';
export const SITE_SETTINGS_ERROR_NOTIFICATION = 'SITE_SETTINGS_ERROR_NOTIFICATION';

export type ManageSiteSettingsProps = {
    settings: any;
    site: any;
}
function ManageSiteSettings({
    settings,
    site,
}: ManageSiteSettingsProps) {

    const notificationContext = useContext(AppNotificationContext);
    async function siteSettingsRequest() {

    }

    async function submitHandler(values: FormikValues) {
        console.log('values', values);
        const requestData = { ...values };

        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: UrlHelpers.urlFromArray([
                truJobApiConfig.endpoints.site,
                site?.id,
                'settings',
                'update'
            ]),
            method: TruJobApiMiddleware.METHOD.PATCH,
            protectedReq: true,
            data: requestData,
        });
        if (response) {
            notificationContext.show({
                variant: 'success',
                component: 'Settings updated successfully',
            }, SITE_SETTINGS_SUCCESS_NOTIFICATION);
        } else {
            notificationContext.show({
                variant: 'error',
                component: 'Failed to update settings',
            }, SITE_SETTINGS_ERROR_NOTIFICATION);
        }
    }
    useEffect(() => {
        siteSettingsRequest();
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12 mb-4">
                    <div className="py-4 border-bottom">
                        <div className="float-left"><a href="index.html?activeTab=view-workflow" className="badge bg-white back-arrow"><i className="las la-angle-left"></i></a></div>
                        <div className="form-title text-center">
                            <h3>Edit Settings</h3>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="card card-block card-stretch">
                        <div className="card-body">
                            <Form
                                operation="edit"
                                initialValues={{
                                    country_id: site?.settings?.country?.id,
                                    currency_id: site?.settings?.currency?.id,
                                }}
                                onSubmit={submitHandler}
                            >
                                {({ handleChange, handleSubmit, setFieldValue, values }: FormikProps<FormikValues>) => {
                                    console.log('values', values);
                                    return (
                                        <div className="d-flex flex-wrap align-items-ceter">
                                            <div className="col-lg-6 mb-4">
                                                <label
                                                    className="title">
                                                    Select Country
                                                </label>
                                                <CountrySelect
                                                    value={site?.settings?.country ? 
                                                        {
                                                        value: site?.settings?.country?.id,
                                                        label: site?.settings?.country?.name,
                                                    } : null}
                                                    isMulti={false}
                                                    showLoadingSpinner={true}
                                                    onChange={(value) => {
                                                        console.log('country value', value);
                                                        let selectedCountry;
                                                        if (Array.isArray(value) && value.length > 0) {
                                                            selectedCountry = value[0];
                                                        }
                                                        if (selectedCountry) {
                                                            setFieldValue('country_id', selectedCountry?.id);
                                                        }
                                                    }}
                                                    loadingMore={true}
                                                    loadMoreLimit={10}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <label className="title">Select Currency</label>
                                                <CurrencySelect
                                                    value={site?.settings?.currency ? 
                                                        {
                                                        value: site?.settings?.currency?.id,
                                                        label: site?.settings?.currency?.name,
                                                    } : null}
                                                    isMulti={false}
                                                    showLoadingSpinner={true}
                                                    onChange={(value) => {
                                                        console.log('currency value', value);
                                                        let selectedCurrency;
                                                        if (Array.isArray(value) && value.length > 0) {
                                                            selectedCurrency = value[0];
                                                        }
                                                        if (selectedCurrency) {
                                                            setFieldValue('currency_id', selectedCurrency?.id);
                                                        }
                                                    }}
                                                    loadingMore={true}
                                                    loadMoreLimit={10}
                                                />
                                            </div>
                                            <div className="col-lg-12 mt-4">
                                                <div className="d-flex flex-wrap align-items-ceter justify-content-center">
                                                    <div className="btn btn-primary mr-4">Cancel</div>
                                                    <button className="btn btn-outline-primary" type="submit">Save</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default connect(
    (state: any) => ({
        settings: state[SETTINGS_STATE],
        site: state[SITE_STATE],
    }),
)(ManageSiteSettings);