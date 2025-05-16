import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Color } from "@/types/Listing";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectColorProps = {
    name?: string;
    value?: number | null;
}
function SelectColor({
    name = 'color',
    value,
}: SelectColorProps) {
    const [colors, setColors] = useState<Array<Color>>([]);
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchColors() {
        // Fetch colors from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.color}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching colors');
            return;
        }
        setColors(response?.data || []);
    }

    useEffect(() => {
        fetchColors();
    }, []);

    useEffect(() => {
        if (value) {
            const findColor = colors.find((color: Color) => color?.id === value);
            
            if (findColor) {
                setSelectedColor(findColor);
            }
        }
    }, [value, colors]);
    useEffect(() => {
        if (!selectedColor) {
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
        formContext.setFieldValue(name, selectedColor);

    }, [selectedColor]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedColor(null);
                        return;
                    }
                    const findColor = colors.find((color: Color) => color?.id === parseInt(e.target.value));
                    if (!findColor) {
                        console.warn('Selected color not found');
                        return;
                    }
                    setSelectedColor(findColor);
                }}
                value={selectedColor?.id || ''}
            >
                <option value="">Select Color</option>
                {colors.map((color, index) => (
                    <option
                        key={index}
                        value={color.id}>
                        {`${color.label} | name: ${color.name} | id: (${color.id})`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Color</label>
        </div>
    );
}
export default SelectColor;