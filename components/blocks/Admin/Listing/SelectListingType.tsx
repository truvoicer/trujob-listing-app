import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { ListingType } from "@/types/ListingType";
import { FormikValues, useFormikContext } from "formik";
import { useEffect, useState } from "react";

export type SelectListingTypeProps = {
    name?: string;
    value?: number | null;
}
function SelectListingType({
    name = 'listingType',
    value,
}: SelectListingTypeProps) {
    const [listingTypes, setListingTypes] = useState<Array<ListingType>>([]);
    const [selectedListingType, setSelectedListingType] = useState<ListingType | null>(null);

    const formContext = useFormikContext<FormikValues>() || {};

    async function fetchListingTypes() {
        // Fetch listingTypes from the API or any other source
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.listingType}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });
        if (!response) {
            console.warn('No response from API when fetching listingTypes');
            return;
        }
        setListingTypes(response?.data || []);
    }

    useEffect(() => {
        fetchListingTypes();
    }, []);

    useEffect(() => {
        if (value) {
            const findListingType = listingTypes.find((listingType: ListingType) => listingType?.id === value);
            
            if (findListingType) {
                setSelectedListingType(findListingType);
            }
        }
    }, [value, listingTypes]);
    useEffect(() => {
        if (!selectedListingType) {
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
        formContext.setFieldValue(name, selectedListingType);

    }, [selectedListingType]);

    return (
        <div className="floating-input form-group">
            <select
                id={name}
                name={name}
                className="form-control"
                onChange={e => {
                    if (!e.target.value) {
                        setSelectedListingType(null);
                        return;
                    }
                    const findListingType = listingTypes.find((listingType: ListingType) => listingType?.id === parseInt(e.target.value));
                    if (!findListingType) {
                        console.warn('Selected listingType not found');
                        return;
                    }
                    setSelectedListingType(findListingType);
                }}
                value={selectedListingType?.id || ''}
            >
                <option value="">Select ListingType</option>
                {listingTypes.map((listingType, index) => (
                    <option
                        key={index}
                        value={listingType.id}>
                        {`${listingType.label} | name: ${listingType.name} | id: (${listingType.id})`}
                    </option>
                ))}
            </select>
            <label className="form-label" htmlFor={name}>ListingType</label>
        </div>
    );
}
export default SelectListingType;