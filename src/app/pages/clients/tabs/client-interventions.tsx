import React, {useEffect, useState} from 'react';

import {useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {CogIcon, FilterIcon, PlusIcon, ViewListIcon} from '@heroicons/react/outline';

import {Table} from '../../../elements/table';
import {Button} from '../../../elements/button';
import {useDrawer} from '../../../shared/drawer';
import {useHttpClient} from '../../../shared/http-client';
import {FoldableCard} from '../../../elements/foldable-card';
import {ClientsInterventionForm} from '../clients-interventions-form';
import {EquiposIntervencionForm} from '../../intervenciones/equipos-intervencion-form';
import {PaginationComponent} from "../../../shared/pagination";
import {estatusColor} from "../../../utils";
import {IntervencionFilter} from "../../intervenciones/intervencion-filter";
import {IntervencionForm} from "../../intervenciones/intervencion-form";

export const ClientInterventions = () => {
    const {id} = useParams();
    const {t} = useTranslation();
    const {open, close} = useDrawer();
    const {api, state} = useHttpClient();
    const [data, setData] = useState<any[]>([]);
    const navigate = useNavigate()

    const [page, setPage] = useState<number>(0);
    const [limit] = useState<number>(10);
    const [maxRecords, setMaxRecords] = useState<number>(0);
    const [filters, setFilters] = useState<any>({});
    const [cliente, setCliente] = useState<any>(null);

    const getIntervenciones = () => {
        const moreFilters = Object.keys(filters).length > 0 ? `&${new URLSearchParams(filters)}` : '';
        api(`/intervenciones/?cliente=${id}&limit=${limit}&offset=${page}${moreFilters}`, 'GET');
    }
    const onHandleClose = () => {
        getIntervenciones();
        close();
    };

    const onAddNew = (props: any = {}) => {
        open(
            'clients.drawer.add-interventions',
            <ClientsInterventionForm
                {...props}
                id={id}
                close={onHandleClose}
            />
        );
    };

    const onAddNewChildren = (props: any) => {
        open(
            'clients.drawer.add-instalations',
            <EquiposIntervencionForm
                {...props}
                id={id}
                close={onHandleClose}
            />
        );
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

    const handleDelete = (itemId: number | string) => {

        console.log("*** en lista", id);

        api(`/intervenciones/${itemId}`, 'DELETE');

        setTimeout(() => {
            getIntervenciones()
        }, 1000);
    };

    const handleSave = (id: number, item: any) => {
        if (id) {
            api(`/intervenciones/${id}/`, 'PATCH', item);
        } else {
            api(`/intervenciones/`, 'POST', item);
        }
    };

    useEffect(() => {
        if (id) {
            api(`/clientes/${id}/`, 'GET');
            getIntervenciones();
        }
    }, [id, filters, page]);

    // useEffect(() => {
    //     if (id) {
    //         getIntervenciones();
    //     }
    // }, [id]);
    //
    // useEffect(() => {
    //     if (id) {
    //         getIntervenciones();
    //     }
    // }, [page]);

    useEffect(() => {
        if (state.data && !state.isLoading) {
            if (state.path.includes('clientes')) {
                setCliente(state.data);
            }
            if (state.path.includes('intervenciones')) {
                setData(state.data.results);
                setMaxRecords(state.data.count);
            }
        }
    }, [state]);

    return (
        <>
            <div className="flex justify-between">
                <div className={"flex flex-row items-center "}>
                    <span className="not-italic font-normal text-xl leading-6 text-black">
                        {t('clients.tabs.intervention')}
                    </span>
                    {state.isLoading
                        ? <CogIcon className={"h-8 w-8 text-gray-400 animate-spin"}/>
                        : null
                    }
                </div>

                <div className={"flex flex-row space-x-2"}>
                    <Button
                        variant={`${
                            filters && Object.keys(filters).length === 0
                                ? 'gray'
                                : 'gray-light'
                        }`}
                        onClick={handleFilters}
                        icon={
                            <FilterIcon className="h-5 w-5 text-black mx-2"/>
                        }
                    />
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
            </div>

            {data?.length ? (
                <>
                    {data.map((item: any, index: number) => (
                        <FoldableCard
                            key={index}
                            item={item}
                            name="numero"
                            count={item?.equipos_intervencion?.length}
                            doDelete={(id) => handleDelete(id)}
                            doSave={(e) => handleSave(item.id, e)}
                            Form={() =>
                                <IntervencionForm
                                    item={item}
                                    close={onHandleClose}
                                    cancel={() => close()}
                                />}
                            doItem={() => navigate(`/intervenciones/${item.id}/tareas`)}
                            Detail={({item}: any) => (
                                <div className="flex space-x-[8px]">
                                    <ViewListIcon className="h-3 w-3 mt-[1.2px]"/>
                                    <span
                                        className={"w-8 h-4 rounded-full flex items-center justify-center"}
                                        style={{backgroundColor: estatusColor(item)}}
                                    />
                                    <span>
                                    {item.descripcion ||
                                        t('common.label.not-description')}
                                    </span>
                                </div>
                            )}
                        >
                            <Table
                                noAction
                                isParentData
                                parent={{id}}
                                Form={(props: any) =>
                                    onAddNewChildren({
                                        ...props,
                                        item,
                                        close: onHandleClose
                                    })
                                }
                                buttonLabel={t(
                                    'cliente-detail.label.add-new-equipo'
                                )}
                                parentData={item?.equipos_intervencion}
                                headers={[
                                    {
                                        key: 'name',
                                        parent: 'equipo',
                                        label: 'type-equipment.table.equipment-name'
                                    },
                                    {
                                        key: 'modelo',
                                        parent: 'equipo',
                                        label: 'type-equipment.table.equipment-model'
                                    },
                                    {
                                        key: 'descripcion',
                                        parent: 'equipo',
                                        label: 'type-equipment.table.equipment-description'
                                    }
                                ]}
                            />
                        </FoldableCard>

                    ))}

                    < PaginationComponent
                        doPage={(page: number) => setPage(page)}
                        limit={limit}
                        maxRecords={maxRecords}
                    />

                </>
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
