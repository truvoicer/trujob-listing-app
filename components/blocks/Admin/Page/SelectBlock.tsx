import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { useEffect, useState } from "react";

function SelectBlock({
    pageId,
    pageBlockId,
    pageBlockName,
    onChange,
    onSubmit
}) {
    const [blocks, setBlocks] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState(null);

    async function fetchBlocks() {
        // Fetch blocks from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.block}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching blocks');
            return;
        }
        setBlocks(response?.data || []);
    }

    useEffect(() => {
        fetchBlocks();
    }, []);


    useEffect(() => {
        if (!pageBlockId) {
            return;
        }
        if (!Array.isArray(blocks) || blocks.length === 0) {
            return;
        }
        const findSelectedBlock = blocks.find(block => block?.id === pageBlockId);
        if (findSelectedBlock) {
            // setSelectedBlock(findSelectedBlock);
            return;
        }
        const findBlock = blocks.find(block => block?.name === pageBlockName);
        if (findBlock) {
            // setSelectedBlock(findBlock);
            return;
        }
        console.warn('No block found with the given ID or name');
    }, [pageBlockId, blocks]);

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(selectedBlock);
        }
    }, [selectedBlock]);

    return (
        <div>
            <h2>Select Block</h2>
            <p>Select a block to add to the page.</p>
            <form onSubmit={e => {
                e.preventDefault();
                console.log('Selected Block:', selectedBlock);
                if (typeof onSubmit === 'function') {
                    onSubmit(selectedBlock);
                }
            }}>
                <select
                    className="form-control"
                    onChange={e => {
                        const findSelectedBlock = blocks.find(block => block?.type === e.target.value);
                        console.log('Selected Block:', findSelectedBlock, e.target.value, blocks);
                        setSelectedBlock(findSelectedBlock);
                    }}
                    required=""
                    value={selectedBlock?.type || ''}
                >
                    <option value="">Select Block</option>
                    {blocks.map((block, index) => (
                        <option
                            key={index}
                            value={block.type}>
                            {block.type}
                        </option>
                    ))}
                </select>
                <button type="submit" className="btn btn-primary">Select</button>
            </form>
        </div>
    );
}
export default SelectBlock;