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
import { SITE_STATE } from "@/library/redux/constants/site-constants";
import { connect } from "react-redux";
import { getSiteCountryAction, getSiteCurrencyAction } from "@/library/redux/actions/site-actions";
import moment from "moment";
import ManageUser from "../../User/ManageUser";
import { PriceType } from "@/types/Price";
import { User } from "@/types/User";

export type EditProductPriceFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
    site: any;
}
function EditProductPriceFields({
    operation,
    site,
}: EditProductPriceFields) {
    const [selectedTableRows, setSelectedTableRows] = useState<Array<any>>([]);

    const modalService = new ModalService();
    const notificationContext = useContext(AppNotificationContext);
    const dataTableContext = useContext(DataTableContext);

    const { values, handleChange, setFieldValue } = useFormikContext<FormikValues>() || {};

    function getProductComponentProps() {
        let componentProps: any = {
            operation: 'create',
            mode: 'selector'
        };
        if (values?.id) {
            componentProps.productId = values.id;
            componentProps.operation = 'edit';
        }
        return componentProps;
    }

    modalService.setUseStateHook(useState);
    modalService.setConfig([
        {
            id: 'user',
            title: 'Select User',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                id="edit-product-price-fields-user"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManageUser
                        {...getProductComponentProps()}
                        values={values?.user ? [values?.user] : []}
                        rowSelection={true}
                        multiRowSelection={false}
                        enableEdit={false}
                        paginationMode="state"
                        onChange={(users: Array<any>) => {
                            if (!Array.isArray(users)) {
                                console.warn('Invalid values received from ManageUser component');
                                return;
                            }

                            if (users.length === 0) {
                                console.warn('Users is empty');
                                return true;
                            }
                            const checked = users.filter((item) => item?.checked);
                            if (checked.length === 0) {
                                console.warn('No user selected');
                                return true;
                            }
                            const selectedUser = checked[0];

                            setFieldValue('user', selectedUser);
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
        {
            id: 'Type',
            title: 'Select Type',
            size: 'lg',
            fullscreen: true,
            component: (
                <AccessControlComponent
                id="edit-product-price-fields-type"
                    roles={[
                        { name: 'admin' },
                        { name: 'superuser' },
                    ]}
                >
                    <ManagePriceType
                        {...getProductComponentProps()}
                        values={values?.priceType ? [values?.priceType] : []}
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
                            setFieldValue('priceType', selected);
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

    const country  = getSiteCountryAction();
    // console.log('EditProductPriceFields', values);

    return (

        <div className="row justify-content-center align-items-center">
            <div className="col-md-12 col-sm-12 col-12 align-self-center">
                <div className="row">

                    <div className="col-12 col-lg-6">
                        <div className="floating-input">
                            <label className="d-block fw-bold">
                                Price Type
                            </label>
                            {values?.priceType && (
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    Selected:
                                    <div className="d-flex flex-wrap">
                                        <div className="badge bg-primary-light mr-2 mb-2">
                                            {values?.priceType?.label}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalService.renderLocalTriggerButton(
                                'Type',
                                'Select Type',
                            )}
                        </div>
                    </div>

                    <div className="col-12 col-lg-6 mt-3">
                        <div className="floating-input">
                            <label className="d-block fw-bold">
                                User
                            </label>
                            {values?.user && (
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    Selected:
                                    <div className="d-flex flex-wrap">
                                        <div className="badge bg-primary-light mr-2 mb-2">
                                            {values?.user?.first_name} {values?.user?.last_name} ({values?.user?.email})
                                        </div>
                                    </div>
                                </div>
                            )}
                            {modalService.renderLocalTriggerButton(
                                'user',
                                'Select User',
                            )}
                        </div>
                    </div>

                    <div className="col-12 col-lg-6 mt-3">
                        <div className="floating-input form-group">
                            <DateTimePicker
                                label="Valid From"
                                value={
                                    moment(values?.valid_from).isValid()
                                        ? moment(values?.valid_from).toDate()
                                        : ''
                                }
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
                                label="Valid To"
                                value={
                                    moment(values?.valid_to).isValid()
                                        ? moment(values?.valid_to).toDate()
                                        : ''
                                }
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
                                    } : {
                                        value: country?.id,
                                        label: country?.name,
                                    }}
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
export default connect(
    (state: any) => ({
        site: state[SITE_STATE],
    }),
)(EditProductPriceFields);