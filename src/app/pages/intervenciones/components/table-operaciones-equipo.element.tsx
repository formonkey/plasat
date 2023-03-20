import {useEffect, useState} from 'react';

import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {DocumentDuplicateIcon, EyeIcon, PencilIcon, TrashIcon} from '@heroicons/react/outline';

import {classNames, noop} from '../../../utils';
import {useDrawer} from '../../../shared/drawer';
import {useHttpClient} from '../../../shared/http-client';
import {Toggle} from '../../../elements/toggle';
import {renderTableItem} from "../../../elements/table-item/table-item.element";

export const TableOperacionesEquipo = ({
                                           Form,
                                           onShow,
                                           headers,
                                           parent = {},
                                           doCount = noop,
                                       }: {
    path?: string;
    parent?: any;
    query?: string;
    buttonLabel?: string;
    onShow?: (item: any) => void;
    doCount?: (count: number) => void;
    Form: React.FunctionComponent<{
        item?: any;
        close: (replicar: boolean, operario?: number) => void;
    }>;
    headers: { key: string; label: string; width?: string; type?: string, suffix?: string }[];
}) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [hover, setHover] = useState<number | null>(null);
    const [data, setData] = useState<any[]>([]);
    const {open: openDrawer, close: closeDrawer} = useDrawer();

    const [operaciones, setOperaciones] = useState<any | null>([]);
    const [operacionesEquipo, setOperacionesEquipo] = useState<any | null>([]);

    const request = () => {
        api(
            `/operaciones/?tipo_equipo=${parent.equipo_instalacion?.equipo?.tipo_equipo?.id}&limit=999999`,
            'GET'
        );
    };

    useEffect(() => {
        setTimeout(() => {
            request();
        }, 200);
    }, []);

    const handleClose = (replicar: boolean, operario?: number) => {
        if (replicar) {
            for (const operacion of operacionesEquipo) {
                api(`/operaciones-equipo/${operacion.id}/`, 'PATCH', {
                    operario
                });
            }
            request();
        } else {
            request();
        }
        closeDrawer();
    };

    const handleEditAction = (item: any) => {
        openDrawer(
            'intervenciones.form.edit-operacion-equipo',
            <Form item={item} close={handleClose}/>
        );
    };

    const handleDuplicateAction = (item: any) => {
        api(`/operaciones-equipo/`, 'POST', {
            operacion: item.id_operacion,
            equipo_intervencion: item.id_equipo_intervencion
        });
    }

    const handleDeleteAction = (item: any) => {
        console.log(item);
        api(`/operaciones-equipo/${item.id}/`, 'DELETE');
    }

    const updateOperacion = (item: any, value: boolean) => {
        if (item.id) {
            if (!value) {
                api(`/operaciones-equipo/${item.id}/`, 'DELETE');
            } else {
                api(`/operaciones-equipo/${item.id}/`, 'PATCH', {
                    operario: item?.operario?.id,
                    equipo_intervencion: item.equipo_intervencion
                });
            }
        } else if (value) {
            api(`/operaciones-equipo/`, 'POST', {
                operacion: item.id_operacion,
                equipo_intervencion: item.id_equipo_intervencion
            });
        }
    };

    const recalcula = (data: any, operaciones: any) => {

        let resArray: any[] = [];

        data.map((item: any) => {
                const equipoOperacion = operaciones.find(
                    (element: any) => element.operacion.id === item.id
                );

                if (equipoOperacion) {
                    const equiposOperacion = operaciones.filter(
                        (element: any) => element.operacion.id === item.id
                    );
                    for (const operacion of equiposOperacion) {
                        resArray.push({
                            name: item.name,
                            horas_estimadas: operacion?.horas_estimadas ?? 0,
                            horas_reales: operacion?.horas_reales ?? 0,
                            precio_hora: operacion?.precio_hora ?? 0,
                            operario: operacion?.operario ?? null,
                            included: true,
                            id_equipo_intervencion: parent.id,
                            id_operacion: item.id,
                            id: operacion?.id ?? null,
                            instalacion_id: parent.intervencion.instalacion
                        });
                    }
                } else {
                    resArray.push({
                        name: item.name,
                        included: false,
                        id_equipo_intervencion: parent.id,
                        id_operacion: item.id,
                        instalacion_id: parent.intervencion.instalacion
                    });
                }
            }
        );
        return [...resArray];
    }

    useEffect(() => {
        api(`/operaciones-equipo/?equipo_intervencion=${parent.id}&limit=999999`, 'GET');
    }, [operaciones]);

    useEffect(() => {
        const cuenta = data.reduce((acc: number, item: any) => {
            return item.included ? acc + 1 : acc;
        }, 0);

        doCount(cuenta);
    }, [data]);

    useEffect(() => {
        setData([...recalcula(operaciones, operacionesEquipo)]);
    }, [operacionesEquipo]);

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('operaciones/?tipo_equipo')) {
                setOperaciones(state.data.results);
            }

            if (
                state.path.includes('operaciones-equipo') &&
                !state.path.includes('operaciones-equipo/?equipo_intervencion')
            ) {
                api(
                    `/operaciones-equipo/?equipo_intervencion=${parent.id}&limit=999999`,
                    'GET'
                );
            }

            if (
                state.path.includes('operaciones-equipo/?equipo_intervencion')
            ) {
                setOperacionesEquipo([...state.data.results]);
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    return (
        <div className="flex flex-col mb-3">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <table className="min-w-full ">
                        <thead>
                        <tr className="bg-gray-200 rounded-[4px] h-[32px]">
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                                {' '}
                            </th>

                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left bg-transparent text-gray-darker sm:pl-6 not-italic font-light text-xs leading-6"
                                >
                                    {t(header.label)}
                                </th>
                            ))}

                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                                {' '}
                            </th>
                        </tr>
                        </thead>
                        {data.length ? (
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {data.map((item, index) => (
                                <tr
                                    key={index}
                                    onMouseEnter={() => setHover(index)}
                                    onMouseLeave={() => setHover(null)}
                                    className="hover:bg-gray-lighterest"
                                >
                                    <td
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                    >
                                        <Toggle
                                            value={item.included}
                                            onChange={(value) =>
                                                updateOperacion(
                                                    item,
                                                    value.toggle
                                                )
                                            }
                                            label=""
                                            noMargin
                                        />
                                    </td>

                                    {renderTableItem(
                                        item,
                                        // headers.map((header) => header.key),
                                        headers,
                                        'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                                    )}

                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 z-10">
                                        {
                                            <>
                                                {onShow && (
                                                    <button
                                                        className="p-2 rounded-md"
                                                        onClick={
                                                            hover === index
                                                                ? () =>
                                                                    onShow(
                                                                        item
                                                                    )
                                                                : noop
                                                        }
                                                    >
                                                        <EyeIcon
                                                            className={classNames(
                                                                'h-5 w-5 ',
                                                                hover ==
                                                                index
                                                                    ? 'text-gray-dark hover:text-gray-darker'
                                                                    : 'text-transparent'
                                                            )}
                                                        />
                                                    </button>
                                                )}
                                                {item.included && (
                                                    <button
                                                        className="p-2 rounded-md"
                                                        onClick={
                                                            hover === index
                                                                ? () =>
                                                                    handleEditAction(
                                                                        item
                                                                    )
                                                                : noop
                                                        }
                                                    >
                                                        <PencilIcon
                                                            className={classNames(
                                                                'h-5 w-5 ',
                                                                hover ==
                                                                index
                                                                    ? 'text-gray-dark hover:text-gray-darker'
                                                                    : 'text-transparent'
                                                            )}
                                                        />
                                                    </button>
                                                )}
                                                {item.included && (
                                                    <button
                                                        className="p-2 rounded-md"
                                                        onClick={
                                                            hover === index
                                                                ? () =>
                                                                    handleDeleteAction(
                                                                        item
                                                                    )
                                                                : noop
                                                        }
                                                    >
                                                        <TrashIcon
                                                            className={classNames(
                                                                'h-5 w-5 ',
                                                                hover ==
                                                                index
                                                                    ? 'text-gray-dark hover:text-gray-darker'
                                                                    : 'text-transparent'
                                                            )}
                                                        />
                                                    </button>
                                                )}
                                                <button
                                                    className="p-2 rounded-md"
                                                    onClick={
                                                        hover === index
                                                            ? () =>
                                                                handleDuplicateAction(
                                                                    item
                                                                )
                                                            : noop
                                                    }
                                                >
                                                    <DocumentDuplicateIcon
                                                        className={classNames(
                                                            'h-5 w-5 ',
                                                            hover ==
                                                            index
                                                                ? 'text-gray-dark hover:text-gray-darker'
                                                                : 'text-transparent'
                                                        )}
                                                    />
                                                </button>
                                            </>
                                        }
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        ) : (
                            <tbody className="">
                            <tr>
                                <td
                                    colSpan={headers.length + 1}
                                    className="text-center pt-4"
                                >
                                        <span className="not-italic font-light text-sm leading-6 text-gray-darker">
                                            {t('common.message.no-data')}
                                        </span>
                                </td>
                            </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};
