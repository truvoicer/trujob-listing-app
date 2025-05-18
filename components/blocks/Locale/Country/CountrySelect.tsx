import SelectDropdown, { Option } from "@/components/Select/SelectDropdown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Country } from "@/types/Country";
import React, { useEffect } from "react";

function CountrySelect({
  onChange,
  isMulti = false,
  placeholder = "Select a country",
  enableSearch = true,
  allowNewOptions = true,
  loadMoreLimit = 10,
  onLoadMore,
  addNewOptionPosition = "bottom",
  loadingMore = false,
  loadingMessage = "Loading more...",
  showLoadingSpinner = true,
}: {
  onChange?: (selected: Option | Option[]) => void;
  isMulti?: boolean;
  placeholder?: string;
  enableSearch?: boolean;
  allowNewOptions?: boolean;
  loadMoreLimit?: number;
  onLoadMore?: () => void;
  addNewOptionPosition?: "top" | "bottom" | "both";
  loadingMore?: boolean;
  loadingMessage?: string;
  showLoadingSpinner?: boolean;
}) {
  const [selectedCountries, setSelectedCountries] = React.useState<Option[]>([]);
  const [countries, setCountries] = React.useState<Country[]>([]);

  // Fetch countries from API
  const fetchCountries = async (query: Record<string, string | number | boolean> = {
    page: 1,
    page_size: loadMoreLimit,
  }) => {
    try {
      const response = await TruJobApiMiddleware.getInstance().resourceRequest({
        endpoint: truJobApiConfig.endpoints.country,
        method: TruJobApiMiddleware.METHOD.GET,
        protectedReq: true,
        query
      });
      if (!response) {
        throw new Error("Failed to fetch countries");
      }
      if (!Array.isArray(response?.data)) {
        throw new Error("Invalid response format");
      }
      return response;
    } catch (error) {
      console.error("Error fetching countries:", error);
      return false;
    }
  };
  const initialiseCountries = async () => {
    try {
      const response = await fetchCountries();
      if (!response) {
        throw new Error("Failed to fetch countries");
      }
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    initialiseCountries();
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(selectedCountries);
    }
  }, [selectedCountries, onChange]);

  return (
    <SelectDropdown
          isMulti={isMulti}
          placeholder={placeholder}
          enableSearch={enableSearch}
          allowNewOptions={allowNewOptions}
          loadMoreLimit={loadMoreLimit}
          onLoadMore={async (page: number) => {
            console.log("Load more countries");
            let response = await fetchCountries({ page });
            if (!response) {
              throw new Error("Failed to fetch countries");
            }
            response.data = response.data.map((country: Country) => ({
              value: country.id,
              label: `${country.name}`,
            }));
            return response
          }}
          addNewOptionPosition={addNewOptionPosition}
          loadingMore={loadingMore}
          loadingMessage={loadingMessage}
          showLoadingSpinner={showLoadingSpinner}
          options={countries.map((country) => ({
            value: country.id,
            label: `${country.name})`,
          }))}
          onChange={(value: Option | Option[]) => {
            if (Array.isArray(value)) {
              setSelectedCountries(value as Option[]);
            } else {
              setSelectedCountries([value as Option]);
            }
          }}
    />
  );
}

export default CountrySelect;