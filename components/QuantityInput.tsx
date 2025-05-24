import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

type QuantityInputProps = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (newValue: number) => void;
  onIncrease?: (newValue: number) => void;
  onDecrease?: (newValue: number) => void;
  disabled?: boolean;
};

function QuantityInput(props: QuantityInputProps) {
  const {
    value,
    min = 1,
    max = Infinity,
    step = 1,
    onChange,
    onIncrease,
    onDecrease,
    disabled = false,
  } = props;

  const [inputValue, setInputValue] = useState<string>(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  function clamp(val: number): number {
    return Math.max(min, Math.min(max, val));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const newValue = e.target.value;
    setInputValue(newValue);
    const parsed = parseInt(newValue, 10);
    if (!isNaN(parsed)) {
      const clamped = clamp(parsed);
      onChange(clamped);
    }
  }

  function handleIncrease(): void {
    const newValue = clamp(value + step);
    onChange(newValue);
    if (onIncrease) onIncrease(newValue);
  }

  function handleDecrease(): void {
    const newValue = clamp(value - step);
    onChange(newValue);
    if (onDecrease) onDecrease(newValue);
  }

  return (
    <div className="input-group" style={{ width: '140px' }}>
      <span
        className={`input-group-text ${disabled || value <= min ? 'text-muted' : 'cursor-pointer'}`}
        onClick={!disabled && value > min ? handleDecrease : undefined}
        style={{ cursor: disabled || value <= min ? 'not-allowed' : 'pointer' }}
        role="button"
        aria-label="Decrease quantity"
      >
        <FontAwesomeIcon icon={faMinus} />
      </span>
      <input
        type="text"
        className="form-control text-center"
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        aria-label="Quantity input"
      />
      <span
        className={`input-group-text ${disabled || value >= max ? 'text-muted' : 'cursor-pointer'}`}
        onClick={!disabled && value < max ? handleIncrease : undefined}
        style={{ cursor: disabled || value >= max ? 'not-allowed' : 'pointer' }}
        role="button"
        aria-label="Increase quantity"
      >
        <FontAwesomeIcon icon={faPlus} />
      </span>
    </div>
  );
}

export default QuantityInput;
