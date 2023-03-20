import {useEffect, useState} from 'react';

import {classNames, noop} from '../../utils';

export const DatePicker = ({
                               min,
                               max,
                               name,
                               label,
                               value,
                               disabled,
                               type = 'date',
                               onChange = noop
                           }: {
    name: string;
    min?: string;
    max?: string;
    label: string;
    value?: string;
    disabled?: boolean;
    type?: 'date' | 'time';
    onChange: (item: { [key: string]: string | number | null }) => void;
}) => {
    const [defaultMin, setDefaultMin] = useState<string>();
    const [defaultMax, setDefaultMax] = useState<string>();
    const [defaultValue, setDefaultValue] = useState<string>();

    const handleChange = (e: { target: { value: string } }) => {
        onChange({[name]: e.target.value});
    };

    useEffect(() => {
        if (value) {
            if (type === 'date') {
                const temp = new Date(value);

                setDefaultValue(temp.toISOString().split('T')[0]);
            } else {
                let temp: Date | string = new Date(value);

                setDefaultValue(
                    temp.toISOString().split('T').join(' ').split('.')[0]
                );
            }
        } else {
            setDefaultValue("");
        }
    }, [value]);

    useEffect(() => {
        if (type === 'date') {
            if (min) {
                const temp = new Date(min);

                setDefaultMin(temp.toISOString().split('T')[0]);
            }

            if (max) {
                const temp = new Date(max);

                setDefaultMax(temp.toISOString().split('T')[0]);
            }
        } else {
            if (min) {
                let temp: Date | string = new Date(min);

                setDefaultMin(
                    temp.toISOString().split('T').join(' ').split('.')[0]
                );
            }

            if (max) {
                let temp: Date | string = new Date(max);

                setDefaultMax(
                    temp.toISOString().split('T').join(' ').split('.')[0]
                );
            }
        }
    }, [min, max]);

    return (
        <div className="relative mb-[16px]">
            <label className="flex-1 block text-sm font-normal leading-6 text-gray-700">
                {label}
            </label>
            <div className="flex justify-center items-center space-x-2">
                <input
                    min={defaultMin}
                    max={defaultMax}
                    disabled={disabled}
                    onChange={handleChange}
                    value={defaultValue}
                    type={type !== 'time' ? 'date' : 'datetime-local'}
                    className={classNames(
                        'w-full font-light h-[40px] border-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent outline-0 mt-1 ',
                        disabled
                            ? 'text-gray-darker bg-gray-light'
                            : 'text-gray-darker bg-white'
                    )}
                />
                <div
                    className={"block h-6 bg-red-600 flex justify-center items-center rounded-full"}
                    onClick={() => {
                        onChange({[name]: null})
                        setDefaultValue("");
                    }}>
                    <span className={"text-white text-sm p-2"}>x</span>
                </div>
            </div>
        </div>
    );
};
