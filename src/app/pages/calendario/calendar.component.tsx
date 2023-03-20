import {useEffect, useRef, useState} from 'react';
import {useHttpClient} from '../../shared/http-client';
import {toast} from 'react-toastify';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';
import {calendarEvent, WeekSelectorComponent} from './components';
import {ViewSelectorComponent} from './components/view-selector.component';
import {useNavigate} from 'react-router-dom';

import FullCalendar, {EventClickArg} from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import {useModal} from '../../shared/modals';
import {CalendarEventCard} from './components/calendar-event-card';
import {useDrawer} from '../../shared/drawer';
import {IntervencionForm} from '../intervenciones/intervencion-form';
import {estatusTextColor, getQueryString, noop} from '../../utils';

export const CalendarComponent = ({
                                      selected,
                                      filters,
                                      refresh,
                                      onEvent = noop,
                                      doClose = noop,
                                  }: {
    selected: string | null | undefined;
    filters: any;
    refresh: string | null | undefined;
    onEvent: () => void;
    doClose: () => void;
}) => {
    dayjs.extend(localeData);
    dayjs.extend(weekday);
    dayjs.extend(isoWeek);

    const navigate = useNavigate();
    const calendar = useRef<any>();
    const {api, state} = useHttpClient();
    const {open: openModal, close: closeModal} = useModal();
    const {open, close} = useDrawer();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const filterString = getQueryString(filters);
        setSelected(filterString);
    }, [selected, filters, refresh]);

    const setSelected = (filterString: string = '') => {
        if (selectedDate) {
            // setSelectedDate(dayjs(selected));
            api(
                `/intervenciones/calendario/?${filterString}&limit=9999&desde=${dayjs(
                    selectedDate
                ).format('YYYY-MM-DD')}`,
                'GET'
            );
        } else {
            api(
                `/intervenciones/calendario/?${filterString}&limit=9999&desde=${dayjs().format(
                    'YYYY-MM-DD'
                )}`,
                'GET'
            );
        }
    };

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('calendario')) {
                setData([
                    ...state.data.results.map((item: any) => ({
                        ...item,
                        start: item.fecha_estimacion_inicio,
                        end: item.fecha_estimacion_final,
                        title: `${item.cliente?.name}`,
                        backgroundColor: 'transparent',
                        textColor: estatusTextColor(item),
                        borderColor: 'transparent'
                    }))
                ]);
                calendar.current.getApi().refetchEvents()
            }

            if (state.path.includes('intervenciones')) {
                if (!("results" in state.data)) {
                    // is a delete event
                    closeModal();
                    onEvent();
                    // window.location.reload();
                }
            }
        }

        if (state.error) {
            toast.error(state.error.detail.detail);
            closeModal()
        }
    }, [state]);

    const handleDate = (date: any) => {
        setSelectedDate(dayjs(date.start));
        api(
            `/intervenciones/calendario/?limit=9999&desde=${dayjs(date.start).format(
                'YYYY-MM-DD'
            )}`,
            'GET'
        );
    };

    const handleSelectDate = (date: string) => {
        if (calendar.current) {
            const API = calendar.current.getApi();
            if (date === 'prev') {
                API.prev();
            } else if (date === 'next') {
                API.next();
            } else if (date === 'today') {
                API.today();
            }
            setSelectedDate(dayjs(API.getDate()));
        }
    };

    const handleRefresh = () => {
        setSelected();
        close();
    };

    const handleEdit = (event: any) => {
        open(
            'intervenciones.form.edit-item',
            <IntervencionForm
                item={{id: event.id, ...event.extendedProps}}
                close={handleRefresh}
                cancel={() => close()}
            />
        );
    };

    const handleDelete = (item: any) => {
        openModal('error', {
            title: 'common.modal.delete',
            message: 'common.modal.validate-delete',
            onAccept: () => {
                api(`/intervenciones/${item.id}/`, 'DELETE');
                // closeModal();
                // // window.location.reload();
                // onEvent();
            }
        });
    };
    const handleClose = () => {
        doClose();
        // window.location.reload();
    };

    const handleItemClick = (item: EventClickArg) => {
        openModal(
            'custom',
            {
                title: 'Intervención',
                message: ''
            },
            <CalendarEventCard
                evento={item}
                navigate={navigate}
                close={closeModal}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
    };

    return (
        <div className={'flex flex-col space-y-4'}>
            <header
                className="relative flex flex-none items-center justify-start space-x-4 border-b border-gray-200 py-4">
                <ViewSelectorComponent
                    selected={selectedDate.format('YYYY-MM-DD')}
                />
                <WeekSelectorComponent
                    selectedDate={selectedDate.format('YYYY-MM-DD')}
                    doDate={handleSelectDate}
                />
            </header>

            <FullCalendar
                ref={calendar}
                headerToolbar={false}
                locales={allLocales}
                locale={'es'}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={[...data]}
                eventContent={calendarEvent}
                eventClick={handleItemClick}
                datesSet={handleDate}
                slotMinTime={'07:00'}
                slotMaxTime={'21:00'}
                height={'auto'}
                allDaySlot={false}
                dateClick={(info) => {
                    if (info.jsEvent.detail === 2) {
                        open(
                            'calendario.form.new-item',
                            <IntervencionForm close={handleClose} item={{fecha_estimacion_inicio: info.date}}
                                              cancel={() => handleClose()}/>,
                            true,
                            '2xl'
                        );
                    }
                }}
            />
        </div>
    );
};
