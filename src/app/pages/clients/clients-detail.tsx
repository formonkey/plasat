import { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';

import {
    PlusIcon,
    ChevronLeftIcon,
    LocationMarkerIcon,
    ViewListIcon
} from '@heroicons/react/outline';

import { classNames } from '../../utils';
import { Table } from '../../elements/table';
import { Button } from '../../elements/button';
import { useDrawer } from '../../shared/drawer';
import { ClientsPaymentsForm } from './clients-payments-form';
import { useHttpClient } from '../../shared/http-client';
import { ClientsInstallationsForm } from './clients-installations-form';
import { FoldableCard } from '../../elements/foldable-card';
import { ClientsInterventionForm } from './clients-interventions-form';
import { ClientsInstallationsEquipmentForm } from './clients-installations-equipment-form';
import { EquiposIntervencionForm } from '../intervenciones/equipos-intervencion-form';

export const ClientsDetail = ({ path = 'clientes' }: { path?: string }) => {
    const params = useParams();
    const route = useLocation();
    const navigate = useNavigate();

    const [enabled, setEnabled] = useState<any>({
        installation: true,
        intervention: true,
        payment: true
    });

    const { open: openDrawer, close: closeDrawer } = useDrawer();

    const onHandleClose = (path: string) => () => {
        api(`/${path}/?cliente=${params.id}`, 'GET');
        closeDrawer();
    };

    const tabs: any[] = [
        {
            key: 'installations',
            label: 'clients.tabs.instalations'
        },
        {
            key: 'interventions',
            label: 'clients.tabs.intervention'
        },
        {
            key: 'bills',
            label: 'clients.tabs.payments'
        }
    ];

    const { t } = useTranslation();
    const { api, state } = useHttpClient();
    const [data, setData] = useState<any>({});
    const [selected, setSelected] = useState<any>({});

    useEffect(() => {
        api(`/clientes/${params.id}/`, 'GET');
    }, []);

    useEffect(() => {
        if (state.data && !state.isLoading) {
            setData(state.data);
        }
    }, [state]);

    return (
        <>
            <div className="w-full bg-gray-lighter py-[24px] px-[24px]">
                <div
                    className="flex items-cente cursor-pointer space-x-[16px] text-black"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeftIcon className="h-3 w-3 mt-[2.5px]" />
                    <span className="not-italic font-normal text-xs leading-4">
                        {t('clients.link.go-back')}
                    </span>
                </div>
            </div>
            <div className="flex items-center w-full bg-gray-lighter pb-[24px] h-[30px] px-[24px] space-x-[24px]">
                <span className="not-italic font-medium text-2xl leading-8">
                    {data.name}
                </span>

                <span className="flex items-center space-x-2 px-2 py-1 border border-gray-light rounded-md">
                    <span
                        className={classNames(
                            'h-2 w-2 rounded-full bg-gray-darker',
                            data.activo ? 'bg-success' : 'bg-danger'
                        )}
                    />
                    <span>{data.activo ? t('clients.label.active') : t('clients.label.inactive')}</span>
                </span>
            </div>
            <div className="flex items-center w-full bg-gray-lighter border-b py-[24px] border-gray h-[20px] px-[24px] space-x-[24px]">
                {tabs.map(
                    (tab: { key: string; label: string }, idx: number) => (
                        <span
                            key={idx}
                            onClick={() => {
                                navigate(tab.key);
                            }}
                            className={classNames(
                                'not-italic font-light text-sm leading-6 cursor-pointer',
                                route.pathname.includes(tab.key)
                                    ? 'text-black'
                                    : 'text-gray-dark'
                            )}
                        >
                            {t(tab.label)}
                        </span>
                    )
                )}
            </div>
            <div className="flex flex-col px-[24px] py-[32px] space-y-[24px]">
                <Outlet />
            </div>
        </>
    );
};
