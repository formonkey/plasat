import {useState} from 'react';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';
import {ViewSelectorComponent} from '../calendario/components/view-selector.component';
import {WeekSelectorComponent} from '../calendario/components';
import {Table} from '../../elements/table';
import {useNavigate} from 'react-router-dom';
import {IntervencionForm} from './intervencion-form';
import {getQueryString} from '../../utils';

export const IntervencionesComponent = ({
                                            selected,
                                            filters
                                        }: {
    selected: string | null | undefined;
    filters: any;
}) => {
    dayjs.extend(localeData);
    dayjs.extend(weekday);
    dayjs.extend(isoWeek);

    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(dayjs());

    const handleDate = (date: string) => {
        if (date === 'prev') {
            setSelectedDate(selectedDate.add(-1, 'week'));
        } else if (date === 'next') {
            setSelectedDate(selectedDate.add(1, 'week'));
        } else if (date === 'today') {
            setSelectedDate(dayjs());
        }
    };

    const handleItemClick = (item: any) => {
        navigate(`/intervenciones/${item.id}/tareas`, {state: "intervenciones"});
    };

    return (
        <div className="flex h-full flex-col">
            <header
                className="relative flex flex-none items-center justify-start space-x-4 border-b border-gray-200 py-4">
                <div className="flex items-center">
                    <ViewSelectorComponent
                        selected={selectedDate.format('YYYY-MM-DD')}
                    />
                </div>
                <div className="flex items-center">
                    <WeekSelectorComponent
                        selectedDate={selectedDate}
                        doDate={handleDate}
                    />
                </div>
            </header>

            <Table
                path="/intervenciones/calendario"
                deletePath="/intervenciones"
                query={
                    selected
                        ? `${getQueryString(
                            filters
                        )}&desde=${selectedDate.format('YYYY-MM-DD')}`
                        : ''
                }
                Form={IntervencionForm}
                onShow={handleItemClick}
                withPagination
                headers={[
                    {
                        key: 'fecha_estimacion_inicio',
                        label: 'intervenciones.table.fecha_estimacion_inicio',
                        type: 'datetime'
                    },
                    {
                        key: 'fecha_estimacion_final',
                        label: 'intervenciones.table.fecha_estimacion_final',
                        type: 'datetime'
                    },
                    {
                        key: 'numero',
                        label: 'intervenciones.table.numero'
                    },
                    {
                        key: 'cliente',
                        label: 'intervenciones.table.cliente'
                    },
                    {
                        key: 'instalacion',
                        label: 'intervenciones.table.instalacion'
                    },
                    {
                        key: 'tipo_intervencion',
                        label: 'intervenciones.table.tipo_intervencion'
                    },
                    {
                        key: 'operarios',
                        label: 'intervenciones.table.operarios'
                    },
                    {
                        key: 'estado',
                        type: 'tag',
                        label: 'intervenciones.table.estado'
                    }
                ]}
            />
        </div>
    );
};
