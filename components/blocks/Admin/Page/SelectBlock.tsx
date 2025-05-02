import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Block } from "@/types/Block";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectBlockProps = {
    name?: string;
}

function SelectBlock({
    name = 'block',
}: SelectBlockProps) {
    const [blocks, setBlocks] = useState<Array<Block>>([]);
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

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
        if (!selectedBlock) {
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
        formContext.setFieldValue(name, selectedBlock);

    }, [selectedBlock]);


    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    const findSelectedBlock = blocks.find(block => block?.type === e.target.value);
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
            <label className="form-label" htmlFor={name}>
                Block
            </label>
        </div>
    );
}
export default SelectBlock;