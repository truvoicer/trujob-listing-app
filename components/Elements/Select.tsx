import { randomStr } from "@/helpers/utils";

export type TextInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
  label?: string;
  error?: string | null;
  options?: Array<{ label: string; value: string }>;
};
function Select({
  options = [],
  value = "",
  onChange,
  placeholder = "Enter text",
  label = "",
  name,
  error = null,
}: TextInputProps) {
  const id = randomStr(5);
  return (
    <>
    <div className="floating-input form-group">
      <select
        id={id}
        name={name}
        className="form-control"
        onChange={onChange}
        value={value}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
    </div>
    {error && <div className="text-danger">{error}</div>}
    </>
  );
}

export default Select;
