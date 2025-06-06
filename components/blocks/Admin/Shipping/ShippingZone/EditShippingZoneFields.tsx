import { useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import { Country } from "@/types/Country";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";

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
                        <TextInput
                            value={values?.description || ""}
                            onChange={handleChange}
                            placeholder="Enter description"
                            name="description"
                            type="text"
                            label="Description"
                        />
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
                                    setFieldValue("countries", value);
                                }}
                                loadingMore={true}
                                loadMoreLimit={10}
                            />
                        </div>
                    </div>
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
                            name={'all'}
                            placeholder="All Countries?"
                            label="All Countries?"
                            onChange={handleChange}
                            value={values?.all || false}
                        />
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
export default EditShippingZoneFields;