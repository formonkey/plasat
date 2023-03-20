import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';
import {WeekSelectorComponent} from './components';
import 'dayjs/locale/es';

import {CalendarEventCard} from './components';

export const AgendaComponent = ({onEdit, selectedDate, data, setSelectedDate}: any) => {
    dayjs.extend(localeData);
    dayjs.extend(weekday);
    dayjs.extend(isoWeek);

    const handleSelectDate = (date: string) => {
        let nextDate;
        if (date === 'prev') {
            nextDate = selectedDate.day.startOf('isoWeek').subtract(1, 'week');
            setSelectedDate({day: nextDate, type: "week"});
        } else if (date === 'next') {
            nextDate = selectedDate.day.startOf('isoWeek').add(1, 'week');
            setSelectedDate({day: nextDate, type: "week"});
        } else if (date === 'today') {
            nextDate = dayjs();
            setSelectedDate({day: nextDate, type: "today"});
        } else if (date === 'week') {
            nextDate = dayjs().startOf('isoWeek');
            setSelectedDate({day: nextDate, type: "week"});
        }
    };

    const handleEdit = (event: any) => {
        onEdit(event);
    };

    return (
        <div className={'flex flex-col h-full mt-8'}>
            <header className="p-4 border-b border-gray-dark">
                <WeekSelectorComponent
                    doDate={handleSelectDate}
                />
            </header>

            <div className="flex flex-col space-y-4 h-0 flex-grow overflow-y-auto bg-[#FAFAFA] p-4">
                <div className={"font-bold"}>{selectedDate.type === "today"
                    ? selectedDate.day.locale('es').format("DD MMMM YYYY")
                    : selectedDate.day.locale('es').startOf("isoWeek").format('DD - ') + selectedDate.day.locale('es').endOf("isoWeek").format('DD MMMM YYYY')
                }</div>

                {data?.map((evento: any, index: number) => (
                    <CalendarEventCard key={index} evento={evento} onEdit={handleEdit}/>
                ))}
            </div>

        </div>
    );
};
