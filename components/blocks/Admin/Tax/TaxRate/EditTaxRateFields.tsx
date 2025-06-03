import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectTaxRateType from "./SelectTaxRateType";
import SelectTaxRateAmountType from "./SelectTaxRateAmountType";
import CurrencySelect from "@/components/blocks/Locale/Currency/CurrencySelect";
import SelectTaxRateScope from "./SelectTaxRateScope";
import RegionSelect from "@/components/blocks/Locale/Region/RegionSelect";
import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";

type EditTaxRateFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditTaxRateFields({
    operation
}: EditTaxRateFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                id="name"
                                onChange={handleChange}
                                value={values?.name || ""} />
                            <label className="form-label" htmlFor="name">
                                Name
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <SelectTaxRateScope />
                    </div>

                    <div className="col-12 col-lg-6">
                        <SelectTaxRateType />
                    </div>

                    <div className="col-12 col-lg-6">
                        <SelectTaxRateAmountType />
                    </div>

                    {values?.amount_type === "fixed" && (
                        <div className="col-12 col-lg-6">
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="amount"
                                    id="amount"
                                    onChange={handleChange}
                                    value={values?.amount || ""} />
                                <label className="form-label" htmlFor="amount">
                                    Amount
                                </label>
                            </div>
                        </div>
                    )}

                    {values?.amount_type === "percentage" && (
                        <div className="col-12 col-lg-6">
                            <div className="floating-input form-group">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="rate"
                                    id="rate"
                                    onChange={handleChange}
                                    value={values?.rate || ""} />
                                <label className="form-label" htmlFor="rate">
                                    Rate
                                </label>
                            </div>
                        </div>
                    )}

                    <div className="col-12 col-lg-6">
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
                                console.log('currency', value);
                                setFieldValue('currency', value);
                            }}
                            loadingMore={true}
                            loadMoreLimit={10}
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <label className="title">Select Country</label>
                        <CountrySelect
                            value={values?.country ?
                                {
                                    value: values?.country?.id,
                                    label: values?.country?.name,
                                } : null}
                            isMulti={false}
                            showLoadingSpinner={true}
                            onChange={(value) => {
                                console.log('country', value);
                                setFieldValue('country', value);
                            }}
                            loadingMore={true}
                            loadMoreLimit={10}
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                className="custom-control-input"
                                type="checkbox"
                                name="has_region"
                                id="has_region"
                                onChange={handleChange}
                                checked={values?.has_region || false} />
                            <label className="custom-control-label" htmlFor="has_region">
                                Is Region Required?
                            </label>
                        </div>
                    </div>
                    {values?.has_region &&
                        <div className="col-12 col-lg-6">
                            <label className="title">Select Currency</label>
                            <RegionSelect
                                value={values?.region ?
                                    {
                                        value: values?.region?.id,
                                        label: values?.region?.name,
                                    } : null}
                                isMulti={false}
                                showLoadingSpinner={true}
                                onChange={(value) => {
                                    console.log('region', value);
                                    setFieldValue('region', value);
                                }}
                                loadingMore={true}
                                loadMoreLimit={10}
                            />
                        </div>
                    }

                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                className="custom-control-input"
                                type="checkbox"
                                name="is_active"
                                id="is_active"
                                onChange={handleChange}
                                checked={values?.is_active || false} />
                            <label className="custom-control-label" htmlFor="is_active">
                                Is Active?
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                className="custom-control-input"
                                type="checkbox"
                                name="is_default"
                                id="is_default"
                                onChange={handleChange}
                                checked={values?.is_default || false} />
                            <label className="custom-control-label" htmlFor="is_default">
                                Is Default?
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EditTaxRateFields;