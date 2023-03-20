import { noop } from '../../utils';
export const TextArea = ({
    name,
    label,
    value,
    placeholder,
    onChange = noop
}: {
    name: string;
    label?: string;
    value: string;
    placeholder?: string;
    onChange: (item: { [key: string]: string | number }) => void;
}) => {
    // Oyal does not recognize the onChange event
    // const handleChange = (e: { target: { value: string } }) => {
    const handleChange = (e: any) => {
        onChange({ [name]: e.target.value });
    };

    return (
        <div className="mb-[24px]">
            {label && (
                <label
                    htmlFor={`text-${name}`}
                    className="block text-sm font-normal leading-6 text-gray-700"
                >
                    {label}
                </label>
            )}
            <div className="mt-1">
                <textarea
                    rows={4}
                    name={name}
                    id={`text-${name}`}
                    defaultValue={value}
                    onKeyUp={handleChange}
                    placeholder={placeholder}
                    className="shadow-sm focus:ring-transparent outline-0 block w-full border-gray-dark  text-gray-darker not-italic font-light text-sm leading-6"
                />
            </div>
        </div>
    );
};
