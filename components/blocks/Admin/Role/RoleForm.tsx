import Reorder from "@/components/Reorder/Reorder";
import { useContext } from "react";
import { DataTableContext } from "@/contexts/DataTableContext";
import SelectRole from "./SelectRole";
import { Role } from "@/types/Role";

export type RoleFormProps = {
    data?: Array<Role>;
    onChange: (data: Array<Role>) => void;
}
function RoleForm({ 
    data = [], 
    onChange
 }: RoleFormProps) {

    const dataTableContext = useContext(DataTableContext);

    const roleSchema = {
    };

    function updateFieldValue(index: number, field: string, value: string) {
        const newData: Array<Role> = [...data];
        if (!newData?.[index]) {
            return;
        }
        newData[index][field] = value;
        onChange(newData);
    }
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
                                            onSubmit={selectedRole => {
                                                const newData = [...reorderData];
                                                newData.push({ ...roleSchema, ...selectedRole });
                                                onChange(newData);
                                                dataTableContext.modal.close('role-select');
                                            }}
                                        />
                                    </div>
                                </div>
                            ),
                            showFooter: false
                        }, 'role-select');
                    }}
                >
                    {({
                        block,
                        index,
                    }) => (
                        <>
                            <SelectRole
                                roleId={block?.id}
                                onChange={(role: Role) => {
                                    console.log('role', role);
                                    // updateFieldValue(index, 'pagination_type', paginationType);
                                }}
                                showSubmitButton={false}
                            />
                        </>
                    )}
                </Reorder>
            </div>
        </div>
    );
}
export default RoleForm;