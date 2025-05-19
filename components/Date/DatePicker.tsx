import React, { useState } from 'react';

interface DateTimePickerProps {
  enableRange?: boolean;
  onChange?: (dates: Date | [Date | null, Date | null]) => void;
  onSelect?: (dates: Date | [Date | null, Date | null]) => void;
}

function DateTimePicker({
  enableRange = false,
  onChange,
  onSelect,
}: DateTimePickerProps) {
  const [singleDate, setSingleDate] = useState<string>('');
  const [rangeStartDate, setRangeStartDate] = useState<string>('');
  const [rangeEndDate, setRangeEndDate] = useState<string>('');

  const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSingleDate(value);
    const date = new Date(value);
    onChange?.(date);
  };

  const handleRangeStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRangeStartDate(value);
    const start = new Date(value);
    const end = rangeEndDate ? new Date(rangeEndDate) : null;
    onChange?.([start, end]);
  };

  const handleRangeEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRangeEndDate(value);
    const start = rangeStartDate ? new Date(rangeStartDate) : null;
    const end = new Date(value);
    onChange?.([start, end]);
  };

  const handleSingleSelect = () => {
    const date = new Date(singleDate);
    onSelect?.(date);
  };

  const handleRangeSelect = () => {
    const start = rangeStartDate ? new Date(rangeStartDate) : null;
    const end = rangeEndDate ? new Date(rangeEndDate) : null;
    onSelect?.([start, end]);
  };

  return (
    <div>
      {enableRange ? (
        <div>
          <input
            type="datetime-local"
            value={rangeStartDate}
            onChange={handleRangeStartChange}
          />
          <input
            type="datetime-local"
            value={rangeEndDate}
            onChange={handleRangeEndChange}
          />
          <button onClick={handleRangeSelect}>Select Range</button>
        </div>
      ) : (
        <div>
          <input
            type="datetime-local"
            value={singleDate}
            onChange={handleSingleChange}
          />
          <button onClick={handleSingleSelect}>Select Date</button>
        </div>
      )}
    </div>
  );
}

export default DateTimePicker;
