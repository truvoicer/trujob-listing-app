import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

function SelectRole({
    roleId,
    onChange,
    onSubmit
}) {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);

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
                if (typeof onSubmit === 'function') {
                    onSubmit(selectedRole);
                }
            }}>
            <select
                className="form-control"
                onChange={e => {
                    const findSelectedRole = roles.find(role => parseInt(role?.id) === parseInt(e.target.value));
                    setSelectedRole(findSelectedRole);
                }}
                required=""
                value={parseInt(selectedRole?.id) || ''}
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
            <button type="submit" className="btn btn-primary">Select</button>
            </form>
        </div>
    );
}
export default SelectRole;