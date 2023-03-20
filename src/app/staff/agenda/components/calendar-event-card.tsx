import dayjs from 'dayjs';
import {
    ClockIcon,
    FlagIcon,
    OfficeBuildingIcon,
    UsersIcon
} from '@heroicons/react/outline';
import { classNames, estatusCardColor } from '../../../utils';
import React from 'react';
import { HomeStaffOperationStatus } from '../../home/constants';
import { useTranslation } from 'react-i18next';

export const CalendarEventCard = ({
    evento,
    onEdit
}: {
    evento: any;
    onEdit: (event: any) => void;
}) => {
    const { t } = useTranslation();

    const onShow = () => {
        onEdit(evento);
    };

    return (
        <div
            className={
                'flex flex-col space-y-8 shadow-md rounded-md border border-gray-300 p-4 bg-white w-full cursor-pointer'
            }
            onClick={onShow}
        >
            <div className={'w-full'}>
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex flex-col xl:flex-row xl:space-x-4 xl:items-center w-1/2 justify-start">
                        <h1 className="text-xl leading-xl font-regular">
                            #{evento.numero}
                        </h1>
                        <span
                            className={classNames(
                                'flex inline-flex mt-0.5 rounded-full items-center px-2.5 py-0.5 text-sm font-medium text-gray-900 w-fit',
                                evento.tipo_intervencion.is_preventivo
                                    ? 'bg-[#B6E4B5]'
                                    : 'bg-[#FFD059]'
                            )}
                        >
                            {evento.tipo_intervencion.name}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <HomeStaffOperationStatus
                            t={t}
                            status={evento.intervention_status}
                        />
                    </div>
                </div>
            </div>

            <div className={'flex flex-col space-y-2'}>
                <div className={'flex space-x-4 items-center'}>
                    <ClockIcon className={'h-5 w-5 text-gray-darker'} />
                    <span className={'text-sm text-gray-darker'}>
                        {dayjs(evento.fecha_estimacion_inicio).format(
                            'DD/MM/YYYY, HH:mm'
                        )}
                    </span>
                </div>

                <div className={'flex space-x-4 items-center'}>
                    <OfficeBuildingIcon
                        className={'h-5 w-5 text-gray-darker'}
                    />
                    <div className={'text-sm text-gray-darker'}>
                        {evento.instalacion.name}
                    </div>
                </div>

                <div className={'flex space-x-4 items-center'}>
                    <UsersIcon className={'h-5 w-5 text-gray-darker'} />
                    <div className={'text-sm text-gray-darker'}>
                        {evento.operarios.map((o: any) => o.name).join(', ')}
                    </div>
                </div>
            </div>
        </div>
    );
};
