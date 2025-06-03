import { randomStr } from "@/helpers/utils";

export type TextInputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    name?: string;
    label?: string;
};
function TextInput({
    value = '',
    onChange,
    placeholder = "Enter text",
    type = "text",
    label = '',
    name
}: TextInputProps) {
    const id = randomStr(5);
    return (
        <div className="floating-input form-group">
            <input
                className="form-control"
                type={type}
                name={name}
                placeholder={placeholder}
                id={id}
                onChange={onChange}
                value={value} />
            <label className="form-label" htmlFor={id}>
                {label}
            </label>
        </div>
    );
}

export default TextInput;