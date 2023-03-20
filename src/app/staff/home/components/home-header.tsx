import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';

import { useTranslation } from 'react-i18next';

import { classNames } from '../../../utils';
import { getHoursDiff, HomeStaffOperationStatus, retrieveOperationRunsGetHoursDiff } from '../constants';
import { HomeInterventionForm } from './home-intervention-form';
import { useDrawer } from '../../../shared/drawer';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { InterventionConsume } from '../../../pages/intervenciones/intervention-consume';
import { InterventionHours } from '../../../pages/intervenciones/intervention-hours';

export const HomeHeader = ({ data, setEvent, doCloseDrawer, timeLapse, setTimeLapse }: any) => {
    const { t } = useTranslation();
    const { open: openDrawer } = useDrawer();
    const [showMore, setShowMore] = useState<boolean>(false);

    const handleCloseDrawer = () => {
        doCloseDrawer();
    };

    const openDrawerEvent = (title: string, Component: any, item?: any) => {
        openDrawer(
            title,
            <Component mode="md" item={item} close={handleCloseDrawer} />,
            item,
            "4xl"
        );
    };

    useEffect(() => {
        setTimeLapse(null);
        setShowMore(false);
    }, [data]);

    useEffect(() => {
        if (data.is_tiempos_operacion) {
            setTimeLapse(retrieveOperationRunsGetHoursDiff(data));
        } else {
            setTimeLapse(getHoursDiff(
                data.intervencionrun.length &&
                data.intervencionrun[0].inicio,
                data.intervencionrun.length &&
                data.intervencionrun[
                data.intervencionrun.length - 1
                    ].fin
            ));
        }
    }, [data]);

    return (
        <div className="flex flex-col bg-white w-full pt-8 pb-4 border-b border-gray-300">
            <div className="flex sm:hidden w-full mb-3 border-b border-gray-300 pb-4 px-[16px]">
                <span
                    className="flex space-x-2 items-center"
                    onClick={() => setEvent(null)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                    <span>{t('common.label.back')}</span>
                </span>
            </div>
            <div className="flex items-center w-full justify-between mb-4 px-[23px] ">
                <div className="flex space-x-4 items-center w-1/2 justify-start">
                    <h1 className="text-xl sm:text-3xl leading-[32px] font-regular">
                        #{data.numero}
                    </h1>
                    <span
                        className={classNames(
                            'inline-flex mt-0.5 rounded-full items-center px-2.5 py-0.5 text-sm font-medium text-gray-900',
                            data.tipo_intervencion.is_preventivo
                                ? 'bg-[#B6E4B5]'
                                : 'bg-[#FFD059]'
                        )}
                    >
                        {data.tipo_intervencion.name}
                    </span>
                </div>
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="text-gray-500 cursor-pointer flex flex-row items-center space-x-2 justify-end px-4 py-2">
                            <DotsHorizontalIcon className="w-5 h-5" />
                        </Menu.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            onClick={() =>
                                                openDrawerEvent(
                                                    'home-staff.drawer-title.material',
                                                    HomeInterventionForm,
                                                    data
                                                )
                                            }
                                            className={classNames(
                                                active
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            {t('common.label.edit')}
                                        </span>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            onClick={() =>
                                                openDrawerEvent(
                                                    'home-staff.drawer-title.intervention-consume',
                                                    InterventionConsume,
                                                    data
                                                )
                                            }
                                            className={classNames(
                                                active
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            Pérdida y consumo
                                        </span>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            onClick={() =>
                                                openDrawerEvent(
                                                    'home-staff.drawer-title.intervention-hours',
                                                    InterventionHours,
                                                    data
                                                )
                                            }
                                            className={classNames(
                                                active
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                            )}
                                        >
                                            Horas
                                        </span>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            <div className="w-full px-[23px] ">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <HomeStaffOperationStatus
                            t={t}
                            status={data.intervention_status}
                            hasLabel
                        />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">
                            {t('home-staff.header.time-lapsed')}
                        </span>
                        <span className="text-gray-900 text-sm mt-2">
                            {timeLapse || t('common.label.charge-time')}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">
                            {t('home-staff.header.client-installation')}
                        </span>
                        <span className="text-gray-900 text-sm mt-2">
                            {data.cliente?.name || '-'} /{' '}
                            {data.instalacion?.name || '-'}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">
                            {t('home-staff.header.direction')}
                        </span>
                        <span className="text-gray-900 text-sm mt-2">
                            {data.instalacion?.direccion},{' '}
                            {data.instalacion?.cp}{' '}
                            {data.instalacion?.cliente?.province?.name}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-sm">
                            {t('home-staff.header.description')}
                        </span>
                        <span className="text-gray-900 text-sm mt-2">
                            {data.descripcion || '-'}
                        </span>
                    </div>
                    {showMore ? (
                        <>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    {t('home-staff.header.observations')}
                                </span>
                                <span className="text-gray-900 text-sm mt-2">
                                    {data.observaciones || '-'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">
                                    {t('trabajos')}
                                </span>
                                <span className="text-gray-900 text-sm mt-2">
                                    {data.trabajos || '-'}
                                </span>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
                <div
                    className="flex space-x-2 mt-8 cursor-pointer text-xl text-[#2C62B4] items-center justify-start"
                    onClick={() => setShowMore(!showMore)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={classNames(
                            'w-5 h-5',
                            showMore ? 'rotate-180' : 'mt-1'
                        )}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                    </svg>
                    <span className="">
                        {t(
                            !showMore
                                ? 'home-staff.header.show-more'
                                : 'home-staff.header.show-less'
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};
