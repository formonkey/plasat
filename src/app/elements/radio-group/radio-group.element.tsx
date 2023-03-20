import { useEffect, useState } from 'react';

export const RadioGroup = ({
    name,
    label,
    value,
    items,
    onChange
}: {
    label: string;
    name: string;
    items: { id: string | number; label: string }[];
    value: string | number;
    onChange: (item: { [key: string]: string | number }) => void;
}) => {
    const [selected, setSelected] = useState<string | number>(value);

    const handleChange = (value: string | number) => {
        setSelected(value);
        onChange({ [name]: value });
    };

    useEffect(() => {
        setSelected(value);
    }, [value]);

    return (
        <fieldset className="mb-[24px] space-y-[8px] w-full">
            <legend className="block text-sm font-normal leading-6 text-black">
                {label}
            </legend>
            <div className="space-y-[24px]">
                {items.map((item) => (
                    <div key={item.id} className="relative flex items-start">
                        <div className="flex items-center h-5 mt-[4px]">
                            <input
                                name={name}
                                type="radio"
                                id={`${item.id}-${name}`}
                                onChange={() => handleChange(item.id)}
                                defaultChecked={item.id === selected}
                                className="focus:ring-transparent h-4 w-4 text-gray-darker border-gray-dark"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label
                                htmlFor={`${item.id}-${name}`}
                                className="not-italic font-normal text-sm leading-6"
                            >
                                {item.label}
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </fieldset>
    );
};
