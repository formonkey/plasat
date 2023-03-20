import { PageBody } from '../../elements/page-body';
import { CalendarComponent } from './calendar.component';
import { useSearchParams } from 'react-router-dom';
import { IntervencionForm } from '../intervenciones/intervencion-form';
import { useDrawer } from '../../shared/drawer';
import { PlanificarForm } from '../intervenciones/planificar-form';
import { useState } from 'react';
import { IntervencionFilter } from '../intervenciones/intervencion-filter';

export const Calendario = () => {
    const [params] = useSearchParams();
    const { open, close } = useDrawer();

    const [filters, setFilters] = useState<any>({});
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open(
            'calendario.form.new-item',
            <IntervencionForm close={handleClose} cancel={() => close()}/>,
            true,
            '2xl'
        );
    };

    const handlePlanificaAction = () => {
        open(
            'calendario.form.planifica',
            <PlanificarForm close={handleClose} />,
            true,
            '2xl'
        );
    };

    const handleClose = () => {
        close();
        setRefresh(Date.now().toString());
        // window.location.reload();
    };

    const handleFilters = () => {
        open(
            'calendario.filter.title',
            <IntervencionFilter close={close} doFilter={doFilter} item={filters} />
        );
    };

    const doFilter = (filters: any) => {
        close();
        setFilters(filters);
    };

    return (
        <PageBody
            title={'calendario.text.title'}
            newAction={handleNewAction}
            newActionTitle={'calendario.button.new'}
            secondaryAction={handlePlanificaAction}
            secondaryActionTitle={'calendario.button.planificar'}
            infoText={'calendario.text.infoText'}
            filterAction={handleFilters}
            filters={filters}
        >
            <CalendarComponent
                selected={params.get('selected')}
                filters={filters}
                refresh={refresh}
                onEvent={handleClose}
                doClose={handleClose}
            />
        </PageBody>
    );
};
