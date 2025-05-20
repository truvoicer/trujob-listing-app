import { Dispatch, useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import CurrencyPriceInput from "@/components/blocks/Locale/Currency/CurrencyPriceInput";
import ManagePriceType from "../../PriceType/ManagePriceType";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import DateTimePicker from "@/components/Date/DateTimePicker";

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

    function getListingComponentProps() {
        let componentProps: any = {
            operation: 'create',
            mode: 'selector'
        };
        if (values?.id) {
            componentProps.listingId = values.id;
            componentProps.operation = 'edit';
        }
        return componentProps;
    }

    modalService.setUseStateHook(useState);
    modalService.setConfig([
        {
            id: 'Type',
            title: 'Select Type',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManagePriceType
                        {...getListingComponentProps()}
                        values={values?.type ? [values?.type] : []}
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(priceTypes: Array<any>) => {
                            if (!Array.isArray(priceTypes)) {
                                console.warn('Invalid values received from ManagePriceType component');
                                return;
                            }

                            if (priceTypes.length === 0) {
                                console.warn('Price type is empty');
                                return true;
                            }
                            const checked = priceTypes.filter((item) => item?.checked);
                            if (checked.length === 0) {
                                console.warn('No price type selected');
                                return true;
                            }

                            const selected = checked[0];

                            if (values?.id) {
                                return;
                            }
                            setFieldValue('type', selected);
                        }}
                    />
                </AccessControlComponent>
            ),
            onOk: ({ state }: {
                state: LocalModal,
                setState: Dispatch<React.SetStateAction<LocalModal>>,
                configItem: any,
            },
                e?: React.MouseEvent | null
            ) => {
                return true;
            },
            onCancel: () => {
                return true;
            }
        },
    ]);


    return (

        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        <h4>Manage type</h4>
                        {modalService.renderLocalTriggerButton(
                            'Type',
                            'Select Type',
                        )}
                    </div>

                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <DateTimePicker
                                value={values?.valid_from}
                                onChange={(value) => {
                                    console.log('valid_from', value);
                                    setFieldValue("valid_from", value);
                                }}
                                onSelect={(value => {
                                    console.log('valid_from', value);
                                    setFieldValue("valid_from", value);
                                })}
                            />
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <DateTimePicker
                                value={values?.valid_to}
                                onChange={(value) => {
                                    console.log('valid_to', value);
                                    setFieldValue("valid_to", value);
                                }}
                                onSelect={(value => {
                                    console.log('valid_to', value);
                                    setFieldValue("valid_to", value);
                                })}
                            />
                        </div>
                    </div>

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
                            <CurrencyPriceInput
                                amountValue={values?.amount || ''}
                                currencyValue={values?.currency?.id || null}
                                onAmountChange={(value) => {
                                    console.log('currency amount value', value);
                                    setFieldValue("amount", value);
                                }
                                }
                                onCurrencyChange={(value) => {
                                    console.log('currency value', value);
                                    setFieldValue("currency", value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input form-group">
                            <CountrySelect
                                value={values?.country?.id}
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
                {modalService.renderLocalModals()}
            </div>
        </div>
    );
}
export default EditListingPriceFields;