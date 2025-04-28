import Reorder, { ReorderOnDelete } from "@/components/Reorder/Reorder";
import { useContext, useEffect, useState } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectRole from "./SelectRole";
import { Role } from "@/types/Role";
import { FormikProps, FormikValues } from "formik";

export type RoleFormProps = {
    data?: Array<Role>;
    onChange: (data: Array<Role>) => void;
    onAdd?: (data: Role) => Promise<boolean>;
    makeRequest?: () => Promise<Array<Role>>;
    onDelete?: (data: Role) => Promise<boolean>;
}
function RoleForm({ 
    data = [], 
    onChange,
    onDelete,
    onAdd,
    makeRequest
 }: RoleFormProps) {
    const [roles, setRoles] = useState<Array<Role>>([]);
    const dataTableContext = useContext(DataTableContext);

    const roleSchema = {
    };

    function handleAdd() {
        dataTableContext.modal.show({
            component: (
                <div className="row">
                    <div className="col-12 col-lg-12">
                        <SelectRole
                            modalId="role-select"
                            modalState={dataTableContext.modal}
                            inModal={true}
                        />
                    </div>
                </div>
            ),
            formProps: {},
            showFooter: true,
            onOk: async ({formHelpers}: {
                formHelpers: FormikProps<FormikValues>;
            })  => {
                if (!formHelpers) {
                    console.warn('No form helpers found');
                    return false;
                }
                
                if (!formHelpers?.values?.role) {
                    console.warn('No role found');
                    return false;
                }
                if (typeof onAdd !== 'function') {
                    console.warn('No onAdd function found');
                    return false;
                }
                const response = await onAdd(
                    formHelpers?.values?.role
                );
                if (!response) {
                    console.warn('No response from onAdd function');
                    return false;
                }
                initRequest();
                console.log('Successfully added role');
                dataTableContext.modal.close('role-select');
                return false;
            }
        }, 'role-select');
    }

    async function handleDelete({index, item, itemSchema, reorderData}: ReorderOnDelete) {
        if (!item) {
            console.warn('No item found');
            return false;
        }
        if (typeof onDelete !== 'function') {
            console.warn('No onDelete function found');
            return false;
        }
        const response = await onDelete(item);
        if (!response) {
            console.warn('No response from onDelete function');
            return false;
        }
        initRequest();
        return true
    }

    function handleChange(values: Array<Role>) {
        if (typeof onChange !== 'function') {
            console.warn('No onChange function found');
            return;
        }
        onChange(values);
    }
    async function initRequest() {
        if (typeof makeRequest !== 'function') {
            return;
        }
        const response = await makeRequest()
        if (!response) {
            console.warn('No response from makeRequest');
            return;
        }
        if (!Array.isArray(response)) {
            console.warn('Response is not an array');
            return;
        }
        setRoles(response);
    }
    useEffect(() => {
        initRequest();
    }, []);
    
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    itemSchema={roleSchema}
                    itemHeader={(item, index) => {
                        return `${item?.label} | name: ${item?.name} | ability: ${item?.ability}` || 'Item label error';
                    }
                    }
                    data={roles || []}
                    onChange={handleChange}
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                >
                    {({
                        item,
                        index,
                    }) => (
                        <>
                            <SelectRole
                                roleId={item?.id}
                                onChange={(role: Role) => {
                                    console.log('role', role);
                                    // updateFieldValue(index, 'pagination_type', paginationType);
                                }}
                            />
                        </>
                    )}
                </Reorder>
            </div>
        </div>
    );
}
export default RoleForm;