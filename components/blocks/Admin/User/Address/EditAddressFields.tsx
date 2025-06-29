import { FormikValues, useFormikContext } from "formik";
import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import { LocaleService } from "@/library/services/locale/LocaleService";

type EditAddressFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditAddressFields({
    operation
}: EditAddressFields) {
    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};
    
    return (
        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name={'is_default'}
                            placeholder="Is Default?"
                            label="Is Default?"
                            onChange={handleChange}
                            value={values?.is_default || false}
                        />
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
                        <TextInput
                            value={values?.label || ""}
                            onChange={handleChange}
                            placeholder="Enter label"
                            name="label"
                            type="text"
                            label="Label"
                        />
                    </div>

                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.address_line_1 || ""}
                            onChange={handleChange}
                            placeholder="Enter address_line_1"
                            name="address_line_1"
                            type="text"
                            label="Address Line 1"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.address_line_2 || ""}
                            onChange={handleChange}
                            placeholder="Enter address_line_2"
                            name="address_line_2"
                            type="text"
                            label="Address Line 2"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.city || ""}
                            onChange={handleChange}
                            placeholder="Enter city"
                            name="city"
                            type="text"
                            label="City"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.state || ""}
                            onChange={handleChange}
                            placeholder="Enter state"
                            name="state"
                            type="text"
                            label="State"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.postal_code || ""}
                            onChange={handleChange}
                            placeholder="Enter postal_code"
                            name="postal_code"
                            type="text"
                            label="Postal code"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.phone || ""}
                            onChange={handleChange}
                            placeholder="Enter phone"
                            name="phone"
                            type="text"
                            label="Phone"
                        />
                    </div>

                    <div className="col-12 col-lg-6 mt-2">
                        <div className="floating-input">
                            <label className="fw-bold" htmlFor="country">
                                Country
                            </label>
                            <CountrySelect
                                value={LocaleService.getValueForCountrySelect(values?.country)}
                                isMulti={false}
                                showLoadingSpinner={true}
                                onChange={(value) => {
                                    console.log('Selected country:', value);
                                    setFieldValue("country", value);
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
export default EditAddressFields;