import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Sidebar } from "@/types/Sidebar";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectSidebarProps = {
    sidebarId?: number;
    name?: string;
}
function SelectSidebar({
    name = 'sidebar',
    sidebarId,
}: SelectSidebarProps) {
    const [sidebars, setSidebars] = useState<Array<Sidebar>>([]);
    const [selectedSidebar, setSelectedSidebar] = useState<Sidebar>();

    const formContext = useFormikContext<FormikValues>() || {};
    async function fetchSidebars() {
        // Fetch sidebars from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: truJobApiConfig.endpoints.sidebar,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true,
        });
        if (!response) {
            console.warn('No response from API when fetching sidebars');
            return;
        }
        setSidebars(response?.data || []);
    }

    useEffect(() => {
        fetchSidebars();
    }, []);

    useEffect(() => {
        if (!sidebarId) {
            return;
        }
        if (!Array.isArray(sidebars) || sidebars.length === 0) {
            return;
        }
        const findSelected = sidebars.find(sidebar => sidebar?.id === sidebarId);
        if (findSelected) {
            setSelectedSidebar(findSelected);
            return;
        }
        
    }, [sidebarId, sidebars]);

    useEffect(() => {
        if (!selectedSidebar) {
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
        formContext.setFieldValue(name, selectedSidebar);
        
    }, [selectedSidebar]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    let selectedValue = parseInt(e.target.value);
                   
                    const findSelectedSidebar = sidebars.find(sidebar => sidebar.id === selectedValue);
                    setSelectedSidebar(findSelectedSidebar);
                }}
                value={selectedSidebar?.id || ''}
                >
                <option value="">Select Sidebar</option>
                {sidebars.map((sidebar, index) => (
                    <option
                        key={index}
                        value={sidebar.id}>
                        {`${sidebar.title} (${sidebar.name})`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>
                Sidebar
            </label>
        </div>
    );
}
export default SelectSidebar;