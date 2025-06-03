import { Option } from "@/components/Select/SelectDropdown";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import React, { useState, useEffect, useRef } from "react";
import { has } from "underscore";

export interface Currency {
  code: string;
  symbol: string;
}

export interface LaravelCollectionResponse {
  data: Currency[];
  [key: string]: any;
}

export interface CurrencyPriceInputProps {
  currencies?: Currency[];
  onLoadMore?: (page: number) => Promise<LaravelCollectionResponse>;
  defaultCurrency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
  onAmountChange?: (amount: string) => void;
  placeholder?: string;
  loadingMessage?: string;
  noMoreMessage?: string;
  inputClassName?: string;
  dropdownButtonClass?: string;
  dropdownMenuClass?: string;
  dropdownItemClass?: string;
  currencyValue?: number | Currency;
  amountValue?: number;
}

export default function CurrencyPriceInput({
  currencyValue,
  amountValue,
  currencies = [],
  onLoadMore,
  defaultCurrency = { code: "USD", symbol: "$" },
  onCurrencyChange,
  onAmountChange,
  placeholder = "Enter amount",
  loadingMessage = "Loading more...",
  noMoreMessage = "No more currencies",
  inputClassName = "form-control w-auto",
  dropdownButtonClass = "btn btn-outline-secondary dropdown-toggle",
  dropdownMenuClass = "dropdown-menu show",
  dropdownItemClass = "dropdown-item",
}: CurrencyPriceInputProps) {

  const [filteredOptions, setFilteredOptions] = useState<Currency[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>(currencies[0] || defaultCurrency);
  const [amount, setAmount] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(2); // Start from page 2 assuming first page is already loaded
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (!Array.isArray(filteredOptions) || filteredOptions.length === 0) {
      return;
    }
    if (!currencyValue) {
      setCurrency(filteredOptions[0]);

      if (onCurrencyChange) onCurrencyChange(filteredOptions[0]);
      return;
    }
    if (typeof currencyValue === 'string' || typeof currencyValue === 'number') {

      const selectedCurrency = filteredOptions.find((cur) => cur?.id === currencyValue);
      if (selectedCurrency) {
        setCurrency(selectedCurrency);
        if (onCurrencyChange) onCurrencyChange(selectedCurrency);
      }
      return;
    }

    if (
      typeof currencyValue === 'object' &&
      currencyValue.hasOwnProperty('symbol')
    ) {
      setCurrency(currencyValue);
      if (onCurrencyChange) onCurrencyChange(currencyValue);
    }
  }, [currencyValue, filteredOptions]);

  useEffect(() => {
    if (typeof amountValue === "undefined") {
      return;
    }
    if (amountValue === null) {
      return;
    }
    setAmount(amountValue?.toString() || "");
  }, [amountValue]);

  // Fetch currencies from API
  const fetchCurrencies = async (query: Record<string, string | number | boolean> = {
    page: 1,
    page_size: 10,
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
      setFilteredOptions(response.data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  useEffect(() => {
    initialiseCurrencies();
  }, []);

  useEffect(() => {
    if (currencies.length > 0) {
      setCurrency(currencies[0]);
      setFilteredOptions(currencies);
      setPage(2);
      setHasMore(true);
    }
  }, [currencies]);

  useEffect(() => {
    if (!dropdownRef.current) return;
    const handleScroll = async () => {
      const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current!;
      if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
        setLoading(true);
        let response;
        if (typeof onLoadMore === "function") {
          response = await onLoadMore(page);
        } else {
          response = await fetchCurrencies(
            { page }
          );
        }
        if (response?.data?.length) {
          setFilteredOptions((prev) => [...prev, ...response.data]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
        setLoading(false);
      }
    };

    const currentDropdown = dropdownRef.current;
    currentDropdown.addEventListener("scroll", handleScroll);
    return () => currentDropdown.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loading, dropdownOpen]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const selectCurrency = (cur: Currency) => {
    setCurrency(cur);
    setDropdownOpen(false);
    if (onCurrencyChange) onCurrencyChange(cur);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (onAmountChange) onAmountChange(value);
  };


  async function onSearch() {
    let response = await fetchCurrencies({
      query: searchTerm,
      page: 1,
    });
    if (!response) {
      throw new Error("Failed to fetch countries");
    }
    setFilteredOptions(response.data);
  }

  useEffect(() => {
    onSearch();
  }, [searchTerm]);
  useEffect(() => {
    setFilteredOptions(filteredOptions);
  }, [filteredOptions]);

  return (
    <div className="d-flex align-items-center position-relative gap-2">
      <div className="dropdown">
        <button
          onClick={toggleDropdown}
          className={dropdownButtonClass}
          type="button"
        >
          {currency.symbol}
        </button>
        {dropdownOpen && (
          <div
            className={dropdownMenuClass}
            style={{ position: 'absolute', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', width: '250px' }}
            ref={dropdownRef}
          >
            <input
              type="text"
              className="form-control m-2"
              placeholder="Search currency"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredOptions
              .filter(cur =>
                cur.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cur.symbol.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((cur, index) => (
                <button
                  key={index}
                  className={dropdownItemClass}
                  onClick={() => {
                    selectCurrency(cur);
                    setSearchTerm(""); // Clear search on select
                  }}
                >
                  {/* {cur.symbol} {cur.code} */}
                  {`${cur.symbol} ${cur.name} (${cur?.country?.name})`}
                </button>
              ))
            }
            {loading && (
              <div className={`${dropdownItemClass} text-center text-muted`}>
                {loadingMessage}
              </div>
            )}
            {!hasMore && !loading && (
              <div className={`${dropdownItemClass} text-center text-muted`}>
                {noMoreMessage}
              </div>
            )}
          </div>
        )}
      </div>
      <input
        type="number"
        className={inputClassName}
        placeholder={placeholder}
        value={amount}
        onChange={handleAmountChange}
      />
    </div>
  );
}