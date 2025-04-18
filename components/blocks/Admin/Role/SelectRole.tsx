import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Role } from "@/types/Role";
import { useEffect, useState } from "react";

export type SelectRoleProps = {
    roleId?: number;
    onChange?: (role: Role) => void;
    onSubmit?: (role: Role) => void;
    showSubmitButton?: boolean;
}
function SelectRole({
    roleId,
    onChange,
    onSubmit,
    showSubmitButton = true,
}: SelectRoleProps) {
    const [roles, setRoles] = useState<Array<Role>>([]);
    const [selectedRole, setSelectedRole] = useState<Role>();

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
        if (typeof onChange === 'function') {
            onChange(selectedRole);
        }
    }, [selectedRole]);

    return (
        <div>
            <h2>Select Role</h2>
            <form onSubmit={e => {
                e.preventDefault();
                console.log('Selected Role:', selectedRole);
                if (!selectedRole) {
                    return;
                }
                if (typeof onSubmit === 'function') {
                    onSubmit(selectedRole);
                }
            }}>
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
            {showSubmitButton && (
                <div className="mt-3">
                    <button type="submit" className="btn btn-primary">Select</button>
                </div>
            )}
            </form>
        </div>
    );
}
export default SelectRole;