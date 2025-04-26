import Reorder from "@/components/Reorder/Reorder";
import { useContext } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectRole from "./SelectRole";
import { Role } from "@/types/Role";
import { FormContextType } from "@/components/form/Form";

export type RoleFormProps = {
    data?: Array<Role>;
    onChange: (data: Array<Role>) => void;
    onAdd?: (data: Role) => Promise<boolean>;
}
function RoleForm({ 
    data = [], 
    onChange,
    onAdd
 }: RoleFormProps) {

    const dataTableContext = useContext(DataTableContext);

    const roleSchema = {
    };

    function handleChange(values: Array<Role>) {
        onChange(values);
    }
    console.log('RoleForm', data);
    return (
        <div className="row">
            <div className="col-12">
                <Reorder
                    itemSchema={roleSchema}
                    itemHeader={(item, index) => {
                        return `${item?.label} | name: ${item?.name} | ability: ${item?.ability}` || 'Item label error';
                    }
                    }
                    data={data || []}
                    onChange={handleChange}
                    onAdd={({
                        reorderData,
                        onChange,
                        itemSchema
                    }) => {
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
                                formHelpers: FormContextType | null;
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
                                console.log('Successfully added role');
                                dataTableContext.modal.close('role-select');
                                return false;
                            }
                        }, 'role-select');
                    }}
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