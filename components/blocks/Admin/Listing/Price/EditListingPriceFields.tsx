import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectPrice from "./SelectPrice";
import ManagePrice from "../../Price/ManagePrice";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import CurrencySelect from "@/components/blocks/Locale/Currency/CurrencySelect";
import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";

type EditListingPriceFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditListingPriceFields({
    operation
}: EditListingPriceFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, handleChange, setFieldValue } = useFormikContext<FormikValues>() || {};

    return (

        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

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
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="type"
                                id="type"
                                onChange={handleChange}
                                value={values?.type || ""} />
                            <label className="form-label" htmlFor="type">
                                Type
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <CurrencySelect
                                isMulti={false}
                                showLoadingSpinner={true}
                                onChange={(value) => {
                                    //set field value to first item in array    
                                    if (Array.isArray(value) && value.length > 0) {
                                        setFieldValue("currency", value);
                                    }
                                }}
                                loadingMore={true}
                                loadMoreLimit={10}
                            />
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <CountrySelect
                                isMulti={false}
                                showLoadingSpinner={true}
                                onChange={(value) => {
                                    //set field value to first item in array
                                    if (Array.isArray(value) && value.length > 0) {
                                        setFieldValue("country", value);
                                    }
                                }}
                                loadingMore={true}
                                loadMoreLimit={10}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
export default EditListingPriceFields;