import { randomStr } from "@/helpers/utils";
import moment from "moment";

export type TextInputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: 'date' | 'datetime-local' | 'time' | 'month' | 'week';
    name?: string;
    label?: string;
};
export const TextInputTypes = ['date', 'datetime-local', 'time', 'month', 'week'] as const;
function DateInput({
    value = '',
    onChange,
    placeholder = "Enter text",
    type = "date",
    label = '',
    name
}: TextInputProps) {
    const id = randomStr(5);
    if (!TextInputTypes.includes(type as typeof TextInputTypes[number])) {
        throw new Error(`Invalid type: ${type}. Must be one of ${TextInputTypes.join(', ')}`);
    }
    function getValue() {
        if (type === 'date' || type === 'month' || type === 'week') {
            return moment(value).format('YYYY-MM-DD');
        }
        if (type === 'time') {
            return moment(value, 'HH:mm').format('HH:mm');
        }
        if (type === 'datetime-local') {
            return moment(value).format('YYYY-MM-DDTHH:mm');
        }
        return value;
    }
    
    return (
        <div className="floating-input form-group">
            <input
                className="form-control"
                type={type}
                name={name}
                placeholder={placeholder}
                id={id}
                onChange={onChange}
                value={getValue()} />
            <label className="form-label" htmlFor={id}>
                {label}
            </label>
        </div>
    );
}

export default DateInput;