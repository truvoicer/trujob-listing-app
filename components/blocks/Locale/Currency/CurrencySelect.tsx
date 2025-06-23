import SelectDropdown, { Option, SelectDropdownProps } from "@/components/Select/SelectDropdown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Currency } from "@/types/Currency";
import React, { useEffect } from "react";

export type CurrencySelect = {
  onChange?: (selected: Currency | Currency[]) => void;
  displayText?: (data: Record<string, unknown>) => string;
  isMulti?: boolean;
  placeholder?: string;
  enableSearch?: boolean;
  allowNewOptions?: boolean;
  loadMoreLimit?: number;
  addNewOptionPosition?: "top" | "bottom" | "both";
  loadingMore?: boolean;
  loadingMessage?: string;
  showLoadingSpinner?: boolean;
  value?: number | string | Option | Option[] | null;
}
function CurrencySelect({
  onChange,
  displayText,
  isMulti = false,
  placeholder = "Select a currency",
  enableSearch = true,
  allowNewOptions = true,
  loadMoreLimit = 10,
  addNewOptionPosition = "bottom",
  loadingMore = false,
  loadingMessage = "Loading more...",
  showLoadingSpinner = true,
  value
}: CurrencySelect) {
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);

  // Fetch currencies from API
  const fetchCurrencies = async (query: Record<string, string | number | boolean> = {
    page: 1,
    page_size: loadMoreLimit,
  }) => {
    try {
      const response = await TruJobApiMiddleware.getInstance().resourceRequest({
        endpoint: truJobApiConfig.endpoints.currency,
        method: TruJobApiMiddleware.METHOD.GET,
        protectedReq: true,
        query
      });
      if (!response) {
        throw new Error("Failed to fetch currencies");
      }
      if (!Array.isArray(response?.data)) {
        throw new Error("Invalid response format");
      }
      return response;
    } catch (error) {
      console.error("Error fetching currencies:", error);
      return false;
    }
  };
  const initialiseCurrencies = async () => {
    try {
      const response = await fetchCurrencies();
      if (!response) {
        throw new Error("Failed to fetch currencies");
      }
      setCurrencies(response.data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  useEffect(() => {
    initialiseCurrencies();
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
        const response = await fetchCurrencies({ 
          page, 
          query: searchTerm,
          page_size: loadMoreLimit
         });
        if (!response) {
          throw new Error("Failed to fetch currencies");
        }
        return response;
      }}
      addNewOptionPosition={addNewOptionPosition}
      loadingMore={loadingMore}
      loadingMessage={loadingMessage}
      showLoadingSpinner={showLoadingSpinner}
      options={currencies}
      parseOptions={
        (data: Record<string, unknown>) => {
          if (data.hasOwnProperty('value') && data.hasOwnProperty('label')) {
            return {
              value: data.value,
              label: data.label,
            };
          }
          if (typeof displayText === 'function') {
            return {
              value: data.id,
              label: displayText(data),
            };
          }
          return {
            value: data.id,
            label: `${data.name} (${data?.country?.name})`,
          };
        }

      }

      handleSearch={async (searchTerm: string) => {
        let response = await fetchCurrencies({
          query: searchTerm,
          page: 1,
          page_size: loadMoreLimit
        });
        if (!response) {
          throw new Error("Failed to fetch currencies");
        }
        return response.data;
      }}
      onChange={onChange}
    />
  );
}

export default CurrencySelect;