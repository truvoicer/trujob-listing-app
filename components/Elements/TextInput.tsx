import { randomStr } from "@/helpers/utils";

export type TextInputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    name?: string;
    label?: string;
    error?: string | null;
};
function TextInput({
    value = '',
    onChange,
    placeholder = "Enter text",
    type = "text",
    label = '',
    name,
    error = null,
}: TextInputProps) {
    const id = randomStr(5);
    function getType() {
         if (type === "number") {
            return "text";
        }
        return type;
    }
    return (
        <div className="floating-input form-group">
            <input
                className="form-control"
                type={getType()}
                name={name}
                placeholder={placeholder}
                id={id}
                onChange={onChange}
                value={value} />
            <label className="form-label" htmlFor={id}>
                {label}
            </label>
            {error && <span className="text-danger">{error}</span>}
        </div>
    );
}

export default TextInput;