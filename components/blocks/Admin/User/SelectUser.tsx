import truJobApiConfig from "@/config/api/truJobApiConfig";
import { DebugHelpers } from "@/helpers/DebugHelpers";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { User } from "@/types/User";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectUserProps = {
    name?: string;
    value?: number | null;
}
function SelectUser({
    name = 'user',
    value,
}: SelectUserProps) {
    const [users, setUsers] = useState<Array<User>>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchUsers() {
        // Fetch users from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.user}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            DebugHelpers.log(DebugHelpers.WARN, 'No response from API when fetching users');
            return;
        }
        setUsers(response?.data || []);
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (value) {
            const findUser = users.find((user: User) => user?.id === value);
            
            if (findUser) {
                setSelectedUser(findUser);
            }
        }
    }, [value, users]);
    useEffect(() => {
        if (!selectedUser) {
            return;
        }
        if (!formContext) {
            DebugHelpers.log(DebugHelpers.WARN, 'Form context not found');
            return;
        }
        if (!formContext.setFieldValue) {
            DebugHelpers.log(DebugHelpers.WARN, 'setFieldValue function not found in form context');
            return;
        }
        formContext.setFieldValue(name, selectedUser);

    }, [selectedUser]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedUser(null);
                        return;
                    }
                    const findUser = users.find((user: User) => user?.id === parseInt(e.target.value));
                    if (!findUser) {
                        DebugHelpers.log(DebugHelpers.WARN, 'Selected user not found');
                        return;
                    }
                    setSelectedUser(findUser);
                }}
                value={selectedUser?.id || ''}
            >
                <option value="">Select User</option>
                {users.map((user, index) => (
                    <option
                        key={index}
                        value={user.id}>
                        {`${user.email} | name: ${user.first_name} | id: (${user.id})`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>User</label>
        </div>
    );
}
export default SelectUser;