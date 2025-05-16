import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Category } from "@/types/Listing";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectCategoryProps = {
    name?: string;
    value?: number | null;
}
function SelectCategory({
    name = 'category',
    value,
}: SelectCategoryProps) {
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchCategories() {
        // Fetch categories from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.category}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching categories');
            return;
        }
        setCategories(response?.data || []);
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (value) {
            const findCategory = categories.find((category: Category) => category?.id === value);
            
            if (findCategory) {
                setSelectedCategory(findCategory);
            }
        }
    }, [value, categories]);
    useEffect(() => {
        if (!selectedCategory) {
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
        formContext.setFieldValue(name, selectedCategory);

    }, [selectedCategory]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedCategory(null);
                        return;
                    }
                    const findCategory = categories.find((category: Category) => category?.id === parseInt(e.target.value));
                    if (!findCategory) {
                        console.warn('Selected category not found');
                        return;
                    }
                    setSelectedCategory(findCategory);
                }}
                value={selectedCategory?.id || ''}
            >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                    <option
                        key={index}
                        value={category.id}>
                        {`${category.label} | name: ${category.name} | id: (${category.id})`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Category</label>
        </div>
    );
}
export default SelectCategory;