import {CheckIcon, XIcon} from '@heroicons/react/outline';
import {classNames, estatusCardColor, estatusTextColorRendered} from '../../utils';
import dayjs from 'dayjs';
import {NumericFormat} from "react-number-format";

export const renderItem = (item: any, include?: string[], cls?: string) =>
    (include?.length ? include : Object.keys(item)).map((key, index) => {
        if (
            !Array.isArray(item[key]) &&
            (include ? include?.includes(key) : true)
        ) {
            return (
                <td
                    key={index}
                    className={classNames(
                        'whitespace-nowrap py-2 px-3 text-sm text-black',
                        cls ?? ''
                    )}
                >
                    {typeof item[key] === 'object' ? (
                        item[key]?.name || '-'
                    ) : key === 'color' ? (
                            <div className={`w-6 h-6 rounded-md`} style={{backgroundColor: item[key]}}></div>
                        )
                        : typeof item[key] === 'boolean' ? (
                            item[key] ? (
                                <CheckIcon
                                    className={
                                        'h-5 w-5 p-1 text-white rounded-full bg-green-400'
                                    }
                                />
                            ) : (
                                <XIcon
                                    className={
                                        'h-5 w-5 p-1 text-white rounded-full bg-red-600'
                                    }
                                />
                            )
                        ) : typeof item[key] === 'string' &&
                        item[key].includes('http') ? (
                            <img
                                alt={item[key]}
                                className={'h-16 w-16'}
                                src={item[key]}
                            />
                        ) : (
                            key.includes('.')
                                ? item[key.split('.')[0]][key.split('.')[1]].name
                                : item[key] || '-'
                        )}
                </td>
            );
        }
    });

export const renderTableItem = (
    item: any,
    include?: {
        key: string;
        label: string;
        width?: string;
        type?: string;
        parent?: string;
        subKey?: string;
        suffix?: string;
    }[],
    cls?: string
) => {
    return (
        include?.length
            ? include.map((header) => header.key)
            : Object.keys(item)
    ).map((key, index) => {
        const header = include?.[index];

        if (header?.parent) {
            item = item?.[header.parent] || item;
        }

        if (
            !Array.isArray(item[key])
            /*&&
            (include
                ? include.map((header) => header.key)?.includes(key)
                : true)*/
        ) {
            return (
                <td
                    key={index}
                    className={classNames(
                        'py-2 px-3 text-sm text-black',
                        cls ?? ''
                    )}
                >
                    {typeof item[key] === 'object' ? (
                        item[key]?.[header?.subKey ?? 'name'] || '-'
                    ) : typeof item[key] === 'boolean' ? (
                        item[key] ? (
                            <CheckIcon
                                className={
                                    'h-5 w-5 p-1 text-white rounded-full bg-green-400'
                                }
                            />
                        ) : (
                            <XIcon
                                className={
                                    'h-5 w-5 p-1 text-white rounded-full bg-red-600'
                                }
                            />
                        )
                    ) : typeof item[key] === 'string' &&
                    item[key].includes('http') ? (
                        <img
                            alt={item[key]}
                            className={'h-16 w-16'}
                            src={item[key]}
                        />
                    ) : header?.type === 'color' ? (
                        <div className={`w-6 h-6 rounded-md`} style={{backgroundColor: item[key]}}></div>
                    ) : header?.type === 'datetime' ? (
                        dayjs(item[key]).format('DD/MM/YYYY, HH:mm')
                    ) : header?.type === 'date' ? (
                        dayjs(item[key]).format('DD/MM/YYYY')
                    ) : header?.type === 'tag' ? (
                        <span
                            className={classNames(
                                'inline-block rounded-md px-3 py-1 text-sm font-semibold mr-2',
                                estatusCardColor(item),
                                estatusTextColorRendered(item)
                            )}
                        >
                            {item[key]}
                        </span>
                    ) : header?.type === 'decimal' ? (
                        item[key] ? item[key]?.toFixed(2) + ` ${header?.suffix ? header?.suffix : ''}` : "-"
                    ) : header?.type === 'currency' ? (
                        <NumericFormat
                            value={item[key].toFixed(2)}
                            valueIsNumericString={true}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowedDecimalSeparators={['.', ',']}
                            displayType={"text"}
                            decimalScale={2}
                            suffix={` ${header?.suffix ? header?.suffix : '€'}`}
                        />
                    ) : (
                        item[key] || '-'
                    )}
                </td>
            );
        } else {
            return (
                <td
                    key={index}
                    className={classNames(
                        'whitespace-nowrap py-2 px-3 text-sm text-black',
                        cls ?? ''
                    )}
                >
                    {item[key].map((subItem: any, index: number) => {
                        return (
                            subItem?.[header?.subKey ?? 'name'] +
                            (index + 1 < +item[key].length ? ' / ' : '')
                        );
                    })}
                </td>
            );
        }
    });
};
