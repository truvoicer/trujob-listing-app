import { randomStr } from "@/helpers/utils";

export type TextareaProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    name?: string;
    label?: string;
};
function Textarea({
    value = '',
    onChange,
    placeholder = "Enter text",
    label = '',
    name
}: TextareaProps) {
    const id = randomStr(5);
    return (
        <div className="floating-input form-group">
            <textarea
                className="form-control"
                name={name}
                placeholder={placeholder}
                id={id}
                onChange={onChange}
                value={value}></textarea>
            <label className="form-label" htmlFor={id}>
                {label}
            </label>
        </div>
    );
}

export default Textarea;