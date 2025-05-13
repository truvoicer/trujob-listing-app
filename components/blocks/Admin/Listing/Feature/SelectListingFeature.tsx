import truJobApiConfig from "@/config/api/truJobApiConfig";
import { DebugHelpers } from "@/helpers/DebugHelpers";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { ListingFeature } from "@/types/Listing";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectListingFeatureProps = {
    name?: string;
    value?: number | null;
}
function SelectListingFeature({
    name = 'feature',
    value,
}: SelectListingFeatureProps) {
    const [listingFeatures, setListingFeatures] = useState<Array<ListingFeature>>([]);
    const [selectedListingFeature, setSelectedListingFeature] = useState<ListingFeature | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchListingFeatures() {
        // Fetch listingFeatures from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.feature}`,
            method: ApiMiddleware.METHOD.GET,
        });
        if (!response) {
            DebugHelpers.log(DebugHelpers.WARN, 'No response from API when fetching listingFeatures');
            return;
        }
        setListingFeatures(response?.data || []);
    }

    useEffect(() => {
        fetchListingFeatures();
    }, []);

    useEffect(() => {
        if (value) {
            const findListingFeature = listingFeatures.find((listingFeature: ListingFeature) => listingFeature?.id === value);
            
            if (findListingFeature) {
                setSelectedListingFeature(findListingFeature);
            }
        }
    }, [value, listingFeatures]);
    useEffect(() => {
        if (!selectedListingFeature) {
            return;
        }
        if (!formContext) {
            DebugHelpers.log(DebugHelpers.WARN, 'Form context not found');
            return;
        }
        if (!formContext.setFieldValue) {
            DebugHelpers.log(DebugHelpers.WARN, 'setFieldValue function not found in form context');
            return;
        }
        formContext.setFieldValue(name, selectedListingFeature);

    }, [selectedListingFeature]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedListingFeature(null);
                        return;
                    }
                    const findListingFeature = listingFeatures.find((listingFeature: ListingFeature) => listingFeature?.id === parseInt(e.target.value));
                    if (!findListingFeature) {
                        DebugHelpers.log(DebugHelpers.WARN, 'Selected listingFeature not found');
                        return;
                    }
                    setSelectedListingFeature(findListingFeature);
                }}
                value={selectedListingFeature?.id || ''}
            >
                <option value="">Select ListingFeature</option>
                {listingFeatures.map((listingFeature, index) => (
                    <option
                        key={index}
                        value={listingFeature.id}>
                        {`${listingFeature.label} | name: ${listingFeature.name} | id: (${listingFeature.id})`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>ListingFeature</label>
        </div>
    );
}
export default SelectListingFeature;