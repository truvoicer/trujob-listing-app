import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Block } from "@/types/Block";
import { useEffect, useState } from "react";

type Props = {
    onChange?: (block: any) => void;
    onSubmit?: (block: any) => void;
}

function SelectBlock({
    onChange,
    onSubmit
}: Props) {
    const [blocks, setBlocks] = useState<Array<Block>>([]);
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

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
                        if (!findSelectedBlock) {
                            return;
                        }
                        setSelectedBlock(findSelectedBlock);
                    }}
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