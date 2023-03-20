import {useEffect, useState} from 'react';
import {useDrawer} from '../../shared/drawer';
import {PageBody} from '../../elements/page-body';
import {PagosForm} from './pagos-form';
import {Table} from "../../elements/table";
import {PagosFilter} from "./pagos-filter";
import {PagosTotalesWidget} from "./pagos-totales-widget";

const initalSearch = {cobrado: false}

export const Pagos = () => {
    const {open, close} = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const [filters, setFilters] = useState<any>(initalSearch);
    const [query, setQuery] = useState<any>(new URLSearchParams(filters));

    const handleNewAction = () => {
        open('cobros.form.new-item', <PagosForm close={handleClose}/>);
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    const handleFilters = () => {
        open(
            'calendario.filter.title',
            <PagosFilter close={close} doFilter={doFilter} item={filters}/>
        );
    };

    const doFilter = (filters: any) => {
        console.log(filters);
        setFilters(Object.keys(filters).length > 0
            ? filters
            : filters.todos
                ? {}
                : initalSearch
        );
        close();
    };

    useEffect(() => {
        setQuery(new URLSearchParams(filters));
    }, [filters]);

    return (
        <PageBody
            newAction={handleNewAction}
            title={'cobros.text.title'}
            infoText={'cobros.text.infoText'}
            newActionTitle={'cobros.button.new'}
            filterAction={handleFilters}
        >
            <>
                <PagosTotalesWidget
                    path="/pagos"
                    query={query}
                    refresh={refresh}
                />
                <Table
                    path="/pagos"
                    query={query}
                    refresh={refresh}
                    callBeforeDrawerClosed={handleClose}
                    Form={PagosForm}
                    headers={[
                        {
                            key: 'cliente',
                            label: 'Cliente'
                        },
                        {
                            key: 'instalacion',
                            label: 'Instalación'
                        },
                        {
                            key: 'intervencion',
                            label: 'Intervención',
                            subKey: 'numero'
                        },
                        {
                            key: 'fecha_pago',
                            label: 'Fecha de Cobro',
                            type: 'date',
                        },
                        {
                            key: 'importe',
                            label: 'Importe'
                        },
                        {
                            key: 'cobrado',
                            label: 'Cobrado'
                        }
                    ]}
                />
            </>
        </PageBody>
    );
};
