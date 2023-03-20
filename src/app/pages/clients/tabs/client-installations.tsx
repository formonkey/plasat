import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {LocationMarkerIcon, PlusIcon} from '@heroicons/react/outline';

import {Table} from '../../../elements/table';
import {Button} from '../../../elements/button';
import {useDrawer} from '../../../shared/drawer';
import {useHttpClient} from '../../../shared/http-client';
import {FoldableCard} from '../../../elements/foldable-card';
import {ClientsInstallationsForm} from '../clients-installations-form';
import {ClientsEquiposForm} from "../clients-equipos-form";
import {ClientsInstallationsEquipmentForm} from "../clients-installations-equipment-form";
import {toast} from "react-toastify";

export const ClientInstallations = (): any => {
    const {id} = useParams();
    const {t} = useTranslation();
    const {open, close} = useDrawer();
    const {api, state} = useHttpClient();
    const [data, setData] = useState<any[]>([]);
    const [cliente, setCliente] = useState<any>(null);
    const [refresh, setRefresh] = useState<any>(null);

    const onHandleClose = () => {
        api(`/instalaciones/?limit=999999&cliente=${id}`, 'GET');
        close();
    };

    const onAddNew = (props: any = {}) => {
        open(
            'clients.drawer.add-instalations',
            <ClientsInstallationsForm
                {...props}
                id={id}
                close={onHandleClose}
            />
        );
    };

    const onAddNewChildren = (props: any) => {
        open(
            'clients.drawer.add-instalations',
            <ClientsInstallationsEquipmentForm
                {...props}
                refresh={refresh}
                id={id}
                close={onHandleClose}
            />
        );
    };

    const handleDelete = (itemId: number | string) => {
        api(`/instalaciones/${itemId}`, 'DELETE');

        setTimeout(() => {
            api(`/instalaciones/?limit=999999&cliente=${id}`, 'GET');
            setRefresh(Date.now().toString());
        }, 1000);
    };

    const handleSave = (id: number, item: any) => {
        if (id) {
            api(`/instalaciones/${id}/`, 'PATCH', item);
        } else {
            api(`/instalaciones/`, 'POST', item);
        }
    };

    useEffect(() => {
        if (id) {
            api(`/clientes/${id}/`, 'GET');
        }
    }, []);

    useEffect(() => {
        if (state.data && !state.isLoading) {
            if (state.path.includes('clientes')) {
                setCliente(state.data);
                api(`/instalaciones/?limit=999999&cliente=${id}`, 'GET');

            }
            if (state.path.includes('instalaciones')) {
                console.log("* INSTALACIONES *", state.data.results);

                setData(state.data.results);
            }
        }

        if (state.error) {
            toast.error(state.error.detail.detail);
        }

    }, [state]);

    return (
        <>
            <div className="flex justify-between">
                <span className="not-italic font-normal text-xl leading-6 text-black">
                    {t('clients.tabs.instalations')}
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

            {data?.length ? (
                data.map((item: any, index: number) => (
                    <FoldableCard
                        key={index}
                        item={item}
                        count={item?.equipos?.length}
                        forceOpen={data.length === 1}
                        doDelete={handleDelete}
                        doSave={(e) => handleSave(item.id, e)}
                        Form={() => (
                            <ClientsInstallationsForm
                                id={id ? id : 0}
                                item={item}
                                close={onHandleClose}
                            />
                        )}
                        Detail={({item}: any) => (
                            <div className="flex space-x-[8px]">
                                <LocationMarkerIcon className="h-3 w-3 mt-[1.2px]"/>
                                <span>
                                    {item.direccion ||
                                        t('common.label.not-direction')}{' '}
                                    {item.city?.name ? `${item.city.name}` : ''}{' '}
                                    {item.province?.name
                                        ? `(${item.province.name})`
                                        : ''}
                                    {item.cp ? `- ${item.cp}` : ''}
                                </span>
                            </div>
                        )}
                    >
                        <Table
                            isParentData
                            parent={{id}}
                            deletePath="/equipos-instalacion"
                            callBeforeDrawerClosed={onHandleClose}
                            Form={ClientsEquiposForm}
                            FormAdd={(props: any) =>
                                onAddNewChildren({
                                    ...props,
                                    item,
                                    close: onHandleClose
                                })
                            }
                            buttonLabel={t(
                                'cliente-detail.label.add-new-equipo'
                            )}
                            parentData={item?.equipos_instalacion}
                            headers={[
                                {
                                    key: 'equipo',
                                    label: 'common.label.equipo',
                                    subKey: 'name',
                                },
                                {
                                    key: 'ubicacion',
                                    label: 'common.label.ubicacion',
                                }
                            ]}
                        />
                    </FoldableCard>
                ))
            ) : (
                <div className="flex justify-center text-center mt-[24px]">
                    <span className="not-italic font-light text-md leading-6 text-gray-darker">
                        {t('common.message.no-data')}
                    </span>
                </div>
            )}
        </>
    );
};
