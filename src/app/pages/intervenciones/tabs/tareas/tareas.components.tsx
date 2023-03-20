import {useParams} from 'react-router-dom';
import {PageBody} from "../../../../elements/page-body";
import {useDrawer} from "../../../../shared/drawer";
import {useEffect, useState} from "react";
import {FoldableCard} from "../../../../elements/foldable-card";
import {TableOperacionesEquipo} from "../../components/table-operaciones-equipo.element";
import {OperacionesEquipoForm} from "../../operaciones-equipo-form";
import {useHttpClient} from '../../../../shared/http-client';
import {toast} from 'react-toastify';
import {LocationMarkerIcon} from "@heroicons/react/outline";
import {useTranslation} from 'react-i18next';
import {EquiposIntervencionEditForm} from "../../equipos-intervencion-edit-form";
import {EquiposIntervencionForm} from "../../equipos-intervencion-form";

export const TareasComponent = () => {
    const {t} = useTranslation();
    const {id} = useParams();
    const {open, close} = useDrawer();
    const {api, state} = useHttpClient();

    const [intervencion, setIntervencion] = useState<any>(null);
    const [subData, setSubData] = useState<any>(null);
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        if (id) {
            api(`/intervenciones/${id}`, "GET")
        }
    }, [id]);

    useEffect(() => {
        if (state.data) {

            if (state.path.includes("equipos-intervencion")) {
                if (state.data.results) {
                    setSubData(state.data.results);

                } else {
                    api(`/equipos-intervencion/?limit=999999&intervencion=${intervencion.id}`, "GET")
                }
            }

            if (state.path.includes("intervenciones")) {
                setIntervencion(state.data);
                api(`/equipos-intervencion/?limit=999999&intervencion=${state.data.id}`, "GET")
            }
        }

        if (state.error) {
            toast.error(state.error.detail.detail);
        }
    }, [state]);

    const handleNewAction = () => {
        open(
            'intervenciones.drawer.add-equipo',
            <EquiposIntervencionForm
                item={intervencion}
                close={handleClose}
            />,
            false,
            "2xl"
        );
    };

    const handleClose = () => {
        api(`/equipos-intervencion/?limit=999999&intervencion=${intervencion.id}`, "GET")
        close();
    };

    const handleDelete = (itemId: number | string) => {
        api(`/equipos-intervencion/${itemId}/`, 'DELETE');
    };

    const handleSave = (id: number, item: any) => {
        if (id) {
            api(`/equipos-intervencion/${id}/`, 'PATCH', item);
        } else {
            api(`/equipos-intervencion/`, 'POST', item);
        }
    };

    return (
        <div className="flex h-full flex-col">
            <PageBody
                title={'intervenciones.tabs.tareas'}
                newAction={handleNewAction}
                newActionTitle={'intervenciones.drawer.add-equipo'}
            >
                {subData?.length
                    ? (subData.map((item: any, index: number) => {
                            return (
                                <FoldableCard
                                    key={index}
                                    item={item}
                                    count={
                                        count ||
                                        item.operaciones_equipo?.length ||
                                        0
                                    }
                                    doDelete={handleDelete}
                                    doSave={(e) => handleSave(item.id, e)}
                                    Detail={({item}: any) => (
                                        <div className="flex space-x-[8px]">
                                            <LocationMarkerIcon className="h-3 w-3 mt-[1.2px]"/>
                                            <span>
                                            {item?.equipo?.tipo_equipo?.name ||
                                                t('common.label.not-direction')}{' '}
                                            </span>
                                            <span>{item?.equipo_instalacion?.ubicacion}</span>
                                            <span>{item?.operario?.name}</span>
                                            <span>
                                                {item?.horas_estimadas
                                                    ? `${item.horas_estimadas} h.`
                                                    : ''}
                                            </span>
                                        </div>
                                    )}
                                    Form={() => <EquiposIntervencionEditForm item={item} close={handleClose}/>}
                                >
                                    <TableOperacionesEquipo
                                        parent={item}
                                        path={"operaciones-equipo/"}
                                        query={`limit=999999&equipo_intervencion=${item.id}`}
                                        doCount={(value) => setCount(value)}
                                        Form={OperacionesEquipoForm}
                                        buttonLabel={t(
                                            'common.label.add-new'
                                        )}
                                        headers={[
                                            {
                                                key: 'name',
                                                label: 'common.label.name'
                                            },
                                            {
                                                key: 'horas_estimadas',
                                                label: 'common.label.horas_estimadas'
                                            },
                                            {
                                                key: 'horas_reales',
                                                label: 'common.label.horas_reales',
                                                type: 'decimal',
                                                suffix: 'h',
                                            },
                                            {
                                                key: 'precio_hora',
                                                label: 'common.label.precio_hora'
                                            },
                                            {
                                                key: 'operario',
                                                label: 'common.label.operario'
                                            }
                                        ]}
                                    />
                                </FoldableCard>
                            )
                        })
                    ) :
                    (
                        <div className="flex justify-center text-center mt-[24px]">
                            <span className="not-italic font-light text-md leading-6 text-gray-darker">
                                {t('common.message.no-data')}
                            </span>
                        </div>
                    )
                }
            </PageBody>
        </div>
    );
};
