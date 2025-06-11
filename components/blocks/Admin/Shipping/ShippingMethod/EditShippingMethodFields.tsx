import { Dispatch, useContext, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { LocalModal, ModalService } from "@/library/services/modal/ModalService";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import { DataTableContext } from "@/contexts/DataTableContext";
import QuantityInput from "@/components/QuantityInput";
import TextInput from "@/components/Elements/TextInput";
import Checkbox from "@/components/Elements/Checkbox";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import ManageShippingRate from "../ShippingRate/ManageShippingRate";
import SelectedDisplay from "@/components/Elements/SelectedDisplay";
import SelectedListDisplay from "@/components/Elements/SelectedListDisplay";
import { ShippingRate } from "@/types/Shipping";

type EditShippingMethodFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditShippingMethodFields({
    operation
}: EditShippingMethodFields) {
    const [selectedShippingRates, setSelectedShippingRates] = useState<Array<ShippingRate>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, setFieldValue, handleChange } = useFormikContext<FormikValues>() || {};
    console.log('EditShippingMethodFields values', values);
    function getComponentProps() {
        let componentProps: any = {
            operation: 'create',
            // mode: 'selector'
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
            id: 'rates',
            title: 'Select Rates',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                    id="edit-shipping-method-rates"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageShippingRate
                        {...getComponentProps()}
                    
                        values={values?.rates ? [values?.rates] : []}
                        data={values?.rates || []}
                        rowSelection={false}
                        mode={'selector'}
                        multiRowSelection={false}
                        enableEdit={true}
                        paginationMode="state"
                        onChange={(rates: Array<any>) => {
                            console.log('rates', rates);
                            if (!Array.isArray(rates)) {
                                console.warn('Invalid values received from ManageShippingRate component');
                                return;
                            }

                            setFieldValue('rates', rates);
                            
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
                        <TextInput
                            value={values?.carrier || ""}
                            onChange={handleChange}
                            placeholder="Enter carrier"
                            name="carrier"
                            type="text"
                            label="Carrier"
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
                        <div className="">
                            <label className="form-label" htmlFor="icon">
                                Procesing Time (Days)
                            </label>
                            <QuantityInput
                                value={values?.processing_time_days || 1}
                                min={1}
                                max={365}
                                onChange={(val) => setFieldValue('processing_time_days', val)}
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
                        <div className="floating-input">
                            <SelectedListDisplay
                                label="Rates"
                                data={values?.rates}
                                render={(rate: Record<string, any>) => (
                                    <>
                                        {rate?.label}
                                    </>
                                )}
                            />
                            {modalService.renderLocalTriggerButton(
                                'rates',
                                'Select Rates',
                            )}
                        </div>
                    </div>

                </div>
                {modalService.renderLocalModals()}
            </div>
        </div>
    );
}
export default EditShippingMethodFields;