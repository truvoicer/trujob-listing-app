import truJobApiConfig from "@/config/api/truJobApiConfig";

import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Feature } from "@/types/Listing";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectFeatureProps = {
    name?: string;
    value?: number | null;
}
function SelectFeature({
    name = 'feature',
    value,
}: SelectFeatureProps) {
    const [listingFeatures, setFeatures] = useState<Array<Feature>>([]);
    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchFeatures() {
        // Fetch listingFeatures from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.feature}`,
            method: ApiMiddleware.METHOD.GET,
        });
        if (!response) {
            console.warn('No response from API when fetching listingFeatures');
            return;
        }
        setFeatures(response?.data || []);
    }

    useEffect(() => {
        fetchFeatures();
    }, []);

    useEffect(() => {
        if (value) {
            const findFeature = listingFeatures.find((listingFeature: Feature) => listingFeature?.id === value);
            
            if (findFeature) {
                setSelectedFeature(findFeature);
            }
        }
    }, [value, listingFeatures]);
    useEffect(() => {
        if (!selectedFeature) {
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
        formContext.setFieldValue(name, selectedFeature);

    }, [selectedFeature]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedFeature(null);
                        return;
                    }
                    const findFeature = listingFeatures.find((listingFeature: Feature) => listingFeature?.id === parseInt(e.target.value));
                    if (!findFeature) {
                        console.warn('Selected listingFeature not found');
                        return;
                    }
                    setSelectedFeature(findFeature);
                }}
                value={selectedFeature?.id || ''}
            >
                <option value="">Select Feature</option>
                {listingFeatures.map((listingFeature, index) => (
                    <option
                        key={index}
                        value={listingFeature.id}>
                        {`${listingFeature.label} | name: ${listingFeature.name} | id: (${listingFeature.id})`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>Feature</label>
        </div>
    );
}
export default SelectFeature;