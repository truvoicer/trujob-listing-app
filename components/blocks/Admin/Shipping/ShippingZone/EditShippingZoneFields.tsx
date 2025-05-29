import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import { Country } from "@/types/Country";

type EditShippingZoneFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditShippingZoneFields({
    operation
}: EditShippingZoneFields) {
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
                        <div className="floating-input">
                            <label className="fw-bold" htmlFor="country">
                                Countries
                            </label>
                            <CountrySelect
                                value={
                                    (Array.isArray(values?.countries) && values?.countries.length > 0)
                                        ? values?.countries.map((country: Country) => ({
                                            value: country.id,
                                            label: country.name,
                                        }))
                                        : []
                                }
                                isMulti={true}
                                showLoadingSpinner={true}
                                onChange={(value) => {
                                    console.log("Selected countries:", value);
                                    setFieldValue("countries", value);
                                }}
                                loadingMore={true}
                                loadMoreLimit={10}
                            />
                        </div>
                    </div>
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
                                Is Active
                            </label>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
export default EditShippingZoneFields;