import {useEffect, useState} from 'react';

import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {Outlet, useLocation, useNavigate, useParams} from 'react-router-dom';

// import {ChevronLeftIcon, MailIcon} from '@heroicons/react/outline';

import {classNames, estatusCardColor} from '../../utils';
import {Button} from '../../elements/button';
import {useHttpClient} from '../../shared/http-client';
import {useCookies} from "../../shared/cookies";
import {StoreKeys} from "../../shared/store";
import {MailIcon} from "@heroicons/react/solid";

export const IntervencionesDetail = ({
                                         path = 'intervenciones'
                                     }: {
    path?: string;
}) => {
    const params = useParams();
    const route = useLocation()
    const {get: getCookie} = useCookies()

    const tabs: any[] = [
        {
            key: 'tareas',
            label: 'intervenciones.tabs.tareas',
        },
        {
            key: 'consumos',
            label: 'intervention.tab-label.consume',
        },
        {
            key: 'materiales',
            label: 'intervenciones.tabs.materiales',
        },
        {
            key: 'horas',
            label: 'intervention.tab-label.hours',
        },
        {
            key: 'imagenes',
            label: 'intervenciones.tabs.imagenes',
        },
        {
            key: 'tickets',
            label: 'intervenciones.tabs.tickets',
        },
        {
            key: 'firmas',
            label: 'intervenciones.tabs.firmas',
        }
    ];

    const navigate = useNavigate();
    // const location = useLocation();
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [item, setItem] = useState<any>({});
    const [data, setData] = useState<any>({});


    useEffect(() => {
        api(`/${path}/${params.id}/`, 'GET');
    }, []);

    useEffect(() => {
        if (!state.isLoading) {
            if (state.data && state.data.results) {
            } else if (state.data) {
                if (state.path.includes('intervenciones')) {
                    if (state.path.includes('send_pdf_intervencion')) {
                        toast(t('common.label.mail-sent'));
                    } else {
                        setItem(state.data);
                    }
                }
                setData(state.data);
            }

            if (state.error) {
                if (state.path.includes('send_pdf_intervencion')) {
                    toast.error(t('intervention-detail.error.save-pdf'));
                } else {
                    toast.error(state.error.detail);
                }
            }
        }
    }, [state]);


    const sendParte = (item: any) => {
        const configuracion = getCookie(StoreKeys.Configuration)
        api(`/intervenciones/${item.item.id}/send_pdf_intervencion/?cliente=${configuracion.id}`, 'GET');
    };

    return Object.keys(data).length ? (
        <>
            <div className="w-full bg-gray-lighter py-[24px] px-[24px]">
                {/*<div*/}
                {/*    className="flex items-cente cursor-pointer space-x-[16px] text-black"*/}
                {/*    onClick={() => navigate(`/${location?.state || "calendario"}`)}*/}
                {/*>*/}
                {/*    <ChevronLeftIcon className="h-3 w-3 mt-[2.5px]"/>*/}
                {/*    <span className="not-italic font-normal text-xs leading-4">*/}
                {/*        {t('intervenciones.link.go-back')}*/}
                {/*    </span>*/}
                {/*</div>*/}
            </div>
            <div className="flex items-center w-full bg-gray-lighter pb-[24px] h-[30px] px-[24px] space-x-[24px]">
                <span className="not-italic font-medium text-2xl leading-8">
                    {data.id} · {data.numero}
                </span>

                <span className="flex items-center space-x-2 px-2 py-1 border border-gray-light rounded-md">
                    <span
                        className={classNames(
                            'h-4 w-4 rounded-full',
                            estatusCardColor(data)
                        )}
                    />
                    <span>{data?.instalacion?.name}</span>
                    <span className={'text-xs'}>
                        {data?.tipo_intervencion?.name}
                    </span>
                </span>
            </div>

            <div
                className={
                    'flex justify-between w-full bg-gray-lighter border-b py-[24px] border-gray h-[20px] px-[24px]'
                }
            >
                <div className="flex items-center space-x-[24px]">
                    {tabs.map(
                        (tab: { key: string; label: string }, idx: number) => (
                            <span
                                key={idx}
                                onClick={() => {
                                    navigate(tab.key)
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

                <div className={'flex items-center space-x-2'}>
                    <Button
                        outlined
                        disabled={!item.fecha_final}
                        onClick={() => sendParte({item})}
                        icon={<MailIcon className="h-5 w-5"/>}
                        label="common.label.send-parte"
                    />
                </div>

            </div>

            <div className="px-[24px] py-4 bg-gray-lighter flex flex-col space-y-2">
                {item.descripcion && item.descripcion !== '' && (
                    <div className="bg-white p-4 shadow rounded-lg">
                        <div className={"text-[10px] text-gray-400"}>{t("common.label.descripcion")}</div>
                        <div className={"text-sm"}>{item.descripcion}</div>
                    </div>
                )}
                {item.observaciones && item.observaciones !== '' && (
                    <div className="bg-white p-4 shadow rounded-lg">
                        <div className={"text-[10px] text-gray-400"}>{t("common.label.observaciones")}</div>
                        <div className={"text-sm"}>{item.observaciones}</div>
                    </div>
                )}
                {item.trabajos && item.trabajos !== '' && (
                    <div className="bg-white p-4 shadow rounded-lg">
                        <div className={"text-[10px] text-gray-400"}>{t("common.label.trabajos")}</div>
                        <div className={"text-sm"}>{item.trabajos}</div>
                    </div>
                )}
            </div>

            <Outlet/>


        </>
    ) : null;
};
