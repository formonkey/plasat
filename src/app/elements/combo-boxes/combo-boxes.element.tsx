import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

import { classNames, noop } from '../../utils';
import {useTranslation} from "react-i18next";

export const ComboBoxes = ({
    items,
    onChange = noop,
    onCreate = noop,
    name = '',
    label = ''
}: any) => {
    const {t} = useTranslation();
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<any | null>();

    const filteredPeople =
        query === ''
            ? items
            : items.filter((item: any) =>
                  item.name.toLowerCase().includes(query.toLowerCase())
              );

    useEffect(() => {
        onChange({ [name]: selected });
        setSelected(null);
    }, [selected]);

    return (
        <Combobox as="div" value={selected} onChange={setSelected}>
            <Combobox.Label className="block text-sm font-medium text-gray-700">
                {t(label)}
            </Combobox.Label>
            <div className="relative mt-1">
                <Combobox.Input
                    className="w-full border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    onChange={(event: any) => setQuery(event.target.value)}
                    displayValue={(person: any) => person?.name}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <SelectorIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                </Combobox.Button>

                {filteredPeople.length > 0 ? (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredPeople.map((item: any, index: number) => (
                            <Combobox.Option
                                key={index}
                                value={item}
                                className={({ active }) =>
                                    classNames(
                                        'relative cursor-default select-none py-2 pl-8 pr-4',
                                        active
                                            ? 'bg-primary text-white'
                                            : 'text-gray-900'
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <span
                                            className={classNames(
                                                'block truncate',
                                                selected ? 'font-bold' : ''
                                            )}
                                        >
                                            {item.name}
                                        </span>

                                        {selected && (
                                            <span
                                                className={classNames(
                                                    'absolute inset-y-0 left-0 flex items-center pl-1.5',
                                                    active
                                                        ? 'text-white'
                                                        : 'text-primary'
                                                )}
                                            >
                                                <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                        <Combobox.Option
                            onClick={onCreate}
                            className={({ active }) =>
                                classNames(
                                    'relative cursor-default select-none py-2 pl-8 pr-4',
                                    active
                                        ? 'bg-gray-300 text-gray-700'
                                        : 'text-gray-900'
                                )
                            }
                            value={null as any}
                        >
                            {({ active, selected }) => (
                                <>
                                    <span
                                        className={classNames(
                                            'block truncate',
                                            selected ? 'font-bold' : ''
                                        )}
                                    >
                                        Crear nuevo equipo
                                    </span>
                                </>
                            )}
                        </Combobox.Option>
                    </Combobox.Options>
                ) : (
                    <Combobox.Options>
                        <Combobox.Option
                            onClick={onCreate}
                            className={({ active }) =>
                                classNames(
                                    'relative cursor-default select-none py-2 pl-8 pr-4',
                                    active
                                        ? 'bg-gray-300 text-gray-700'
                                        : 'text-gray-900'
                                )
                            }
                            value={null as any}
                        >
                            {({ active, selected }) => (
                                <>
                                    <span
                                        className={classNames(
                                            'block truncate',
                                            selected ? 'font-bold' : ''
                                        )}
                                    >
                                        Crear nuevo equipo
                                    </span>
                                </>
                            )}
                        </Combobox.Option>
                    </Combobox.Options>
                )}
            </div>
        </Combobox>
    );
};
