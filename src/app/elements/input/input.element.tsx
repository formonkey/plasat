import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {classNames, noop} from '../../utils';

export const Input = ({
                          name,
                          type,
                          label,
                          value,
                          shower,
                          disabled,
                          forceWidth,
                          extraHolder,
                          placeholder,
                          onChange = noop,
                          onFocus = noop,
                          onBlurChange = noop
                      }: {
    type: string;
    name: string;
    value: string | number;
    label?: string;
    shower?: boolean;
    disabled?: boolean;
    extraHolder?: string;
    placeholder?: string;
    forceWidth?: number;
    onChange?: (item: { [key: string]: string | number }) => void;
    onFocus?: (value: any) => void;
    onBlurChange?: (item: { [key: string]: string | number }) => void;
}) => {
    const {t} = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [defaultValue, setDefaultValue] = useState(value);
    const [ref, setRef] = useState<HTMLInputElement | null>(null);
    const [show, setShow] = useState(false);

    const handleChange = (e: { target: { value: string } }) => {
        setDefaultValue(e.target.value);
        onChange({[name]: e.target.value});
    };

    const handleBlur = (e: { target: { value: string } }) => {
        setIsEditing(false);
        onBlurChange({[name]: e.target.value});
    };

    const handleFocus = () => {
        if (onFocus !== noop) {
            setDefaultValue("");
            onFocus(null);
        }
    };

    useEffect(() => {
        if (isEditing) {
            ref?.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        setDefaultValue(value);
    }, [value]);

    return (
        <div
            className={`${shower ? 'mb-0' : 'w-full  mb-[16px]'}`}
            style={{width: forceWidth ? `${forceWidth}ch` : '100%'}}
        >
            {!shower && label && (
                <label
                    htmlFor={`${type}-${name}`}
                    className="block text-sm font-normal leading-6 text-gray-700"
                >
                    {t(label)}
                </label>
            )}
            <div
                className={classNames(
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent outline-0',
                    shower
                        ? !isEditing
                            ? 'mt-1 relative'
                            : 'mt-1 relative border border-gray-dark rounded-sm'
                        : 'mt-1 relative border border-gray-dark rounded-sm'
                )}
                onClick={() => {
                    if (shower) {
                        setIsEditing(true);
                    }
                }}
            >
                <input
                    type={type === 'password'
                        ? show
                            ? 'text'
                            : 'password'
                        : type
                    }
                    name={name}
                    value={defaultValue || ''}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    // defaultValue={defaultValue}
                    id={`${type}-${name}`}
                    onChange={handleChange}
                    placeholder={t(placeholder || '')}
                    ref={(ref) => setRef(ref)}
                    disabled={disabled || (shower && !isEditing)}
                    className={classNames(
                        'block w-full pl-[12px] h-[40px] font-light outline-0 border-transparent focus:border-transparent',
                        extraHolder ? 'pr-12' : 'pr-[12px]',
                        disabled
                            ? 'text-gray-darker bg-gray-light'
                            : shower
                                ? ''
                                : 'bg-white text-gray-darker',
                        shower
                            ? !isEditing
                                ? 'font-bold text-black leading-6 text-[16px] border-0 bg-transparent pl-0 pr-0 '
                                : 'leading-6 outline-0 border-transparent bg-transparent pl-0 pr-0 focus:border-transparent not-italic font-light text-sm text-gray-darker'
                            : ''
                    )}
                />

                {type === 'password' && (
                    <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">

                        <svg
                            className={classNames(
                                "h-4 text-gray-400 cursor-pointer",
                                show ? "hidden" : "block"
                            )}
                            fill="none"
                            onClick={() => setShow(!show)}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512">
                            <path fill="currentColor"
                                  d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
                            </path>
                        </svg>

                        <svg
                            className={classNames(
                                "h-4 text-gray-400 cursor-pointer",
                                show ? "block" : "hidden"
                            )}
                            onClick={() => setShow(!show)}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 512">
                            <path fill="currentColor"
                                  d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z">
                            </path>
                        </svg>

                    </div>
                )}

                {extraHolder && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">
                            {extraHolder}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
