import React, {useEffect, useState} from 'react';

import {PlusIcon} from '@heroicons/react/outline';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {Button} from '../../../elements/button';
import {Table} from '../../../elements/table';
import {useDrawer} from '../../../shared/drawer';
import {useHttpClient} from '../../../shared/http-client';
import {ClientsPaymentsForm} from '../clients-payments-form';

export const ClientBill = () => {
    const {id} = useParams();
    const {t} = useTranslation();
    const {open, close} = useDrawer();
    const {api, state} = useHttpClient();
    const [cliente, setCliente] = useState<any>(null);

    console.log('ClientBill #ID:', id);

    const refresh = () => {
        if (id) {
            api(`/pagos/?cliente=${id}`, 'GET');
        }
    };

    const onHandleClose = () => {
        api(`/pagos/?cliente=${id}`, 'GET');
        close();
    };

    const onAddNew = () => {
        open(
            'clients.drawer.add-payments',
            <ClientsPaymentsForm id={id} close={onHandleClose}/>
        );
    };

    useEffect(() => {
        if (id) {
            api(`/clientes/${id}/`, 'GET');
            api(`/pagos/?cliente=${id}`, 'GET');
        }
    }, [id]);

    useEffect(() => {
        if (state.data && !state.isLoading) {
            if (state.path.includes('clientes')) {
                setCliente(state.data);
            }
        }
    }, [state]);

    return id ? (
        <>
            <div className="flex justify-between">
                <span className="not-italic font-normal text-xl leading-6 text-black">
                    {t('clients.tabs.payment')}
                </span>

                {cliente?.activo
                    ? (
                        <Button
                            outlined
                            onClick={onAddNew}
                            icon={<PlusIcon className="h-5 w-5"/>}
                            label="common.label.add-new"
                        />
                    ) : null}

            </div>

            <Table
                path="/pagos"
                deletePath="/pagos"
                query={`cliente=${id}`}
                Form={(props: any) => (
                    <ClientsPaymentsForm {...props} id={id}/>
                )}
                withPagination
                refresh={refresh}
                headers={[
                    {
                        key: 'intervencion',
                        label: 'Intervención'
                    },
                    {
                        key: 'instalacion',
                        label: 'Instalación'
                    },
                    {
                        key: 'fecha_pago',
                        label: 'Fecha de Cobro'
                    },
                    {
                        key: 'importe',
                        label: 'Importe'
                    }
                ]}
            />
        </>
    ) : null;
};
