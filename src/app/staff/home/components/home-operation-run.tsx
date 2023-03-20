import React, { useEffect, useState } from 'react';

import { StoreKeys } from '../../../shared/store';
import { useCookies } from '../../../shared/cookies';
import { useHttpClient } from '../../../shared/http-client';
import { retrieveOperationRunsGetHoursDiff } from '../constants';

export const HomeOperationRun = ({ index, data, event, operationsList, setOperationsList, toggleForceStatus, setTimeLapse }: any) => {
    const { get } = useCookies();
    const { api, state } = useHttpClient();
    const [user, setUser] = useState<any>({});

    console.log("HomeOperationRun event :: ", event);
    console.log("HomeOperationRun data :: ", data);

    const setOperationTimeStatus = (data: any, status: number) => {

        console.log("setOperationTimeStatus STATUS :: ", status);

        let lastRun: any = { id: '' };

        if (data.operacionrun.length) {
            lastRun = data.operacionrun?.[data.operacionrun?.length - 1];
        }

        if (status === 1) {
            api('/operaciones-run/inicia/', 'POST', {
                operacion_equipo: data?.id,
                intervencion: event?.id,
            });
        } else if (status === 2) {
            api(`/operaciones-run/${lastRun?.id}/pausa/`, 'GET');
        } else if (status === 3) {
            api('/operaciones-run/reanuda/', 'POST', {
                operacion_equipo: lastRun.operacion_equipo
            });
        } else if (status === 4) {
            api(`/operaciones-run/${lastRun?.id}/termina/`, 'GET');
        }

        setTimeout(() => {
            api(`/intervenciones/${event?.id}/`, 'GET');
        }, 1500);
    };

    const handleOperationStatus = (operation: any, status: number) => {
        setOperationTimeStatus(operation, status);

        const operations = operationsList.map((item: any) => {
            if (item?.id === operation?.id) {
                operation.status = status;

                return operation;
            }

            return item;
        });

        setOperationsList([ ...operations ]);
    };

    useEffect(() => {
        const profile = get(StoreKeys.Profile);

        setUser(profile);
    }, []);

    useEffect(() => {
        if (state && state?.path?.includes('/intervenciones/') && state.data) {
            setOperationsList([].concat
                .apply([], state.data?.equipos_intervencion?.map((e: any) => e.operaciones_equipo))
                .map((item: any) => {
                    item.status = item.is_done ? 4 : item.operacionrun.length === 0 ? 0 : item.operacionrun[item.operacionrun.length - 1].fin ? 2 : 1;

                    return item;
                }));

            const temp: any = [].concat
                .apply([], state.data?.equipos_intervencion?.map((e: any) => e.operaciones_equipo));

            const isDone = temp.every((item: any) => item.is_done);
            const isWaiting = temp.every((item: any) => item.operacionrun[item.operacionrun.length - 1]?.fin);

            setTimeLapse(retrieveOperationRunsGetHoursDiff(state.data));

            toggleForceStatus(state.data, isDone ? 4 : isWaiting ? 3: 2);
        }
    }, [ state ]);

    return (
        <div
            key={index}
            className="flex text-gray-600 items-center justify-between text-xl border border-gray-200 rounded-md"
        >
            <div className="flex flex-col space-y-2 px-4 py-2">
                <span className="text-gray-900 text-[16px] leading-[24px]">
                    {data?.operacion?.name}
                </span>

                <div className="flex space-x-4">
                    <span
                        className="flex text-gray-500 space-x-1 text-[12px] leading-[14px]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-[14px] h-[14px]"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                        </svg>

                        <span>
                            {data?.operario?.name}
                        </span>

                        <span>
                            {data.status}
                        </span>

                    </span>

                    <span
                        className="flex text-gray-500 space-x-1 text-[12px] leading-[14px]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-[14px] h-[14px]"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                            />
                        </svg>

                        <span>
                            {data?.operacion?.tipo_equipo?.name}
                        </span>
                    </span>

                    <span
                        className="flex text-gray-500 space-x-1 text-[12px] leading-[14px]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-[14px] h-[14px]"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                            />
                        </svg>

                        <span>
                            {data?.equipo_intervencion?.equipo_instalacion?.equipo.name || "-"}
                        </span>

                        <span>
                            ({data?.equipo_intervencion?.equipo_instalacion?.ubicacion || "-"})
                        </span>
                    </span>
                </div>
            </div>
            {user?.id === data.operario?.id && (
                <div className="flex space-x-2 px-4 py-2">
                    {data.status === 0 ? (<div
                        className="bg-gray-300 rounded-md cursor-pointer"
                        onClick={() => handleOperationStatus(data, 1)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 m-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                            />
                        </svg>
                    </div>) : data.status === 1 || data.status === 3 ? (<>
                        <div
                            className="bg-gray-300 rounded-md cursor-pointer"
                            onClick={() => handleOperationStatus(data, 2)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 m-2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                                />
                            </svg>
                        </div>

                        <div
                            className="bg-gray-300 rounded-md cursor-pointer"
                            onClick={() => handleOperationStatus(data, 4)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 m-2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                />
                            </svg>
                        </div>
                    </>) : data.status === 2 ? (<>
                        <div
                            className="bg-gray-300 rounded-md cursor-pointer"
                            onClick={() => handleOperationStatus(data, 3)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 m-2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                                />
                            </svg>
                        </div>

                        <div
                            className="bg-gray-300 rounded-md cursor-pointer"
                            onClick={() => handleOperationStatus(data, 4)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 m-2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                />
                            </svg>
                        </div>
                    </>) : null}
                </div>
            )}
        </div>
    )
}
