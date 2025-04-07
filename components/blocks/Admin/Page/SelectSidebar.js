import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

function SelectSidebar({
    onChange,
    onSubmit
}) {
    const [sidebars, setSidebars] = useState([]);
    const [selectedSidebar, setSelectedSidebar] = useState(null);

    async function fetchSidebars() {
        // Fetch sidebars from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().sidebarRequest();
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
        if (typeof onChange === 'function') {
            onChange(selectedSidebar);
        }
    }, [selectedSidebar]);

    return (
        <div>
            <h2>Select Sidebar</h2>
            <p>Select a sidebar to add to the page.</p>
            <select
                className="form-control"
                onChange={e => {
                    const findSelectedSidebar = sidebars.find(sidebar => parseInt(sidebar?.id) === parseInt(e.target.value));
                    setSelectedSidebar(findSelectedSidebar);
                }}
                required=""
                value={parseInt(selectedSidebar?.id) || ''}
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
        </div>
    );
}
export default SelectSidebar;