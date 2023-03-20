import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { classNames } from '../../../utils';
import { getHoursDiff } from '../constants';
import { useDrawer } from '../../../shared/drawer';
import { useHttpClient } from '../../../shared/http-client';
import { HomeSignatureForm } from './home-signature-form';
import dayjs from "dayjs";

export const HomeFooter = ({ status, data, refresh, forceFinalize }: any) => {
    const { t } = useTranslation();
    const { api, state } = useHttpClient();
    const [time, setTime] = useState<any>('(00:00:00)');
    const { open: openDrawer, close: closeDrawer } = useDrawer();

    const onClick = () => {
        const lastRun = data.intervencionrun[data.intervencionrun.length - 1];

        if (status === 1) {
            api('/intervenciones-run/inicia/', 'POST', {
                intervencion: data.id
            });
        } else if (status === 2) {
            api(`/intervenciones-run/${lastRun.id}/pausa/`, 'GET');
        } else if (status === 3) {
            api('/intervenciones-run/reanuda/', 'POST', {
                intervencion: data.id
            });
        }
    };

    const onHandleCloseFinishDrawer = () => {
        const lastRun = data.intervencionrun[data.intervencionrun.length - 1];
        console.log("onHandleCloseFinishDrawer :: lastRun", lastRun);

        if (lastRun) {
            api(`/intervenciones-run/${lastRun.id}/termina/?is_last_run=true`, 'GET');
        }

        // cerramos la intervencion cuando se han enviado las firmas
        api(`/intervenciones/${data.id}/`, 'PATCH', {
            fecha_final: dayjs().toDate(),
        });
        closeDrawer();
    };

    const onFinish = () => {
        openDrawer(
            'home-staff.drawer-title.signature-client',
            <HomeSignatureForm item={data} cancel={closeDrawer} close={onHandleCloseFinishDrawer} />
        );
    };

    const onSetTime = () => {
        const lastRun = data.intervencionrun[data.intervencionrun.length - 1];
        const diff = getHoursDiff(lastRun?.inicio, new Date());

        setTime(diff);
    };

    useEffect(() => {
        if (state.data && !state.isLoading) {
            refresh();
        }
    }, [state]);

    useEffect(() => {
        let interval: any = null;

        if (status === 2) {
            onSetTime();
            interval = setInterval(onSetTime, 1000);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [status]);

    return !forceFinalize ? (
        !data.is_tiempos_operacion ? (
            [1, 2, 3].includes(status) ? (
                <div className="flex bg-white border-t border-gray-300 px-[23px] py-4">
                    {status === 1 ? (
                        <button
                            type="button"
                            onClick={onClick}
                            className={classNames(
                                'inline-flex w-full text-center justify-center pr-[23px] items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent text-white bg-primary hover:bg-primary-dark'
                            )}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="mr-3 -ml-3 w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                                />
                            </svg>

                            {t('home-staff.action-footer.start-working')}
                        </button>
                    ) : status === 2 ? (
                        <div className="flex w-full flex-col">
                            <div className="flex justify-end items-center text-[#9399A6] space-x-2 mb-3">
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
                                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>

                                <span className="text-[14px] leading-[16px]">
                                    {time}
                                </span>
                            </div>
                            <div className="flex w-full space-x-4">
                                <button
                                    type="button"
                                    onClick={onClick}
                                    className={classNames(
                                        'inline-flex w-1/2 text-center justify-center pr-[23px] items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent bg-transparent border-[#B43C2C] text-[#B43C2C] hover:bg-[#B43C2C] hover:text-white'
                                    )}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="mr-3 -ml-3 w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                                        />
                                    </svg>

                                    {t('home-staff.action-footer.stop-working')}
                                </button>

                                <button
                                    type="button"
                                    onClick={onFinish}
                                    className={classNames(
                                        'inline-flex w-1/2 text-center justify-center pr-[23px] items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent text-white bg-primary hover:bg-primary-dark'
                                    )}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="mr-3 -ml-3 w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 12.75l6 6 9-13.5"
                                        />
                                    </svg>

                                    {t(
                                        'home-staff.action-footer.final-working'
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : status === 3 ? (
                        <div className="flex w-full flex-col">
                            <div className="flex justify-end items-center text-[#9399A6] space-x-2 mb-3">
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
                                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>

                                <span className="text-[14px] leading-[16px]">
                                    {getHoursDiff(
                                        data.intervencionrun.length &&
                                            data.intervencionrun[
                                                data.intervencionrun.length - 1
                                            ].inicio,
                                        data.intervencionrun.length &&
                                            data.intervencionrun[
                                                data.intervencionrun.length - 1
                                            ].fin
                                    )}
                                </span>
                            </div>
                            <div className="flex w-full space-x-4">
                                <button
                                    type="button"
                                    onClick={onClick}
                                    className={classNames(
                                        'inline-flex w-1/2 text-center justify-center pr-[23px] items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent bg-transparent border-primary text-primary'
                                    )}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="mr-3 -ml-3 w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                                        />
                                    </svg>

                                    {t(
                                        'home-staff.action-footer.restart-working'
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={onFinish}
                                    className={classNames(
                                        'inline-flex w-1/2 text-center justify-center pr-[23px] items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent text-white bg-primary hover:bg-primary-dark'
                                    )}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="mr-3 -ml-3 w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 12.75l6 6 9-13.5"
                                        />
                                    </svg>

                                    {t(
                                        'home-staff.action-footer.final-working'
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <></>
            )
        ) : (
            <></>
        )
    ) : (
        <div className="flex w-full space-x-4">
            <button
                type="button"
                onClick={onFinish}
                className={classNames(
                    'inline-flex w-full text-center justify-center pr-[23px] items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent text-white bg-primary hover:bg-primary-dark'
                )}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="mr-3 -ml-3 w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                    />
                </svg>

                {t('home-staff.action-footer.final-working')}
            </button>
        </div>
    );
};
