import { Dispatch, useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import CountrySelect from "@/components/blocks/Locale/Country/CountrySelect";
import { Country } from "@/types/Country";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import CurrencyPriceInput from "@/components/blocks/Locale/Currency/CurrencyPriceInput";
import { getSiteCurrencyAction } from "@/library/redux/actions/site-actions";
import SelectShippingRateType from "./SelectShippingRateType";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageShippingZone from "../ShippingZone/ManageShippingZone";
import SelectedDisplay from "@/components/Elements/SelectedDisplay";

type EditShippingRateFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditShippingRateFields({
    operation
}: EditShippingRateFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};

    function getComponentProps() {
        let componentProps: any = {
            operation: 'create',
            mode: 'selector'
        };
        if (values?.id) {
            componentProps.shippingMethodId = values.id;
            componentProps.operation = 'edit';
        }
        return componentProps;
    }
    modalService.setUseStateHook(useState);
    modalService.setConfig([
        {
            id: 'zones',
            title: 'Select Zone',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="select-shipping-rate-zone"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageShippingZone
                        {...getComponentProps()}
                        values={values?.zone ? [values?.zone] : []}
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(zones: Array<any>) => {
                            if (!Array.isArray(zones)) {
                                console.warn('Invalid values received from ManageShippingZone component');
                                return;
                            }

                            if (zones.length === 0) {
                                console.warn('Zones is empty');
                                return true;
                            }
                            const checked = zones.filter((item) => item?.checked);
                            if (checked.length === 0) {
                                console.warn('No zones selected');
                                return true;
                            }
                        
                            setFieldValue('zone', checked[0]);
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
                        <SelectShippingRateType name='type' value={values?.type || ''} />
                    </div>

                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.min_amount || ""}
                            onChange={handleChange}
                            placeholder="Enter min amount"
                            name="min_amount"
                            type="text"
                            label="Min Amount"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <TextInput
                            value={values?.max_amount || ""}
                            onChange={handleChange}
                            placeholder="Enter max amount"
                            name="max_amount"
                            type="text"
                            label="Max Amount"
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="floating-input">
                            <label className="fw-bold" htmlFor="amount">
                                Amount
                            </label>
                            <CurrencyPriceInput
                                amountValue={values?.amount || ''}
                                currencyValue={
                                    values?.currency
                                        ? values?.currency
                                        : getSiteCurrencyAction()
                                }
                                onAmountChange={(value) => {
                                    setFieldValue("amount", value);
                                }}
                                onCurrencyChange={(value) => {
                                    setFieldValue("currency", value);
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name="is_free_shipping_possible"
                            value={values?.is_free_shipping_possible || false}
                            onChange={handleChange}
                            label="Is Free Shipping Possible?"
                            placeholder="Is Free Shipping Possible?"
                        />
                    </div>


                    <div className="col-12 col-lg-6">
                        <div className="floating-input">
                            <SelectedDisplay
                                label="Zone"
                                data={values?.zone}
                                render={(zone: Record<string, any>) => (
                                    <>
                                        {zone?.name || 'No Zone Selected'}
                                    </>
                                )}
                            />
                            {modalService.renderLocalTriggerButton(
                                'zones',
                                'Select Zone',
                            )}
                        </div>
                    </div>

                </div>
                {modalService.renderLocalModals()}
            </div>
        </div>
    );
}
export default EditShippingRateFields;