import { Fragment, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

import { classNames, noop } from '../../utils';

export const Select = ({
    name,
    label,
    disabled,
    value = {},
    items = [],
    placeholder,
    onChange = noop,
    noMargin = false
}: {
    name: string;
    label?: string;
    noMargin?: boolean;
    disabled?: boolean;
    placeholder?: string;
    items: { id: number | string; name: string }[];
    value?: { id?: number | string; name?: string } | any;
    onChange: (item: { [key: string]: number | string } | any) => void;
}) => {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<
        | {
              id?: number | string;
              name?: string;
          }
        | any
    >(value);

    useEffect(() => {
        if (value?.id) {
            onChange({ [name]: value?.id });
        }
    }, []);

    useEffect(() => {
        if (selected && Object.keys(selected).length) {
            // if (selected.id !== value.id && selected?.id) {
            if (selected?.id ?? null !== value?.id) {
                onChange({ [name]: selected?.id });
            }
        }
    }, [selected]);

    useEffect(() => {
        if (value?.id) {
            setSelected(value);
            onChange({ [name]: value.id });
        } else {
            const temp = items.find(
                (item: { id: string | number }) => item.id === +value
            );

            setSelected(temp);
        }
    }, [value, items]);

    return (
        <div className={classNames('w-full', noMargin ? 'mb-0' : 'mb-[24px]')}>
            <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                    <>
                        <Listbox.Label className="block text-sm font-medium text-gray-700">
                            {label}
                        </Listbox.Label>
                        <div className="mt-1 relative">
                            <Listbox.Button
                                className={classNames(
                                    disabled
                                        ? 'text-gray-darker bg-gray-light not-italic font-light text-sm leading-6 h-[40px] relative w-full border border-gray-dark shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-transparent focus:border-gray-dark text-[14px]'
                                        : 'bg-white not-italic font-light text-sm leading-6 h-[40px] relative w-full border border-gray-dark shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-transparent focus:border-gray-dark text-[14px] text-gray-darker'
                                )}
                            >
                                <span className="block truncate">
                                    {selected?.name || t(placeholder || '')}
                                </span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <SelectorIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={!disabled && open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                    {[{ id: null, name: '-' }, ...items].map(
                                        (element) => (
                                            <Listbox.Option
                                                key={element.id}
                                                className={({ active }) =>
                                                    classNames(
                                                        active
                                                            ? 'text-gray-dark bg-gray-light'
                                                            : 'text-gray-darker',
                                                        'cursor-default select-none relative py-2 pl-3 pr-9'
                                                    )
                                                }
                                                value={element}
                                            >
                                                {({ selected, active }) => (
                                                    <>
                                                        <span
                                                            className={classNames(
                                                                selected
                                                                    ? 'font-bold'
                                                                    : 'font-normal',
                                                                'block truncate'
                                                            )}
                                                        >
                                                            {element.name}
                                                        </span>

                                                        {selected ? (
                                                            <span
                                                                className={classNames(
                                                                    active
                                                                        ? 'text-gray-dark bg-gray-light'
                                                                        : 'text-gray-dark',
                                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                )}
                                                            >
                                                                <CheckIcon
                                                                    className="h-5 w-5"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        )
                                    )}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        </div>
    );
};
