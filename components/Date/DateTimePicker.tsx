import moment from 'moment';
import React, { useEffect, useState } from 'react';

interface DateTimePickerProps {
  label?: string;
  value?: Date;
  enableRange?: boolean;
  onChange?: (dates: Date | [Date | null, Date | null]) => void;
  onSelect?: (dates: Date | [Date | null, Date | null]) => void;
}

function DateTimePicker({
  label,
  value,
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

  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        const [start, end] = value;
        setRangeStartDate(moment(start).format('YYYY-MM-DDTHH:mm'));
        setRangeEndDate(moment(end).format('YYYY-MM-DDTHH:mm'));
      } else {
        setSingleDate(moment(value).format('YYYY-MM-DDTHH:mm'));
      }
    }
  }, [value]);


  return (
    <div>
      {enableRange ? (
        <div>
          <div className='floating-input'>
            <label htmlFor='start-date'>Start Date</label>
            <input
              className="form-control"
              id='start-date'
              type="datetime-local"
              value={rangeStartDate}
              onChange={handleRangeStartChange}
            />
          </div>
          <div className='floating-input'>
            <label htmlFor='end-date' >End Date</label>
            <input
              className="form-control"
              id='end-date'
              type="datetime-local"
              value={rangeEndDate}
              onChange={handleRangeEndChange}
            />
            {/* <button onClick={handleRangeSelect}>Select Range</button> */}
          </div>
        </div>
      ) : (
        <div className='floating-input'>
          {label && <label htmlFor='date' className='fw-bold'>{label}</label>}
          <input
            id='date'
            className="form-control"
            type="datetime-local"
            value={singleDate}
            onChange={handleSingleChange}
          />
          {/* <button onClick={handleSingleSelect}>Select Date</button> */}
        </div>
      )}
    </div>
  );
}

export default DateTimePicker;
