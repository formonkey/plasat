import {EventClickArg} from '@fullcalendar/react';
import dayjs from 'dayjs';
import {
    ClockIcon,
    EyeIcon,
    FlagIcon,
    OfficeBuildingIcon,
    PencilIcon,
    TrashIcon,
    UsersIcon
} from '@heroicons/react/outline';
import {classNames, estatusCardColor} from '../../../utils';

export const CalendarEventCard = ({
                                      evento,
                                      navigate,
                                      close,
                                      onEdit,
                                      onDelete
                                  }: {
    evento: EventClickArg;
    navigate: any;
    close: () => void;
    onEdit: (event: any) => void;
    onDelete: (event: any) => void;
}) => {

    const onShow = () => {
        close();
        navigate(`/intervenciones/${evento.event.id}/tareas`, {state: "calendario"});
    };

    const handleEditAction = () => {
        close();
        setTimeout(() => {
            onEdit(evento.event);
        }, 500);
    };

    const handleDelete = () => {
        onDelete(evento.event);
    };

    return (
        <div className={'flex flex-col space-y-12'}>
            <div className={'flex self-end w-full'}>
                <div className={'flex items-center space-x-4'}>
                    <div className={'text-2xl font-bold'}>{evento.event.title}</div>

                    <div
                        className={classNames(
                            estatusCardColor(evento.event.extendedProps),
                            'flex items-center justify-center px-6 py-2 rounded-md text-xs font-bold'
                        )}
                    >
                        {evento.event.extendedProps.estado}
                    </div>
                </div>
                <div className={'flex-1'}/>
                <button className="p-2 rounded-md" onClick={onShow}>
                    <EyeIcon
                        className={classNames(
                            'h-5 w-5 ',
                            'text-gray-dark hover:text-gray-darker'
                        )}
                    />
                </button>
                <button className="p-2 rounded-md" onClick={handleEditAction}>
                    <PencilIcon
                        className={classNames(
                            'h-5 w-5 ',
                            'text-gray-dark hover:text-gray-darker'
                        )}
                    />
                </button>
                <button className="p-2 rounded-md" onClick={handleDelete}>
                    <TrashIcon
                        className={classNames(
                            'h-5 w-5 ',
                            'text-gray-dark hover:text-gray-darker'
                        )}
                    />
                </button>
            </div>

            <div className={'flex flex-col space-y-4'}>

                <div className={'flex space-x-4 items-center'}>
                    <FlagIcon className={'h-5 w-5 text-gray-darker'}/>
                    <span className={'text-sm text-gray-darker'}>
                        {evento.event.extendedProps.tipo_intervencion.name}
                    </span>
                </div>

                <div className={'flex space-x-4 items-center'}>
                    <ClockIcon className={'h-5 w-5 text-gray-darker'}/>
                    <span className={'text-sm text-gray-darker'}>
                        {dayjs(evento.event.start).format('DD/MM/YYYY, HH:mm')}
                    </span>
                </div>

                <div className={'flex space-x-4 items-center'}>
                    <OfficeBuildingIcon className={'h-5 w-5 text-gray-darker'}/>
                    <div className={'text-sm text-gray-darker'}>
                        {evento.event.extendedProps.instalacion.name}
                    </div>
                </div>

                <div className={'flex space-x-4 items-center'}>
                    <UsersIcon className={'h-5 w-5 text-gray-darker'}/>
                    <div className={'text-sm text-gray-darker'}>
                        {evento.event.extendedProps.operarios
                            .map((o: any) => o.name)
                            .join(', ')}
                    </div>
                </div>
            </div>
        </div>
    );
};
