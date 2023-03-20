import {PageBody} from '../../elements/page-body';
import {IntervencionesComponent} from './intervenciones.component';
import {useSearchParams} from 'react-router-dom';
import {IntervencionForm} from './intervencion-form';
import {useDrawer} from '../../shared/drawer';
import {IntervencionFilter} from './intervencion-filter';
import {useState} from 'react';
import {PlanificarForm} from "./planificar-form";

export const Intervenciones = () => {
    const [params] = useSearchParams();
    const {open, close} = useDrawer();

    const [filters, setFilters] = useState<any>({});

    const handleNewAction = () => {
        open(
            'calendario.form.new-item',
            <IntervencionForm close={handleClose} cancel={() => close()}/>
        );
    };

    const handlePlanificaAction = () => {
        open(
            'calendario.form.planifica',
            <PlanificarForm close={handleClose}/>,
            true,
            '2xl'
        );
    };


    const handleClose = () => {
        close();
        window.location.reload();
    };

    const handleFilters = () => {
        open(
            'calendario.filter.title',
            <IntervencionFilter close={close} doFilter={doFilter} item={filters}/>
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
        >
            <IntervencionesComponent
                selected={params.get('selected')}
                filters={filters}
            />
        </PageBody>
    );
};
