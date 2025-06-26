import { FormikValues, useFormikContext } from "formik";
import ManageProductCategory from "../../ProductCategory/ManageProductCategory";
import AccessControlComponent from "@/components/AccessControl/AccessControlComponent";
import { ProductCategory } from "@/types/Product";

type EditProductProductCategoryFields = {
    operation: 'edit' | 'update' | 'add' | 'create';
}
function EditProductProductCategoryFields({
    operation
}: EditProductProductCategoryFields) {

    const formHelpers = useFormikContext<FormikValues>() || {};


    return (

        <AccessControlComponent
        id="edit-product-product-type-fields"
            roles={[
                { name: 'admin' },
                { name: 'superuser' },
                { name: 'user' },
            ]}
        >
            <ManageProductCategory
                isChild={true}
                operation={operation}
                rowSelection={true}
                multiRowSelection={true}
                enableEdit={false}
                paginationMode="state"
                onChange={async (items: Array<ProductCategory>) => {
                    if (!Array.isArray(items)) {
                        console.log('Invalid values received from ManageUser component');
                        return;
                    }
                    const checkedProductCategorys = items.filter((item) => item?.checked);

                    const existingProductCategorys = formHelpers?.values?.items || [];
                    formHelpers.setFieldValue('items', [
                        ...existingProductCategorys,
                        ...checkedProductCategorys.filter((item) => {
                            return !existingProductCategorys.find((checkedItem) => checkedItem?.id === item?.id);
                        })
                    ]);
                }}
            />
        </AccessControlComponent>
    );
}
export default EditProductProductCategoryFields;