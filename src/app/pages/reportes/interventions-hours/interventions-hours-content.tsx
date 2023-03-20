import {useEffect, useState} from 'react';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';
import {Table} from '../../../elements/table';
import {useNavigate} from 'react-router-dom';
import {getQueryString, noop} from '../../../utils';
import {DateRangePicker} from '../../../elements/date-range-picker';
import {useTranslation} from 'react-i18next';

export const InterventionsHoursContent = ({
                                              filters,
                                              totals,
                                              doFilter = noop
                                          }: {
    totals: any;
    filters: any;
    doFilter?: (filters: any) => void;
}) => {
    dayjs.extend(localeData);
    dayjs.extend(weekday);
    dayjs.extend(isoWeek);

    const {t} = useTranslation();
    const navigate = useNavigate();

    const [theQuery, setTheQuery] = useState<string>('');
    const [refresh, setRefresh] = useState<string | null>(null);

    useEffect(() => {
        setTheQuery(`${getQueryString(filters)}${Object.keys(filters).length > 0 ? "&" : ""}`);
    }, [filters]);

    const handleDates = (dates: any) => {
        if (dates) {
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
        } else {
            doFilter({});
            setTimeout(() => {
                setRefresh(Date.now().toString());
            }, 200);
        }
    };

    return (
        <div className="flex h-full flex-col">
            <header className="relative flex flex-none items-center justify-start space-x-4 py-4">
                <div className="flex items-center">
                    <DateRangePicker doChange={handleDates}/>
                </div>
            </header>

            <Table
                path="/intervenciones/horas"
                query={theQuery}
                refresh={refresh}
                Form={noop()}
                onShow={noop()}
                withPagination
                compressed={true}
                noAction={true}
                headers={[
                    {
                        key: 'id',
                        label: 'intervencion.form.id'
                    },
                    {
                        key: 'cliente',
                        label: 'intervention-hours.label.client-name'
                    },
                    {
                        key: 'tipo_intervencion',
                        label: 'intervention-hours.label.intervention-type'
                    },
                    {
                        key: 'fecha_real',
                        label: 'intervention-hours.label.real-date',
                        type: 'date'
                    },
                    {
                        key: 'operarios_count',
                        label: 'intervention-hours.label.operator-count',
                    },
                    {
                        key: 'horas_estimadas',
                        label: 'intervention-hours.label.estimated-hours',
                    },
                    {
                        key: 'intervencionrun_sum',
                        label: 'operarios-horas.label.horas_reales',
                        type: 'decimal',
                    },
                ]}
            />
        </div>
    );
};
