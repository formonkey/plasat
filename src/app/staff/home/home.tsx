import dayjs from 'dayjs';

import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { Agenda } from '../agenda';
import { HomeBody } from './home-body';
import { classNames } from '../../utils';
import { useHttpClient } from '../../shared/http-client';
import { HomeFooter, HomeOperations } from './components';

export const Home = () => {
    const { t } = useTranslation();
    const { api, state } = useHttpClient();
    const [data, setData] = useState<any[]>([]);
    const [image, setImage] = useState<any>('');
    const [event, setEvent] = useState<any>(null);
    const [operations, setOperations] = useState([]);
    const [timeLapse, setTimeLapse] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState({
        day: dayjs(),
        type: 'today'
    });

    const requestBySelectedDate = () => {
        if (selectedDate.type === 'today') {
            api(
                `/intervenciones/hoy/?limit=9999&desde=${selectedDate.day.format(
                    'YYYY-MM-DD'
                )}`,
                'GET'
            );
        } else {
            api(
                `/intervenciones/calendario/?limit=9999&desde=${selectedDate.day.format(
                    'YYYY-MM-DD'
                )}`,
                'GET'
            );
        }
    };

    const handleEdit = (event: any) => {
        setEvent(event);
    };

    const toggleForceStatus = (event: any, status: number) => {
        data.map((item) => {
            if (item.id === event.id) {
                item.status = status;
                item.intervention_status = status;
            }
        });

        setData([...data]);
    }

    useEffect(() => {
        if (state.data) {
            if (
                state.path.includes('calendario') ||
                state.path.includes('hoy')
            ) {
                state.data.results.forEach((item: any) => {
                    if (!item.is_tiempos_operacion) {
                        item.intervention_status = item.fecha_final
                            ? 4
                            : item.intervencionrun.length === 0
                                ? 1
                                : item.intervencionrun[item.intervencionrun.length - 1]
                                    .fin
                                    ? 3
                                    : 2;
                    } else {
                        const temp = [].concat
                            .apply(
                                [],
                                item?.equipos_intervencion?.map(
                                    (e: any) => e.operaciones_equipo
                                )
                            )
                            .map((item: any) => {
                                item.status = item.is_done
                                    ? 4
                                    : item.operacionrun.length === 0
                                        ? 0
                                        : item.operacionrun[item.operacionrun.length - 1]
                                            .fin
                                            ? 2
                                            : 1;

                                return item;
                            });

                        console.log('Home :: Effect ::: Temp', temp);

                        const isDone = temp.every((item: any) => item.status === 4);
                        const isInitialized = temp.some((item: any) => item.operacionrun.length)

                        if (!isDone && isInitialized) {
                            const isWaiting = temp.every((item: any) => item.operacionrun.length === 0);
                            const isRunning = temp.every((item: any) => item.operacionrun.length > 0);

                            if (isRunning) {
                                console.log('Home :: Effect ::: Temp :::: Status', temp.length);
                                const isPaused = temp.every((item: any) => item.operacionrun[item.operacionrun.length - 1].fin);

                                item.intervention_status = isPaused ? 3 : 2;
                            } else {
                                item.intervention_status = isWaiting ? 0 : 1;
                            }
                        } else {
                            item.intervention_status = isDone ? 4 : 0;
                        }

                    }
                });

                setData(state.data.results);

                if (event) {
                    setEvent(
                        state.data.results.find((e: any) => e.id === event.id)
                    );
                }
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    useEffect(() => {
        if (operations.length) {
            setOperations(event.equipos_intervencion);
        }
    }, [event]);

    useEffect(() => {
        requestBySelectedDate();
    }, [selectedDate]);

    return (
        <div className="flex w-full h-screen">
            {!operations.length ? (
                <>
                    <div
                        className={classNames(
                            'w-full sm:w-1/3 h-screen border-r border-gray-dark',
                            event ? 'hidden sm:block' : 'block'
                        )}
                    >
                        <Agenda
                            selectedDate={selectedDate}
                            data={data}
                            setSelectedDate={setSelectedDate}
                            onEdit={handleEdit}
                        />
                    </div>
                    <div
                        className={classNames(
                            'flex-1',
                            event ? 'block' : 'hidden sm:block'
                        )}
                    >
                        {!image ? (
                            <>
                                <HomeBody
                                    event={event}
                                    refresh={requestBySelectedDate}
                                    setImage={setImage}
                                    setOperations={setOperations}
                                    setEvent={setEvent}
                                    timeLapse={timeLapse}
                                    setTimeLapse={setTimeLapse}
                                    toggleForceStatus={toggleForceStatus}
                                />

                                {event && (
                                    <div className="absolute bottom-0 w-full sm:w-2/3">
                                        <HomeFooter
                                            data={event}
                                            forceFinalize={
                                                event?.is_tiempos_operacion
                                            }
                                            refresh={requestBySelectedDate}
                                            status={event.intervention_status}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col h-full w-full">
                                <div className="absolute top-0 w-full">
                                    <div className="flex relative bg-gray-900 items-center w-full h-[50px] opacity-80 px-[23px]">
                                        <div
                                            className="flex text-white cursor-pointer space-x-4"
                                            onClick={() => setImage('')}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                                />
                                            </svg>

                                            <span>
                                                {t(
                                                    'home-staff.show-image.back'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <img
                                    src={image}
                                    alt="Show image"
                                    className="w-full h-full"
                                />
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <HomeOperations
                    data={operations}
                    setOperations={setOperations}
                    refresh={requestBySelectedDate}
                />
            )}
        </div>
    );
};
