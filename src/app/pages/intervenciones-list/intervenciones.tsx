import {PageBody} from '../../elements/page-body';
import {IntervencionesComponent} from './intervenciones.component';
import {useSearchParams} from 'react-router-dom';
import {useDrawer} from '../../shared/drawer';
import {IntervencionFilter} from './intervencion-filter';
import {useState} from 'react';
import dayjs from "dayjs";

const INITIAL_FILTERS = {
    fecha_estimacion_inicio_after: dayjs().format('YYYY-MM-DD'),
    fecha_estimacion_inicio_before: dayjs().add(1, 'days').format('YYYY-MM-DD')
}

export const IntervencionesList = () => {
        const [params] = useSearchParams();
        const {open, close} = useDrawer();

        const [filters, setFilters] = useState<any>(INITIAL_FILTERS);

        const handleClose = () => {
            close();
            window.location.reload();
        };

        const handleFilters = () => {
            open(
                'calendario.filter.title',
                <IntervencionFilter close={close} doFilter={doFilter} item={filters}/>,
                true,
                '2xl'
            );
        };

        const doFilter = (filters: any) => {
            close();
            if (Object.keys(filters).length > 0) {
                setFilters(filters);
            } else {
                setFilters(INITIAL_FILTERS);
            }
        }


        return (
            <PageBody
                title={'intervenciones.text.title'}
                filterAction={handleFilters}
            >
                <IntervencionesComponent
                    selected={"true"}
                    filters={filters}
                />
            </PageBody>
        );
    }
;
