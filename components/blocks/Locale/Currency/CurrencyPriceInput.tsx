import truJobApiConfig from "@/config/api/truJobApiConfig";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import React, { useState, useEffect, useRef } from "react";

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
}

export default function CurrencyPriceInput({
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
  dropdownItemClass = "dropdown-item"
}: CurrencyPriceInputProps) {
  const [currency, setCurrency] = useState<Currency>(currencies[0] || defaultCurrency);
  const [amount, setAmount] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [currencyList, setCurrencyList] = useState<Currency[]>(currencies);
  const [page, setPage] = useState<number>(2); // Start from page 2 assuming first page is already loaded
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [selectedCurrencies, setSelectedCurrencies] = React.useState<Option[]>([]);

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
      setCurrencyList(response.data);
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
      setCurrencyList(currencies);
      setPage(2);
      setHasMore(true);
    }
  }, [currencies]);

  useEffect(() => {
    if (!dropdownRef.current) return;
    const handleScroll = async () => {
      const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current!;
      if (scrollTop + clientHeight >= scrollHeight - 5 && onLoadMore && hasMore && !loading) {
        setLoading(true);
        const response = await onLoadMore(page);
        if (response?.data?.length) {
          setCurrencyList((prev) => [...prev, ...response.data]);
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
  }, [onLoadMore, page, hasMore, loading]);

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
            style={{ position: 'absolute', zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
            ref={dropdownRef}
          >
            {currencyList.map((cur, index) => (
              <button
                key={index}
                className={dropdownItemClass}
                onClick={() => selectCurrency(cur)}
              >
                {cur.symbol} {cur.code}
              </button>
            ))}
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