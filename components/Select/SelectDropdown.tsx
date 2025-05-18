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
  options: Option[];
  onChange: (selected: Option | Option[]) => void;
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
}

function SelectDropdown({
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

  useEffect(() => {
    setInternalOptions(options);
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    if (enableSearch) {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = internalOptions.filter(option =>
        option.label.toLowerCase().includes(lowerSearch)
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(internalOptions);
    }
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
      onChange(newSelection);
    } else {
      setSelectedOption(option);
      onChange(option);
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
      return selectedOption ? selectedOption.label : placeholder;
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
    !filteredOptions.find(opt => opt.label.toLowerCase() === searchTerm.toLowerCase()) && (
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
            {filteredOptions.map((option, index) => (
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
