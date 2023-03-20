import {useState} from 'react';
import {useDrawer} from '../../shared/drawer';
import {PageBody} from '../../elements/page-body';
import {EquipoForm} from './equipo-form';
import {Table} from "../../elements/table";
import {EquipoFilter} from "./equipo-filter";

export const Equipos = () => {
    const {open, close} = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);
    const [filters, setFilters] = useState<any>({});
    const [query, setQuery] = useState<any>('');

    const handleNewAction = () => {
        open('equipo.form.new-item', <EquipoForm close={handleClose}/>);
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    const handleFilters = () => {
        open(
            'equipo.filter.title',
            <EquipoFilter close={close} doFilter={doFilter} item={filters}/>
        );
    };

    const doFilter = (filters: any) => {
        close();
        setFilters(filters);
        setQuery(new URLSearchParams(filters));
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'equipo.text.title'}
            infoText={'equipo.text.infoText'}
            newActionTitle={'equipo.button.new'}
            filterAction={handleFilters}
            filters={filters}
        >
            <Table
                path="/equipos"
                deletePath="/equipos"
                query={"limit=999999&" + query}
                callBeforeDrawerClosed={handleClose}
                Form={EquipoForm}
                refresh={refresh}
                headers={[
                    {
                        key: 'name',
                        label: 'Nombre'
                    },
                    {
                        key: 'modelo',
                        label: 'Modelo'
                    },
                    {
                        key: 'descripcion',
                        label: 'Descripcion',
                    },
                    {
                        key: 'observaciones',
                        label: 'Observaciones'
                    },
                    {
                        key: 'tipo_equipo',
                        label: 'Tipo equipo'
                    },
                ]}
            />
        </PageBody>
    );
};
