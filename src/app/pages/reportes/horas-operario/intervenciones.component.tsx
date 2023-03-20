import {useEffect, useState} from 'react';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';
import {Table} from '../../../elements/table';
import {useNavigate} from 'react-router-dom';
import {getQueryString, noop} from '../../../utils';
import {DateRangePicker} from '../../../elements/date-range-picker';

export const IntervencionesComponent = ({
                                            filters,
                                            doFilter = noop
                                        }: {
    filters: any;
    doFilter?: (filters: any) => void;
}) => {
    dayjs.extend(localeData);
    dayjs.extend(weekday);
    dayjs.extend(isoWeek);

    const navigate = useNavigate();

    const [theQuery, setTheQuery] = useState<string>('&');

    useEffect(() => {
        setTheQuery(`${getQueryString(filters)}&`);
    }, [filters]);

    const handleDates = (dates: any) => {
        if (dates) {
            if (Array.isArray(dates)) {
                const start = dayjs(dates[0]);
                const end = dates[1]
                    ? dayjs(dates[1]).add(1, 'day')
                    : dayjs(dates[0]).add(1, 'day');
                if (dates[1]) {
                    doFilter({
                        start_date: `${start.format('YYYY-MM-DD')}`,
                        end_date: `${end.format('YYYY-MM-DD')}`
                    });
                }
            }
        } else {
            doFilter({});
        }
    };

    const handleItemClick = (item: any) => {
        navigate(`/intervenciones/${item.id}`);
    };

    return (
        <div className="flex h-full flex-col">
            <header
                className="relative flex flex-none items-center justify-start space-x-4 border-b border-gray-200 py-4">
                <div className="flex items-center">
                    <DateRangePicker doChange={handleDates}/>
                </div>
            </header>

            <Table
                path="/operarios/horas"
                query={theQuery}
                Form={noop()}
                onShow={handleItemClick}
                withPagination={false}
                compressed={true}
                noAction={true}
                headers={[
                    {
                        key: 'nombre',
                        label: 'operarios-horas.label.nombre',
                    },
                    {
                        key: 'intervenciones',
                        label: 'operarios-horas.label.intervenciones',
                    },
                    {
                        key: 'horas_previstas',
                        label: 'operarios-horas.label.horas_previstas',
                        type: 'decimal',
                        suffix: 'h'
                    },
                    {
                        key: 'horas_reales',
                        label: 'operarios-horas.label.horas_reales',
                        type: 'decimal',
                        suffix: 'h',
                    },
                ]}
            />
        </div>
    );
};
