import { FormikValues, useFormikContext } from "formik";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import { Category } from "@/types/Category";
import ManageShippingMethod from "../../../Shipping/ShippingMethod/ManageShippingMethod";

type EditProductShippingMethodFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditProductShippingMethodFields({
    operation
}: EditProductShippingMethodFields) {

    const formHelpers = useFormikContext<FormikValues>() || {};

    return (
        <AccessControlComponent
        id="edit-product-category-fields"
            roles={[
                { name: 'admin' },
                { name: 'superuser' },
                { name: 'user' },
            ]}
        >
            <ManageShippingMethod
                isChild={true}
                operation={operation}
                rowSelection={true}
                multiRowSelection={true}
                enableEdit={false}
                paginationMode="state"
                onChange={async (items: Array<Category>) => {
                    if (!Array.isArray(items)) {
                        console.log('Invalid values received from ManageUser component');
                        return;
                    }
                    const checkedCategories = items.filter((item) => item?.checked);

                    const existingCategories = formHelpers?.values?.items || [];
                    formHelpers.setFieldValue('items', [
                        ...existingCategories,
                        ...checkedCategories.filter((item) => {
                            return !existingCategories.find((checkedItem) => checkedItem?.id === item?.id);
                        })
                    ]);
                }}
            />
        </AccessControlComponent>
    );
}
export default EditProductShippingMethodFields;