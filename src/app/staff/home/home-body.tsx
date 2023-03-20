import dayjs from 'dayjs';

import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { classNames } from '../../utils';
import { useDrawer } from '../../shared/drawer';
import { HomeCard, HomeHeader, HomeOperationRun } from './components';
import { useHttpClient } from '../../shared/http-client';

import {
    TicketsIntervencionEditForm, ImagenesIntervencionEditForm, MaterialesIntervencionEditForm
} from '../../pages/intervenciones';

export const HomeBody = ({
    event, refresh, setImage, setOperations, setEvent, toggleForceStatus, timeLapse, setTimeLapse
}: any) => {
    const { t } = useTranslation();
    const { api } = useHttpClient();
    const [ operationsList, setOperationsList ] = useState<any[]>([]);
    const { open: openDrawer, close: closeDrawer } = useDrawer();

    // console.log('event', event);
    const handleCloseDrawer = () => {
        refresh();

        setTimeout(() => {
            closeDrawer();
        }, 200);
    };

    const handleDeleteMaterial = (item: any) => {
        api(`/materiales-intervencion/${item.id}/`, 'DELETE');
        handleCloseDrawer();
    };
    const handleDeleteImagen = (item: any) => {
        api(`/imagenes/${item.id}/`, 'DELETE');
        handleCloseDrawer();
    };
    const handleDeleteTicket = (item: any) => {
        api(`/tickets/${item.id}/`, 'DELETE');
        handleCloseDrawer();
    };

    const openDrawerEvent = (title: string, Component: any, item?: any, doDelete?: any) => {
        openDrawer(title, <Component
            item={{ intervencion: event.id, ...item }}
            close={handleCloseDrawer}
            doDelete={doDelete}
        />);
    };

    useEffect(() => {
        if (event) {
            setOperationsList([].concat
                .apply([], event?.equipos_intervencion?.map((e: any) => e.operaciones_equipo))
                .map((item: any) => {
                    item.status = item.is_done ? 4 : item.operacionrun.length === 0 ? 0 : item.operacionrun[item.operacionrun.length - 1].fin ? 2 : 1;

                    return item;
                }));
        }
    }, [ event ]);

    return event ? (<div className="flex flex-col bg-[#FAFAFA] h-full">
        <HomeHeader
            data={event}
            setEvent={setEvent}
            timeLapse={timeLapse}
            setTimeLapse={setTimeLapse}
            doCloseDrawer={handleCloseDrawer}
        />

        <div className="overflow-y-auto space-y-8 px-[23px] pt-8 pb-40">
            <HomeCard>
                <div className="flex space-x-2 items-center text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                    </svg>

                    <span className="uppercase leading-15 text-[12px] font-regular">
                            {t('home-staff.cards.operations-title')}
                        </span>
                </div>
                <div
                    className={classNames(operationsList.length && event?.is_tiempos_operacion ? 'block space-y-2 pt-4' : 'flex space-x-2 items-center text-gray-900 text-xl mt-4 cursor-pointer')}
                    onClick={() => {
                        if (operationsList.length && !event?.is_tiempos_operacion) {
                            setOperations(event.equipos_intervencion);
                        }
                    }}
                >
                    {event?.is_tiempos_operacion ? (operationsList.length ? (operationsList.map((operation: any, index: number) => (
                        <HomeOperationRun
                            key={`HomeOperationRun${index}`}

                            index={index}
                            event={event}
                            data={operation}
                            setTimeLapse={setTimeLapse}
                            operationsList={operationsList}
                            toggleForceStatus={toggleForceStatus}
                            setOperationsList={setOperationsList}
                        />
                    ))) : (
                        <span className="text-dark">
                                    {t('home-staff.cards.operations-empty')}
                                </span>
                    )) : (
                        <>
                            <span>
                                {operationsList.length}
                            </span>
                            <span>
                                {t('home-staff.cards.operations-total')}
                            </span>
                        </>
                    )}
                </div>
            </HomeCard>

            {/*************************************/}
            {/*lineas de las listas de operaciones*/}
            {/*************************************/}

            <HomeCard
                onAction={() => {
                    openDrawerEvent('home-staff.drawer-title.material', MaterialesIntervencionEditForm,);
                }}
                action={<span>{t('home-staff.cards.materials-action')}</span>}
            >
                <div className="flex space-x-2 items-center text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                        />
                    </svg>

                    <span className="uppercase leading-15 text-[12px] font-regular">
                            {t('home-staff.cards.materials-title')}
                        </span>
                </div>
                {event.materiales.length ? (event.materiales.map((material: any, index: number) => (<div
                    key={index}
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => {
                        openDrawerEvent('home-staff.drawer-title.material', MaterialesIntervencionEditForm, material, handleDeleteMaterial);
                    }}
                >
                    <div className="flex flex-col space-y-2 mt-4">
                                    <span className="text-gray-900 text-[16px] leading-[24px]">
                                        {material.name}
                                    </span>
                        {/*<span className="text-gray-400 text-[14px] leading-[24px]">*/}
                        {/*                {dayjs(material.fecha_pago).format('DD/MM/YYYY')}*/}
                        {/*            </span>*/}
                    </div>
                </div>))) : (<div
                    className="flex space-x-2 items-center text-gray-600 text-sm justify-center mt-4 font-light">
                            <span className="text-center">
                                {t('home-staff.cards.no-data')}
                            </span>
                </div>)}
            </HomeCard>

            <HomeCard
                onAction={() => {
                    openDrawerEvent('home-staff.drawer-title.images', ImagenesIntervencionEditForm);
                }}
                action={<span>{t('home-staff.cards.images-action')}</span>}
            >
                <div className="flex space-x-2 items-center text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                    </svg>

                    <span className="uppercase leading-15 text-[12px] font-regular">
                            {t('home-staff.cards.images-title')}
                        </span>
                </div>
                {event.imagenes?.length ? (event.imagenes?.map((image: any, index: number) => (<div
                    key={index}
                    className="flex justify-between items-center cursor-pointer z-0"
                >
                    <div
                        onClick={() => {
                            openDrawerEvent('home-staff.drawer-title.images', ImagenesIntervencionEditForm, image, handleDeleteImagen);
                        }}
                        className="flex flex-col flex-1 space-y-2 mt-4">
                                    <span className="text-gray-900 text-[16px] leading-[24px]">
                                        {image.name}
                                    </span>
                        {/*<span className="text-gray-400 text-[14px] leading-[24px]">*/}
                        {/*                {dayjs(image.fecha).format('DD/MM/YYYY')}*/}
                        {/*            </span>*/}
                    </div>
                    <div
                        className={'z-10 p-4 cursor-pointer text-[#2C62B4] text-[16px] leading-[24px] font-regular'}
                        onClick={() => {
                            setImage(image.imagen);
                        }}
                    >
                        {t('home-staff.cards.images-preview')}
                    </div>
                </div>))) : (<div
                    className="flex space-x-2 items-center text-gray-600 text-sm justify-center mt-4 font-light">
                            <span className="text-center">
                                {t('home-staff.cards.no-data')}
                            </span>
                </div>)}
            </HomeCard>

            <HomeCard
                onAction={() => {
                    openDrawerEvent('home-staff.drawer-title.tickets', TicketsIntervencionEditForm);
                }}
                action={<span>{t('home-staff.cards.tickets-action')}</span>}
            >
                <div className="flex space-x-2 items-center text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                        />
                    </svg>

                    <span className="uppercase leading-15 text-[12px] font-regular">
                            {t('home-staff.cards.tickets-title')}
                        </span>
                </div>
                {event.tickets?.length ? (event.tickets?.map((ticket: any, index: number) => (<div
                    key={index}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <div
                        onClick={() => {
                            openDrawerEvent('home-staff.drawer-title.images', TicketsIntervencionEditForm, ticket, handleDeleteTicket);
                        }}
                        className="flex flex-col flex-1 space-y-2 mt-4">
                                    <span className="text-gray-900 text-[16px] leading-[24px]">
                                        {ticket.name}
                                    </span>
                        {/*<span className="text-gray-600 text-[14px] leading-[24px]">*/}
                        {/*                {ticket.fecha}*/}
                        {/*            </span>*/}
                    </div>
                    <div
                        className={'z-10 p-4 cursor-pointer text-[#2C62B4] text-[16px] leading-[24px] font-regular'}
                        onClick={() => {
                            setImage(ticket.imagen);
                        }}
                    >
                        {t('home-staff.cards.images-preview')}
                    </div>

                </div>))) : (<div
                    className="flex space-x-2 items-center text-gray-600 text-sm justify-center mt-4 font-light">
                            <span className="text-center">
                                {t('home-staff.cards.no-data')}
                            </span>
                </div>)}
            </HomeCard>
        </div>
    </div>) : (<div className="flex flex-col pt-8 px-4 space-y-8 mt-32">
        <div className="flex justify-center flex-col items-center space-y-4">
            <img
                className="w-[600px]"
                src="/no-data.svg"
                alt="No data in view"
            />

            <h1 className="leading-[32px] font-regular text-[20px]">
                {t('home-staff.no-data.title')}
            </h1>

            <span className="leading-[24px] font-light text-[16px]">
                    {t('home-staff.no-data.subtitle')}
                </span>
        </div>
    </div>);
};
