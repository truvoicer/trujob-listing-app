import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectLinkTargetProps = {
    name?: string;
    value?: string | null;
    onChange?: (value: string | null) => void;
    onSubmit?: (value: string | null) => void;
    showSubmitButton?: boolean;
}
function SelectLinkTarget({
    name = 'link_target',
    value,
}: SelectLinkTargetProps) {
    const [linkTargets, setLinkTargets] = useState<Array<string>>([]);
    const [selectedLinkTarget, setSelectedLinkTarget] = useState<string | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchLinkTargets() {
        // Fetch linkTargets from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.enum}/link/target`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching linkTargets');
            return;
        }
        setLinkTargets(response?.data || []);
    }

    useEffect(() => {
        fetchLinkTargets();
    }, []);

    useEffect(() => {
        if (value) {
            setSelectedLinkTarget(value);
        }
    }, [value]);

    useEffect(() => {
        if (!selectedLinkTarget) {
            return;
        }
        if (!formContext) {
            console.warn('Form context not found');
            return;
        }
        if (!formContext.setFieldValue) {
            console.warn('setFieldValue function not found in form context');
            return;
        }
        formContext.setFieldValue(name, selectedLinkTarget);

    }, [selectedLinkTarget]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    setSelectedLinkTarget(e.target.value);
                }}
                value={selectedLinkTarget || ''}
            >
                <option value="">Select Link Target</option>
                {linkTargets.map((linkTarget, index) => (
                    <option
                        key={index}
                        value={linkTarget}>
                        {linkTarget}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>
                Link Target
            </label>
        </div>
    );
}
export default SelectLinkTarget;