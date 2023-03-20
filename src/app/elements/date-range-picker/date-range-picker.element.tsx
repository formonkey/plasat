import DatePicker from 'react-datepicker';
import React, {useRef, useState} from 'react';
import {registerLocale, setDefaultLocale} from 'react-datepicker';
import es from 'date-fns/locale/es';
import {noop} from '../../utils';
import dayjs from "dayjs";
import {CalendarToday} from "../../../assets/icons/CalendarToday";
import {XIcon} from "@heroicons/react/outline";
import {useTranslation} from "react-i18next";

setDefaultLocale('es');
registerLocale('es', es);

export function DateRangePicker({
                                    label = 'common.labels.dates',
                                    doChange = noop,
                                }: {
    label?: string;
    doChange?: (dates: any) => void;
}) {
    const {t} = useTranslation();

    const datePickerRef = useRef<any>(null);
    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);

    const onChange = (dates: any) => {
        const [start, end] = dates;
        doChange(dates)
        setStartDate(start);
        setEndDate(end);
    };

    const handleClear = () => {
        doChange(null)
        setStartDate(null);
        setEndDate(null);
    };

    return (
        <div>
            <div className={"flex flex-row space-x-2 items-center"}>

                <div className={"flex flex-col"}>
                    <div className={"flex flex-row space-x-2 items-center"}
                         onClick={() => datePickerRef.current.setOpen(true)}
                    >
                        <label className="block text-sm font-normal leading-6 text-gray-700">
                            {t(label)}
                        </label>
                        <CalendarToday color="#6b7280"/>

                        <input
                            className={"rounded-sm"}
                            type="text"
                            onChange={(e) => onChange(e.target.value)}
                            value={startDate ? dayjs(startDate).format("DD/MM/YYYY") : ""}
                            disabled
                        />
                        <input
                            className={"rounded-sm"}
                            type="text"
                            onChange={(e) => onChange(e.target.value)}
                            value={endDate ? dayjs(endDate).format("DD/MM/YYYY") : ""}
                            disabled
                        />
                    </div>
                    <div id="date-range-picker-wrapper">
                        <DatePicker
                            id={"date-range-picker"}
                            selected={startDate}
                            onChange={onChange}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            ref={datePickerRef}
                        />
                    </div>
                </div>

                <div className={"flex bg-gray-100 hover:bg-gray-300 rounded-full p-2"}>
                    <XIcon className={"h-5 w-5 text-gray-400"} onClick={handleClear}/>
                </div>

            </div>


        </div>
    );
}
