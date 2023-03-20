import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';
import {Table} from '../../elements/table';
import {useNavigate} from 'react-router-dom';
import {IntervencionForm} from './intervencion-form';
import {getQueryString} from '../../utils';
import {useTranslation} from "react-i18next";

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

    const {t} = useTranslation();
    const navigate = useNavigate();

    const handleItemClick = (item: any) => {
        navigate(`/intervenciones/${item.id}/tareas`, {state: "intervenciones"});
    };

    const renderFilters = (filters: any) => {
        let render = []
        for (const key in filters) {
            render.push(<div key={key} className="flex flex-row">
                <div className="flex-1">{t(key)}</div>
                <div className="flex-1">{filters[key]}</div>
            </div>)
        }
        return render
    }

    return (
        <div className="flex h-full flex-col">

            <div className={" w-1/4 pb-8 text-xs"}>
                {renderFilters(filters)}
            </div>

            <Table
                path="/intervenciones"
                deletePath="/intervenciones"
                query={
                    selected
                        ? `${getQueryString(
                            filters
                        )}`
                        : ''
                }
                Form={IntervencionForm}
                onShow={handleItemClick}
                withPagination
                headers={[
                    {
                        key: 'id',
                        label: 'intervenciones.table.numero'
                    },
                    {
                        key: 'fecha_estimacion_inicio',
                        label: 'intervenciones.table.fecha_estimacion_inicio',
                        type: 'datetime'
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
                    },
                    {
                        key: 'horas_reales',
                        label: 'intervenciones.table.horas_reales',
                        type: 'decimal',
                        suffix: 'h',
                    }
                ]}
            />
        </div>
    );
};
