import DatePicker from 'react-datepicker';
import React, { forwardRef, useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import {format, formatISO, setHours, setMinutes} from 'date-fns';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { noop } from '../../utils';
import dayjs from "dayjs";

setDefaultLocale('es');
registerLocale('es', es);

export function DateTimePicker({
    min,
    max,
    name,
    label,
    value,
    type = 'date',
    onChange = noop,
    onBlur = noop,
    withTimeControl = true,
}: {
    name: string;
    min?: string;
    max?: string;
    label: string;
    value?: string | null;
    type?: 'date' | 'time';
    onChange: (item: { [key: string]: string | number | null }) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    withTimeControl?: boolean;
}) {
    const [currentHour, SetCurrentHour] = useState<number>(new Date().getHours());
    const [defaultMin, setDefaultMin] = useState<Date | null | undefined>();
    const [defaultMax, setDefaultMax] = useState<Date | null | undefined>();
    const [defaultValue, setDefaultValue] = useState<
        Date | string | null | undefined
    >();

    const handleChange = (date: any) => {
        onChange({ [name]: date ? formatISO(date) : null });
    };

    useEffect(() => {
        if (value) {
            if (type === 'date') {
                const temp = new Date(value);
                setDefaultValue(temp);
            } else {
                let temp: Date | string | null = new Date(value);
                setDefaultValue(temp);
            }
        } else {
            setDefaultValue(value);
        }
    }, [value]);

    useEffect(() => {
        if (type === 'date') {
            if (min) {
                const temp = new Date(min);

                setDefaultMin(temp);
            }

            if (max) {
                const temp = new Date(max);

                setDefaultMax(temp);
            }
        } else {
            if (min) {
                let temp: Date | string = new Date(min);
                setDefaultMin(temp);
            }

            if (max) {
                let temp: Date | string = new Date(max);
                setDefaultMax(temp);
            }
        }
    }, [min, max]);

    return (
        <div className="relative mb-[24px]">
            <label className="block text-sm font-normal leading-6 text-gray-700">
                {label}
            </label>

            <DatePicker
                selected={defaultValue as any}
                onChange={(date) => handleChange(date)}
                onBlur={onBlur}
                minDate={defaultMin as any}
                selectsStart
                // showTimeInput={type === 'time'}
                showTimeSelect
                timeIntervals={30}
                locale={es}
                dateFormat={'yyyy/MM/dd, HH:mm'}
                endDate={defaultMax as any}
                nextMonthButtonLabel=">"
                previousMonthButtonLabel="<"
                // popperClassName="react-datepicker-left"
                customInput={<ButtonInput />}
                // customTimeInput={type === 'time' ? <TimeInput /> : null}
                minTime={setHours(setMinutes(new Date(), 0), (withTimeControl && dayjs().isSame(dayjs(value), 'day') && +currentHour > 7) ? currentHour : 7)}
                maxTime={setHours(setMinutes(new Date(), 30), 20)}
                isClearable
                renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled
                }) => (
                    <div className="flex items-center justify-between px-2 py-2">
                        <span className="text-lg text-gray-700">
                            {format(date, 'MMMM yyyy', { locale: es })}
                        </span>

                        <div className="space-x-2">
                            <button
                                onClick={decreaseMonth}
                                disabled={prevMonthButtonDisabled}
                                type="button"
                                className={`
                                            ${
                                                prevMonthButtonDisabled &&
                                                'cursor-not-allowed opacity-50'
                                            }
                                            inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                                        `}
                            >
                                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                            </button>

                            <button
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}
                                type="button"
                                className={`
                                            ${
                                                nextMonthButtonDisabled &&
                                                'cursor-not-allowed opacity-50'
                                            }
                                            inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                                        `}
                            >
                                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            />
        </div>
    );
}

const ButtonInput = forwardRef<any, any>(({ value, onClick }, ref) => {
    return (
        <button
            onClick={onClick}
            ref={ref}
            type="button"
            className="inline-flex justify-start w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
        >
            {value
                ? format(new Date(value), 'dd MMMM yyyy, HH:mm', { locale: es })
                : '-'}
        </button>
    );
});

const TimeInput = forwardRef<any, any>(({ value, onChange }, ref) => {
    return (
        <input
            type="time"
            ref={ref}
            className={
                'flex border border-gray-300 rounded-md shadow-sm px-4 py-2 w-full'
            }
            name="time-input"
            onChange={(e) => onChange(e.target.value)}
            value={value}
        />
    );
});
