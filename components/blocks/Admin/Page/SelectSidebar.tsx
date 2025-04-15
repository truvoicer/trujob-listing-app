import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Sidebar } from "@/types/Sidebar";
import { useEffect, useState } from "react";

type Props = {
    sidebarId?: number;
    onChange?: (sidebar: any) => void;
    onSubmit?: (sidebar: any) => void;
}
function SelectSidebar({
    sidebarId,
    onChange,
    onSubmit
}: Props) {
    const [sidebars, setSidebars] = useState<Array<Sidebar>>([]);
    const [selectedSidebar, setSelectedSidebar] = useState<Sidebar>();

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
        if (typeof onChange === 'function') {
            onChange(selectedSidebar);
        }
    }, [selectedSidebar]);

    return (
        <div>
            <h2>Select Sidebar</h2>
            <p>Select a sidebar to add to the page.</p>
            <form onSubmit={e => {
                e.preventDefault();
                console.log('Selected Sidebar:', selectedSidebar);
                if (typeof onSubmit === 'function') {
                    onSubmit(selectedSidebar);
                }
            }}>
            <select
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
            <button type="submit" className="btn btn-primary">Select</button>
            </form>
        </div>
    );
}
export default SelectSidebar;