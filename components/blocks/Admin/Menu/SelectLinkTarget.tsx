import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

export type SelectLinkTargetProps = {
    id?: string | null;
    value?: string | null;
    onChange?: (value: string | null) => void;
    onSubmit?: (value: string | null) => void;
    showSubmitButton?: boolean;
}
function SelectLinkTarget({
    id = null,
    value,
    onChange,
    onSubmit,
    showSubmitButton = true,
}: SelectLinkTargetProps) {
    const [linkTargets, setLinkTargets] = useState<Array<string>>([]);
    const [selectedLinkTarget, setSelectedLinkTarget] = useState<string | null>(null);

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


    return (
        <div className="floating-input form-group">
            <select
                id={id || 'linkTarget'}
                className="form-control"
                onChange={e => {
                    setSelectedLinkTarget(e.target.value);
                    if (typeof onChange === 'function') {
                        onChange(e.target.value);
                    }
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
            <label className="form-label" htmlFor={id || 'linkTarget'}>
                Link Target
            </label>
            {showSubmitButton && (
                <button type="submit" className="btn btn-primary">Select</button>
            )}
        </div>
    );
}
export default SelectLinkTarget;