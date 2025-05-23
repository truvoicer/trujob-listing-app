import { FormikValues, useFormikContext } from "formik";
import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";

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
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                onChange={handleChange}
                                type="checkbox"
                                className="custom-control-input"
                                id="is_default"
                                name="is_default"
                                checked={values?.is_default || false} />
                            <label className="custom-control-label" htmlFor="is_default">
                                Is Default
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="custom-control custom-checkbox mb-3 text-left">
                            <input
                                onChange={handleChange}
                                type="checkbox"
                                className="custom-control-input"
                                id="is_active"
                                name="is_active"
                                checked={values?.is_active || false} />
                            <label className="custom-control-label" htmlFor="is_active">
                                Is Active
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="label"
                                id="label"
                                onChange={handleChange}
                                value={values?.label || ""} />
                            <label className="form-label" htmlFor="label">
                                Label
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="address_line_1"
                                id="address_line_1"
                                onChange={handleChange}
                                value={values?.address_line_1 || ""} />
                            <label className="form-label" htmlFor="address_line_1">
                                Address Line 1
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="address_line_2"
                                id="address_line_2"
                                onChange={handleChange}
                                value={values?.address_line_2 || ""} />
                            <label className="form-label" htmlFor="address_line_2">
                                Address Line 2
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="city"
                                id="city"
                                onChange={handleChange}
                                value={values?.city || ""} />
                            <label className="form-label" htmlFor="city">
                                City
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="state"
                                id="state"
                                onChange={handleChange}
                                value={values?.state || ""} />
                            <label className="form-label" htmlFor="state">
                                State
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="postal_code"
                                id="postal_code"
                                onChange={handleChange}
                                value={values?.postal_code || ""} />
                            <label className="form-label" htmlFor="postal_code">
                                Postal Code
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <input
                                className="form-control"
                                type="text"
                                name="phone"
                                id="phone"
                                onChange={handleChange}
                                value={values?.phone || ""} />
                            <label className="form-label" htmlFor="phone">
                                Phone
                            </label>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6 mt-2">
                        <div className="floating-input">
                            <label className="fw-bold" htmlFor="country">
                                Country
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
                                    let country;
                                    if (Array.isArray(value) && value.length > 0) {
                                        country = value[0];
                                    }
                                    if (country) {
                                        setFieldValue("country", country);
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
export default EditAddressFields;