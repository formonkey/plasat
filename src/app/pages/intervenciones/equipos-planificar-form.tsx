import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import {useHttpClient} from '../../shared/http-client';
import {Toggle} from '../../elements/toggle';

export const EquiposPlanificarForm = ({
                                          item,
                                          doChange
                                      }: {
    item?: any;
    doChange: (item: any) => void;
}) => {
    const {api, state} = useHttpClient();
    const [equipos, setEquipos] = useState<any | null>([]);
    const [equiposIntervencion, setEquiposIntervencion] = useState<any | null>(
        []
    );

    useEffect(() => {
        if (item && item.instalacion) {
            api(`/equipos-instalacion/?instalacion=${item.instalacion}`, 'GET');
            setEquiposIntervencion([...item.equipos_intervencion]);
        }
    }, [item]);

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('equipos-instalacion')) {
                setEquipos(state.data.results);
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    const updateOperaciones = (
        equipo: number,
        estado: { [key: string]: boolean | object }
    ) => {
        if (estado.toggle) {
            // ponerlo
            setEquiposIntervencion([...equiposIntervencion, equipo]);
        } else {
            // quitarlo
            const quitado = equiposIntervencion.filter(
                (e: any) => +e !== +equipo
            );
            setEquiposIntervencion([...quitado]);
        }
    };

    useEffect(() => {
        doChange(equiposIntervencion);
    }, [equiposIntervencion]);

    return (
        <div className={'flex flex-col items-end'}>
            {equipos?.map((e: any, index: number) => {
                return (
                    <Toggle
                        key={index}
                        value={equiposIntervencion.find(
                            (ei: any) => ei.equipo?.id === e.id
                        )}
                        onChange={(res) => updateOperaciones(e.id, res)}
                        label={`${e.equipo.name} ${e.equipo.modelo || ''}`}
                        sublabel={`${e.equipo.tipo_equipo.name ?? ''}`}
                    />
                );
            })}
        </div>
    );
};
