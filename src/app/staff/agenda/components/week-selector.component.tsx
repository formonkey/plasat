import {useTranslation} from 'react-i18next';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/outline';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';
import {CalendarToday} from "../../../../assets/icons/CalendarToday";
import {classNames} from "../../../utils";

export const WeekSelectorComponent = ({
                                          doDate,
                                      }: {
        doDate: (date: any) => void;
    }) => {
        dayjs.extend(localeData);
        dayjs.extend(weekday);
        dayjs.extend(isoWeek);

        const {t} = useTranslation();

        return (
            <div className={classNames(
                "flex xl:flex-row flex-col xl:justify-between w-full xl:space-x-4 xl:space-y-0 space-y-2",
            )}>
                <div className="flex items-center rounded-md shadow-sm w-full"
                >
                    <button
                        type="button"
                        // onClick={() => doDate(dayjs())}
                        onClick={() => doDate('week')}
                        className="flex flex-1 items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-700 hover:text-gray-500 focus:relative md:w-48 md:px-2 md:hover:bg-gray-50"
                    >
                        <div className={'flex space-x-2'}>
                            <div className={"text-sm font-medium text-gray-700 "}>{t('common.label.week')}</div>
                        </div>
                    </button>

                    <button
                        // onClick={() => doDate(dayjs(selectedDate).subtract(7, 'day'))}
                        onClick={() => doDate('prev')}
                        type="button"
                        className="flex items-center justify-center border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-700 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
                    >
                        <span className="sr-only">Previous month</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true"/>
                    </button>
                    <button
                        // onClick={() => doDate(dayjs(selectedDate).add(7, 'day'))}
                        onClick={() => doDate('next')}
                        type="button"
                        className="flex items-center justify-center rounded-r-md border border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-700 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
                    >
                        <span className="sr-only">Next month</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true"/>
                    </button>
                </div>

                <div className="flex items-center rounded-md shadow-sm sm:w-full xl:w-auto">
                    <button
                        type="button"
                        onClick={() => doDate('today')}
                        className="border rounded-md border-gray-300 py-2 pl-3 pr-4 bg-white w-full px-3.5 hover:bg-gray-50 hover:text-gray-900 focus:relative"
                    >
                        <div className={'flex space-x-2'}>
                            <CalendarToday color="#6b7280"/>
                            <div className={"text-sm font-medium text-gray-700 "}>{t('common.label.today')}</div>
                        </div>
                    </button>
                </div>

            </div>

        );
    }
;
