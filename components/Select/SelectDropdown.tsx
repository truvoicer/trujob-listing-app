import { parse } from 'path';
import React, { useState, useEffect, useRef } from 'react';

export interface Option {
  label: string;
  value: string;
}

export interface LaravelPaginatedResponse {
  data: Option[];
  meta: {
    current_page: number;
    last_page: number;
  };
}

export interface SelectDropdownProps {
  options: Record<string, any>[];
  parseOptions: (option: Record<string, any>) => Option;
  onChange: (selected: Option | Option[], options: Option[], rawOptions: Array<any>) => void;
  enableSearch?: boolean;
  allowNewOptions?: boolean;
  placeholder?: string;
  isMulti?: boolean;
  loadMoreLimit?: number;
  onLoadMore?: (nextPage: number) => Promise<LaravelPaginatedResponse>;
  addNewOptionPosition?: 'top' | 'bottom' | 'both';
  loadingMore?: boolean;
  loadingMessage?: string;
  showLoadingSpinner?: boolean;
  value?: number | string | Option | Option[];
  handleSearch?: (searchTerm: string) => Promise<Record<string, any>[]>;
}

function SelectDropdown({
  handleSearch,
  parseOptions,
  value,
  options,
  onChange,
  enableSearch = false,
  allowNewOptions = false,
  placeholder = 'Select...',
  isMulti = false,
  loadMoreLimit,
  onLoadMore,
  addNewOptionPosition = 'bottom',
  loadingMore = false,
  loadingMessage = 'Loading more...',
  showLoadingSpinner = false
}: SelectDropdownProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [internalOptions, setInternalOptions] = useState<Option[]>(options);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const listRef = useRef<HTMLUListElement>(null);

  function parseDataToOptions(data: Record<string, any>[]) {

    return data.map(item => parseDataItemToOptions(item));
  }
  function parseDataItemToOptions(data: Record<string, any>) {
    if (typeof parseOptions !== 'function') {
      throw new Error('parseOptions function is required');
    }
    return parseOptions(data);
  }
  useEffect(() => {
    if (value) {
      if (isMulti && Array.isArray(value)) {
        setSelectedOptions(value);
      } else if (!isMulti && !Array.isArray(value)) {
        
        if (typeof value === 'string' || typeof value === 'number') {
          const findInOptions = parseDataToOptions(options).find(option => option?.value === value);
          if (!findInOptions) {
            return;
          }
          setSelectedOption(findInOptions);
          return;
        }

        if (typeof value === 'object' && value.hasOwnProperty('value') && value.hasOwnProperty('label')) {
          setSelectedOption(value);
        }
      }
    }
  }, [value, isMulti, options]);

  async function onSearch() {
    if (!enableSearch) {
      setFilteredOptions(internalOptions);
      return;
    }
    let filtered;
    if (typeof handleSearch === 'function') {
      filtered = await handleSearch(searchTerm);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = internalOptions.filter(option =>
        parseDataItemToOptions(option).label.toLowerCase().includes(lowerSearch)
      );
    }
    setFilteredOptions(filtered);
  }

  useEffect(() => {
    setInternalOptions(options);
    setFilteredOptions(parseDataToOptions(options));
  }, [options]);
  
  useEffect(() => {
    onSearch();
  }, [searchTerm, internalOptions, enableSearch]);

  const handleSelect = (option: Option) => {
    if (isMulti) {
      const alreadySelected = selectedOptions.find(opt => opt.value === option.value);
      let newSelection;
      if (alreadySelected) {
        newSelection = selectedOptions.filter(opt => opt.value !== option.value);
      } else {
        newSelection = [...selectedOptions, option];
      }
      
      setSelectedOptions(newSelection);
      onChange(newSelection, internalOptions);
    } else {
      setSelectedOption(option);
      onChange(option, parseDataToOptions(internalOptions));
      setIsOpen(false);
    }
    setSearchTerm('');
  };

  const handleAddNew = () => {
    const newOption: Option = {
      label: searchTerm,
      value: searchTerm
    };
    handleSelect(newOption);
  };

  const isOptionSelected = (option: Option) => {
    return isMulti
      ? selectedOptions.some(selected => selected.value === option.value)
      : selectedOption?.value === option.value;
  };

  const getDisplayText = () => {
    if (isMulti) {
      return selectedOptions.length > 0
        ? selectedOptions.map(opt => opt.label).join(', ')
        : placeholder;
    } else {
      return selectedOption ? selectedOption?.label || 'Error in display text' : placeholder;
    }
  };

  const handleScroll = async () => {
    if (!listRef.current || !loadMoreLimit || !onLoadMore || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollHeight - scrollTop <= clientHeight + loadMoreLimit && (
      initialLoad ||
      (currentPage < lastPage)
    )) {

      setIsLoadingMore(true);
      try {
        const response = await onLoadMore(currentPage + 1);
        setInternalOptions(prev => [...prev, ...response.data]);
        setCurrentPage(response.meta.current_page);
        setLastPage(response.meta.last_page);
      } catch (err) {
        console.error('Load more failed', err);
      } finally {
        setIsLoadingMore(false);
        setInitialLoad(false);
      }
    }
  };

  const renderAddNewOption = () => (
    allowNewOptions && searchTerm &&
    !parseDataToOptions(filteredOptions).find(opt => opt.label.toLowerCase() === searchTerm.toLowerCase()) && (
      <li
        className="dropdown-item text-primary"
        onClick={handleAddNew}
      >
        Add "{searchTerm}"
      </li>
    )
  );

  return (
    <div className="position-relative" style={{ width: '16rem' }}>
      <div
        className="form-control d-flex align-items-center justify-content-between"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
      >
        {getDisplayText()}
        <span className="ms-2 dropdown-toggle"></span>
      </div>
      {isOpen && (
        <div className="dropdown-menu show w-100 p-2 border rounded">
          {enableSearch && (
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          <ul
            className="list-unstyled mb-0"
            style={{ maxHeight: '240px', overflowY: 'auto' }}
            onScroll={handleScroll}
            ref={listRef}
          >
            {addNewOptionPosition === 'top' || addNewOptionPosition === 'both' ? renderAddNewOption() : null}
            {parseDataToOptions(filteredOptions).map((option, index) => (
              <li
                key={index}
                className={`dropdown-item ${isOptionSelected(option) ? 'active' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}
            {addNewOptionPosition === 'bottom' || addNewOptionPosition === 'both' ? renderAddNewOption() : null}
            {(loadingMore || isLoadingMore) && (
              <li className="dropdown-item text-muted d-flex align-items-center">
                {showLoadingSpinner && (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                )}
                {loadingMessage}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SelectDropdown;
