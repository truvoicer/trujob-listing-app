import { randomStr } from "@/helpers/utils";

export type CheckboxProps = {
    value: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    name?: string;
    label?: string;
};
function Checkbox({
    value = false,
    onChange,
    placeholder = "Enter text",
    label = '',
    name
}: CheckboxProps) {
    const id = randomStr(5);
    return (
        <div className="custom-control custom-checkbox mb-3 text-left">
            <input
                type="checkbox"
                className="custom-control-input"
                name={name}
                placeholder={placeholder}
                id={id}
                onChange={onChange}
                checked={value || false} />
            <label className="custom-control-label" htmlFor={id}>
                {label}
            </label>
        </div>
    );
}

export default Checkbox;