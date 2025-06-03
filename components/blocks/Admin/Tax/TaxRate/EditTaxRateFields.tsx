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
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";

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
                        <TextInput
                            value={values?.name || ""}
                            onChange={handleChange}
                            placeholder="Enter name"
                            name="name"
                            type="text"
                            label="Name"
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <SelectTaxRateScope value={values?.scope}/>
                    </div>

                    <div className="col-12 col-lg-6">
                        <SelectTaxRateType value={values?.type}/>
                    </div>

                    <div className="col-12 col-lg-6">
                        <SelectTaxRateAmountType value={values?.amount_type}/>
                    </div>

                    {values?.amount_type === "fixed" && (
                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.amount || ""}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                name="amount"
                                type="text"
                                label="Amount"
                            />
                        </div>
                    )}

                    {values?.amount_type === "percentage" && (
                        <div className="col-12 col-lg-6">
                            <TextInput
                                value={values?.rate || ""}
                                onChange={handleChange}
                                placeholder="Enter rate"
                                name="rate"
                                type="text"
                                label="Rate"
                            />
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
                        <Checkbox
                            name={'has_region'}
                            placeholder="Has Region?"
                            label="Has Region?"
                            onChange={handleChange}
                            value={values?.has_region || false}
                        />
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
                        <Checkbox
                            name={'is_active'}
                            placeholder="Is Active?"
                            label="Is Active?"
                            onChange={handleChange}
                            value={values?.is_active || false}
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name={'is_default'}
                            placeholder="Is Default?"
                            label="Is Default?"
                            onChange={handleChange}
                            value={values?.is_default || false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EditTaxRateFields;