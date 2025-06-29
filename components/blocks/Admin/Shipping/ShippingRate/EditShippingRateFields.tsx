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
import SelectShippingUnit from "../SelectShippingUnit";
import SelectShippingWeightUnit from "../SelectShippingWeightUnit";

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
            mode: 'selector',
            isChild: true,
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
                            console.log('Selected zones', checked);
                            setFieldValue('shipping_zone', checked[0]);
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
                        <Checkbox
                            name="weight_limit"
                            value={values?.weight_limit || false}
                            onChange={handleChange}
                            label="Is Weight Limit Applied?"
                            placeholder="Is Weight Limit Applied?"
                        />
                    </div>
                    {values?.weight_limit && (
                        <>
                            <div className="col-12 col-md-4">
                                <TextInput
                                    value={values?.min_weight || 0}
                                    onChange={handleChange}
                                    placeholder="Enter min weight"
                                    name="min_weight"
                                    type="number"
                                    label="Min Weight"
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    value={values?.max_weight || 0}
                                    onChange={handleChange}
                                    placeholder="Enter max weight"
                                    name="max_weight"
                                    type="number"
                                    label="Max Weight"
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <SelectShippingWeightUnit
                                    name="weight_unit"
                                    value={values?.weight_unit || ''} />
                            </div>
                        </>
                    )}


                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name="height_limit"
                            value={values?.height_limit || false}
                            onChange={handleChange}
                            label="Is Height Limit Applied?"
                            placeholder="Is Height Limit Applied?"
                        />
                    </div>
                    {values?.height_limit && (
                        <>
                            <div className="col-12 col-md-4">
                                <TextInput
                                    value={values?.min_height || 0}
                                    onChange={handleChange}
                                    placeholder="Enter min height"
                                    name="min_height"
                                    type="number"
                                    label="Min Height"
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    value={values?.max_height || 0}
                                    onChange={handleChange}
                                    placeholder="Enter max height"
                                    name="max_height"
                                    type="number"
                                    label="Max Height"
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <SelectShippingUnit
                                    name="height_unit"
                                    value={values?.height_unit || ''} />
                            </div>
                        </>
                    )}


                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name="length_limit"
                            value={values?.length_limit || false}
                            onChange={handleChange}
                            label="Is Length Limit Applied?"
                            placeholder="Is Length Limit Applied?"
                        />
                    </div>
                    {values?.length_limit && (
                        <>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    value={values?.min_length || 0}
                                    onChange={handleChange}
                                    placeholder="Enter min length"
                                    name="min_length"
                                    type="number"
                                    label="Min Length"
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    value={values?.max_length || 0}
                                    onChange={handleChange}
                                    placeholder="Enter max length"
                                    name="max_length"
                                    type="number"
                                    label="Max Length"
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <SelectShippingUnit
                                    name="length_unit"
                                    value={values?.length_unit || ''} />
                            </div>
                        </>
                    )}


                    <div className="col-12 col-lg-6">
                        <Checkbox
                            name="width_limit"
                            value={values?.width_limit || false}
                            onChange={handleChange}
                            label="Is Width Limit Applied?"
                            placeholder="Is Width Limit Applied?"
                        />
                    </div>
                    {values?.width_limit && (
                        <>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    value={values?.min_width || 0}
                                    onChange={handleChange}
                                    placeholder="Enter min width"
                                    name="min_width"
                                    type="number"
                                    label="Min Width"
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    value={values?.max_width || 0}
                                    onChange={handleChange}
                                    placeholder="Enter max width"
                                    name="max_width"
                                    type="number"
                                    label="Max Width"
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <SelectShippingUnit
                                    name="width_unit"
                                    value={values?.width_unit || ''} />
                            </div>
                        </>
                    )}

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
                        <div className="floating-input">
                            <SelectedDisplay
                                label="Zone"
                                data={values?.shipping_zone}
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