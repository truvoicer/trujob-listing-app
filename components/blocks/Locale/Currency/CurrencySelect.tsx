import SelectDropdown, { Option, SelectDropdownProps } from "@/components/Select/SelectDropdown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { Currency } from "@/types/Currency";
import React, { useEffect } from "react";

function CurrencySelect({
  onChange,
  isMulti = false,
  placeholder = "Select a currency",
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
  const [selectedCurrencies, setSelectedCurrencies] = React.useState<Option[]>([]);
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

  useEffect(() => {
    if (onChange) {
      onChange(selectedCurrencies);
    }
  }, [selectedCurrencies, onChange]);

  return (
    <SelectDropdown
      isMulti={isMulti}
      placeholder={placeholder}
      enableSearch={enableSearch}
      allowNewOptions={allowNewOptions}
      loadMoreLimit={loadMoreLimit}
      onLoadMore={async (page: number) => {
        console.log("Load more currencies");
        let response = await fetchCurrencies({ page });
        if (!response) {
          throw new Error("Failed to fetch currencies");
        }
        response.data = response.data.map((currency: Currency) => ({
          value: currency.id,
          label: `${currency.name} (${currency.symbol})`,
        }));
        return response
      }}
      addNewOptionPosition={addNewOptionPosition}
      loadingMore={loadingMore}
      loadingMessage={loadingMessage}
      showLoadingSpinner={showLoadingSpinner}
      options={currencies.map((currency) => ({
        value: currency.id,
        label: `${currency.name} (${currency.symbol})`,
      }))}
      onChange={(value: Option | Option[]) => {
        if (Array.isArray(value)) {
          setSelectedCurrencies(value as Option[]);
        } else {
          setSelectedCurrencies([value as Option]);
        }
      }}
    />
  );
}

export default CurrencySelect;