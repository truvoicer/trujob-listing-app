import { useContext, useEffect, useState } from "react";
import CountrySelect from "../../Locale/Country/CountrySelect";
import { connect } from "react-redux";
import { SETTINGS_STATE } from "@/library/redux/constants/settings-constants";
import { SITE_STATE } from "@/library/redux/constants/site-constants";
import CurrencySelect from "../../Locale/Currency/CurrencySelect";
import Form from "@/components/form/Form";
import { FormikProps, FormikValues } from "formik";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import { refreshSiteAction } from "@/library/redux/actions/site-actions";

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
        let requestData = { ...values };

        if (values?.country) {
            requestData.country_id = values?.country?.id;
            delete requestData.country;
        }
        if (values?.currency) {
            requestData.currency_id = values?.currency?.id;
            delete requestData.currency;
        }

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
            refreshSiteAction();
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
                                    country: site?.settings?.country,
                                    currency: site?.settings?.currency,
                                }}
                                onSubmit={submitHandler}
                            >
                                {({ handleChange, handleSubmit, setFieldValue, values }: FormikProps<FormikValues>) => {
                                    return (
                                        <div className="d-flex flex-wrap align-items-ceter">
                                            <div className="col-lg-6 mb-4">
                                                <label
                                                    className="title">
                                                    Select Country
                                                </label>
                                                <CountrySelect
                                                    value={values?.country ?
                                                        {
                                                            value: values?.country?.id,
                                                            label: values?.country?.name,
                                                        } : null}
                                                    isMulti={false}
                                                    showLoadingSpinner={true}
                                                    onChange={(value) => {
                                                        setFieldValue('country', value);
                                                    }}
                                                    loadingMore={true}
                                                    loadMoreLimit={10}
                                                />
                                            </div>
                                            <div className="col-lg-6 mb-4">
                                                <label className="title">Select Currency</label>
                                                <CurrencySelect
                                                    value={values?.currency ?
                                                        {
                                                            value: values?.currency?.id,
                                                            label: values?.currency?.name,
                                                        } : null}
                                                    isMulti={false}
                                                    showLoadingSpinner={true}
                                                    onChange={(value) => {
                                                        setFieldValue('currency', value);
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