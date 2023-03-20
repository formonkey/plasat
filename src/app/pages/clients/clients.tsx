import {useEffect, useState} from 'react';

import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';

import {Table} from '../../elements/table';
import {ClientsForm} from './clients-form';
import {useDrawer} from '../../shared/drawer';
import {PageBody} from '../../elements/page-body';
import {useHttpClient} from '../../shared/http-client';
import {ClientFilterForm} from './client-filter-form';

export const Clients = ({path = '/clientes/'}: { path?: string }) => {
    const navigate = useNavigate();
    const {api, state} = useHttpClient();
    const [data, setData] = useState<any[]>([]);
    const [query, setQuery] = useState<any>('');
    const [filter, setFilter] = useState<any>({});
    const {open: openDrawer, close: closeDrawer} = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleClose = () => {
        setRefresh(Date.now().toString());
        closeDrawer();
    };

    const handleNewAction = () => {
        openDrawer(
            'clients.form.new-element',
            <ClientsForm close={handleClose}/>,
            true,
            '2xl'
        );
    };

    const onFilter = (values: any) => {
        let toQuery: any = ""
        for (const key in values) {
            if (values[key] !== '') {
                // toQuery[key] = encodeURI(values[key]);
                toQuery = toQuery + key + "=" + values[key] + "&"
            }
        }
        console.log("ON FILTER :: ", toQuery);
        setFilter(values);
        // setQuery(new URLSearchParams(toQuery));
        setQuery(toQuery);
    }

    const handleFilterAction = () => {
        openDrawer(
            'clients.form.filter',
            <ClientFilterForm item={filter} close={handleClose} onFilter={onFilter}/>
        )
    }

    useEffect(() => {
        // api(path, 'GET');
    }, []);

    useEffect(() => {
        if (!state.isLoading) {
            if (state.data) {
                if (state.path === path) {
                    if (state.data.results) {
                        setData(state.data.results);
                    }
                }
            }

            if (state.error) {
                toast.error(state.error.detail);
            }
        }
    }, [state]);

    return (
        <PageBody
            newAction={handleNewAction}
            title={'client.label.title'}
            infoText={'client.label.info'}
            newActionTitle={'common.label.add-new'}
            filterAction={handleFilterAction}
        >
            <Table
                path="/clientes"
                query={query}
                refresh={refresh}
                callBeforeDrawerClosed={handleClose}
                Form={ClientsForm}
                onShow={(item: { id: number }) =>
                    navigate(`/clients/${item.id}`)
                }
                withPagination
                headers={[
                    {
                        key: 'codigo',
                        label: 'clients.table.code'
                    },
                    {
                        key: 'name',
                        label: 'clients.table.name'
                    },
                    {
                        key: 'city',
                        label: 'clients.table.city'
                    },
                    {
                        key: 'province',
                        label: 'clients.table.province'
                    },
                    {
                        key: 'activo',
                        label: 'clients.table.activo'
                    }
                ]}
            />
        </PageBody>
    );
};
