import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import CurrencyPriceInput from "@/components/blocks/Locale/Currency/CurrencyPriceInput";

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

            // 'valid_from' => $this->valid_from,
            // 'valid_to' => $this->valid_to,
            // 'is_default' => $this->is_default,
            // 'is_active' => $this->is_active,
            // 'created_at' => $this->created_at,
            // 'updated_at' => $this->updated_at,
    return (

        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">


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
                            <CurrencyPriceInput
                            onAmountChange={(value) => {
                                setFieldValue("amount", value);
                            }
                            }
                            onCurrencyChange={(value) => {
                                setFieldValue("currency", value);
                            }}
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