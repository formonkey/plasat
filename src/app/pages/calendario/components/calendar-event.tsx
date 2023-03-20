import {EventContentArg} from '@fullcalendar/react';
import dayjs from 'dayjs';
import {estatusColor} from '../../../utils';
import {Tooltip} from "../../../elements/tooltip";
import {FlagIcon, OfficeBuildingIcon, UsersIcon} from "@heroicons/react/outline";

export const calendarEvent = (eventContent: EventContentArg) => {
    return (

        <Tooltip
            content={
                <div className={'flex flex-col w-full'}>
                    <div className={'text-xs italic font-bold'}>
                        {dayjs(eventContent.event.start).format('HH:mm')}
                    </div>
                    <div className={'text-[9px] mb-1'}>{eventContent.event.title}</div>

                    <div className={'flex flex-col space-y-2'}>

                        <div className={'flex space-x-2 items-center'}>
                            <FlagIcon className={'h-4 w-4 text-gray-darker'}/>
                            <span className={'text-[9px] text-gray-darker'}>
                                    {eventContent.event.extendedProps.tipo_intervencion.name}
                                </span>
                        </div>

                        <div className={'flex space-x-2 items-center'}>
                            <OfficeBuildingIcon className={'h-4 w-4 text-gray-darker'}/>
                            <div className={'text-[9px] text-gray-darker'}>
                                {eventContent.event.extendedProps.instalacion.name}
                            </div>
                        </div>

                        <div className={'flex space-x-2 items-center'}>
                            <UsersIcon className={'h-4 w-4 text-gray-darker'}/>
                            <div className={'text-[9px] text-gray-darker'}>
                                {eventContent.event.extendedProps.operarios
                                    .map((o: any) => o.name)
                                    .join(', ')}
                            </div>
                        </div>
                    </div>

                </div>
            }
        >

            <div
                className={'flex flex-row w-full h-full space-x-1 rounded-md border-0 pr-2 m-0'}
                style={{backgroundColor: estatusColor(eventContent.event.extendedProps)}}
            >
                <div className={'text-[9px]'}>
                    <div
                        className={`w-4 h-full rounded-tl-md rounded-bl-md`}
                        style={{backgroundColor: eventContent.event.extendedProps.tipo_intervencion?.color}}>
                    </div>
                </div>
                <div className={'flex flex-col w-flex-1'}>
                    <div className={'text-xs italic font-bold'}>
                        {dayjs(eventContent.event.start).format('HH:mm')}
                    </div>
                    <div className={'text-[9px]'}>{eventContent.event.title.substring(0, 5)}</div>
                </div>
            </div>
        </Tooltip>
    );
};
