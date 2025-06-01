import SelectDropdown, { Option } from "@/components/Select/SelectDropdown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import React, { useEffect } from "react";
import { Region } from "@/types/Region";

export type RegionSelect = {
  onChange?: (selected: Region | Region[]) => void;
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
function RegionSelect({
  onChange,
  isMulti = false,
  placeholder = "Select a region",
  enableSearch = true,
  allowNewOptions = true,
  loadMoreLimit = 10,
  onLoadMore,
  addNewOptionPosition = "bottom",
  loadingMore = false,
  loadingMessage = "Loading more...",
  showLoadingSpinner = true,
  value,
}: RegionSelect) {
  const [regions, setRegions] = React.useState<Region[]>([]);

  // Fetch regions from API
  const fetchRegions = async (query: Record<string, string | number | boolean> = {
    page: 1,
    page_size: loadMoreLimit,
  }) => {
    try {
      const response = await TruJobApiMiddleware.getInstance().resourceRequest({
        endpoint: truJobApiConfig.endpoints.region,
        method: TruJobApiMiddleware.METHOD.GET,
        protectedReq: true,
        query
      });
      if (!response) {
        throw new Error("Failed to fetch regions");
      }
      if (!Array.isArray(response?.data)) {
        throw new Error("Invalid response format");
      }
      return response;
    } catch (error) {
      console.error("Error fetching regions:", error);
      return false;
    }
  };
  const initialiseRegions = async () => {
    try {
      const response = await fetchRegions();
      if (!response) {
        throw new Error("Failed to fetch regions");
      }
      setRegions(response.data);
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };


  useEffect(() => {
    initialiseRegions();
  }, []);

  return (
    <SelectDropdown
      value={value}
      isMulti={isMulti}
      placeholder={placeholder}
      enableSearch={enableSearch}
      allowNewOptions={allowNewOptions}
      loadMoreLimit={loadMoreLimit}
      onLoadMore={async (page: number, searchTerm: string) => {
        let response = await fetchRegions({ 
          page, 
          query: searchTerm ,
          page_size: loadMoreLimit
        });
        if (!response) {
          throw new Error("Failed to fetch regions");
        }
        return response
      }}
      addNewOptionPosition={addNewOptionPosition}
      loadingMore={loadingMore}
      loadingMessage={loadingMessage}
      showLoadingSpinner={showLoadingSpinner}
      options={regions}
      handleSearch={async (searchTerm: string) => {
        let response = await fetchRegions({
          query: searchTerm,
          page: 1,
          page_size: loadMoreLimit
        });
        if (!response) {
          throw new Error("Failed to fetch regions");
        }
        return response.data;
      }}
      parseOptions={
        (data: Record<string, any>) => {
          if (data.hasOwnProperty('value') && data.hasOwnProperty('label')) {
            return {
              value: data.value,
              label: data.label,
            };
          }
          return {
            value: data.id,
            label: `${data.name}`,
          };
        }
      }
      onChange={onChange}
    />
  );
}

export default RegionSelect;