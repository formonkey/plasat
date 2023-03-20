import {PageBody} from '../../../elements/page-body';
import {useDrawer} from '../../../shared/drawer';
import {useEffect, useState} from 'react';
import {getQueryString} from '../../../utils';
import {InterventionHoursFilters} from './interventions-hours-filters';
import {InterventionsHoursContent} from './interventions-hours-content';
import {useHttpClient} from '../../../shared/http-client';
import {toast} from 'react-toastify';

export const InterventionsHours = () => {
    const {open, close} = useDrawer();
    const {api, state} = useHttpClient();

    const [totals, setTotals] = useState(null);
    const [filters, setFilters] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    const handleFilters = () => {
        open(
            'calendario.filter.title',
            <InterventionHoursFilters
                close={close}
                doFilter={doFilter}
                item={filters}
            />
        );
    };

    const doFilter = (filters: any) => {
        close();
        console.log("DO FILTER :: ", filters);
        if (Object.keys(filters).length === 0) {
            setFilters({});
        } else {
            setFilters((prev: any) => ({...prev, ...filters}));
        }
    };

    const handleExport = () => {
        setLoading(true);
        api(
            `/intervenciones/horas_export/?${getQueryString(filters)}`,
            'GET',
            null,
            false,
            true
        );
    };

    useEffect(() => {
        api(
            `/intervenciones/horas_totales/?${getQueryString(filters)}`,
            'GET',
            null,
            false,
            true
        );
    }, [filters]);

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('horas_export')) {
                setLoading(false);
            }

            if (state.path.includes('horas_totales')) {
                setTotals(state.data.results);
            } else if (state.path.includes('intervenciones')) {
                const url = window.URL.createObjectURL(new Blob([state.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `InterventionsHoursReport_${Date.now()}.xlsx`
                );
                document.body.appendChild(link);
                link.click();
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    return (
        <PageBody
            exportAction={handleExport}
            exportStatus={loading}
            exportActionTitle={'intervenciones.button.export'}
            title={'intervention-hours.label.title'}
            infoText={'intervenciones.text.infoText'}
            filterAction={handleFilters}
        >
            <InterventionsHoursContent
                totals={totals}
                filters={filters}
                doFilter={doFilter}
            />
        </PageBody>
    );
};
