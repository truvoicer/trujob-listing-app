import { FormContext } from "@/components/form/Form";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { DataTableContext } from "@/contexts/DataTableContext";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { ModalState } from "@/library/services/modal/ModalService";
import { Role } from "@/types/Role";
import { useContext, useEffect, useState } from "react";

export type SelectRoleProps = {
    roleId?: number;
    onChange?: (role: Role) => void;
    modalId?: string;
    modalState?: ModalState;
    inModal?: boolean;
}
function SelectRole({
    roleId,
    onChange,
    modalId,
    modalState,
    inModal = false,
}: SelectRoleProps) {
    const [roles, setRoles] = useState<Array<Role>>([]);
    const [selectedRole, setSelectedRole] = useState<Role>();
    const formContext = useContext(FormContext);
    async function fetchRoles() {
        // Fetch roles from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: truJobApiConfig.endpoints.role,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            console.warn('No response from API when fetching roles');
            return;
        }
        setRoles(response?.data || []);
    }

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        if (!roleId) {
            return;
        }
        if (!Array.isArray(roles) || roles.length === 0) {
            return;
        }
        const findSelected = roles.find(role => role?.id === roleId);
        if (findSelected) {
            setSelectedRole(findSelected);
            return;
        }

    }, [roleId, roles]);


    useEffect(() => {
        if (!selectedRole) {
            return;
        }
        if (inModal) {
            if (typeof formContext?.setFieldValue === 'function') {
                formContext.setFieldValue('role', selectedRole);
            }
        } else {
            if (typeof onChange === 'function') {
                onChange(selectedRole);
            }
        }
    }, [selectedRole]);

    useEffect(() => {
        if (!inModal) {
            return;
        }
        if (!modalId) {
            return;
        }
        if (!modalState) {
            return;
        }
        modalState.update(
            {
                formProps: {
                    operation: 'create',
                    initialValues: {
                        role: null
                    },
                }
            },
            modalId
        );
    }, [modalId, modalId]);

    return (
        <div>
            <h2>Select Role</h2>
            <select
                className="form-control"
                onChange={e => {
                    const findSelectedRole: Role | undefined = roles.find(role => role.id === parseInt(e.target.value));
                    setSelectedRole(findSelectedRole);
                }}
                value={selectedRole?.id || ''}
            >
                <option value="">Select Role</option>
                {roles.map((role, index) => (
                    <option
                        key={index}
                        value={role.id}>
                        {`${role.label} (${role.name})`}
                    </option>
                ))}
            </select>
        </div>
    );
}
export default SelectRole;