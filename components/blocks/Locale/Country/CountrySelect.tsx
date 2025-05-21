import SelectDropdown, { Option } from "@/components/Select/SelectDropdown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Country } from "@/types/Country";
import { count } from "console";
import React, { useEffect } from "react";

export type CountrySelect = {
  onChange?: (selected: Country | Country[]) => void;
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
  value?: number | string | Option | Option[];
}
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
  value,
}: CountrySelect) {
  const [selectedCountries, setSelectedCountries] = React.useState<Country[]>([]);
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
  }, [selectedCountries]);

  return (
    <SelectDropdown
      value={value}
      isMulti={isMulti}
      placeholder={placeholder}
      enableSearch={enableSearch}
      allowNewOptions={allowNewOptions}
      loadMoreLimit={loadMoreLimit}
      onLoadMore={async (page: number) => {
        let response = await fetchCountries({ page });
        if (!response) {
          throw new Error("Failed to fetch countries");
        }
        return response
      }}
      addNewOptionPosition={addNewOptionPosition}
      loadingMore={loadingMore}
      loadingMessage={loadingMessage}
      showLoadingSpinner={showLoadingSpinner}
      options={countries}
      handleSearch={async (searchTerm: string) => {
        let response = await fetchCountries({ 
          query: searchTerm,
          page: 1,
          page_size: loadMoreLimit
         });
        if (!response) {
          throw new Error("Failed to fetch countries");
        }
        return response.data;
      }}
      parseOptions={
        (data: Record<string, any>) => {
          return {
            value: data.id,
            label: `${data.name}`,
          };
        }
      }
      onChange={(value: Option | Option[], options: Record<string, any>[]) => {
        if (!Array.isArray(options)) {
          return;
        }
        if (Array.isArray(value)) {
          const filteredOptions = value.map((option) => {
            const findInOptions = options.find((o) => o?.value === option?.id);
            return findInOptions;
          })
            .filter((option) => typeof option !== 'undefined');
          setSelectedCountries(filteredOptions);
        } else {
          const findInOptions = options.find((option) => option?.id === value?.value);
          if (!findInOptions) {
            return;
          }
          setSelectedCountries([findInOptions]);
        }
      }}
    />
  );
}

export default CountrySelect;