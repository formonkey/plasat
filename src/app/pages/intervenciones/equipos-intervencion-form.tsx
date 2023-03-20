import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useHttpClient } from '../../shared/http-client';
import { FormFooter } from '../../elements/form-footer';
import { Toggle } from '../../elements/toggle';
import { Button } from '../../elements/button';
import { useTranslation } from 'react-i18next';
import { useDrawer } from '../../shared/drawer';
import { EquipoForm } from '../equipos/equipo-form';

export const EquiposIntervencionForm = ({
    item,
    close
}: {
    item?: any;
    close: () => void;
    doDelete?: (item: any) => void;
}) => {
    const { t } = useTranslation();
    const { open: openDrawer } = useDrawer();

    const { api, state } = useHttpClient();
    const [equipos, setEquipos] = useState<any | null>([]);
    const [equiposIntervencion, setEquiposIntervencion] = useState<any | null>(
        []
    );

    useEffect(() => {
        if (item) {
            api(
                `/equipos-instalacion/?instalacion=${
                    typeof item.instalacion === 'object'
                        ? item.instalacion.id
                        : item.instalacion
                }&limit=999999`,
                'GET'
            );
            setEquiposIntervencion([...item.equipos_intervencion]);
        }
    }, [item]);

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('equipos-instalacion/?instalacion')) {
                setEquipos(state.data.results);
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    const addNewEquipo = () => {
        // añade nuevo equipo a la instalacion desde el formulario de intervencion/equipos
        close();
        setTimeout(() => {
            openDrawer(
                'intervenciones.drawer.add-equipo',
                <EquipoForm close={handelAddInstalacion} />
            );
        }, 500);
    };

    const handelAddInstalacion = (equipo: any) => {
        if (equipo) {
            api(`/instalaciones/${item.instalacion.id}/`, 'PATCH', {
                equipos: [...item.instalacion.equipos, equipo.id]
            });
        }
        close();
    };

    const updateOperaciones = (
        equipo: number,
        equipoIntervencion: number | null,
        estado: { [key: string]: boolean | object }
    ) => {
        console.log(equipo, equipoIntervencion, estado);
        if (equipoIntervencion) {
            // quitarlo
            if (!estado.toggle) {
                api(`/equipos-intervencion/${equipoIntervencion}`, 'DELETE');
            }
        } else {
            // ponerlo
            if (estado.toggle) {
                api(`/equipos-intervencion/`, 'POST', {
                    intervencion: item.id,
                    equipo_instalacion: equipo
                });
            }
        }
    };

    return (
        <div className={'flex flex-col items-end'}>
            {equipos.map((o: any, index: number) => {
                console.log(o);
                return (
                    <Toggle
                        key={index}
                        value={equiposIntervencion.find(
                            (oi: any) => oi.equipo_instalacion.id === o.id
                        )}
                        onChange={(res) =>
                            updateOperaciones(
                                o.id,
                                equiposIntervencion.find(
                                    (oi: any) => oi.equipo_instalacion.id === o.id
                                )?.id ?? null,
                                res
                            )
                        }
                        label={`${o.equipo.name.toUpperCase()}, ${t("modelo")}: ${o.equipo.modelo ? o.equipo.modelo : '-'} (${o.ubicacion ? o.ubicacion : '-'})`}
                        sublabel={`${o.equipo.tipo_equipo.name ?? ''}`}
                    />
                );
            })}

            <Button
                label={t('equipos-intervencion.from.add-equipo')}
                outlined
                onClick={addNewEquipo}
                variant={'primary'}
            />

            <div className={"pb-24"}></div>

            <FormFooter
                item={item}
                close={() => close()}
                doSubmit={() => close()}
                hasClose={false}
            />
        </div>
    );
};
