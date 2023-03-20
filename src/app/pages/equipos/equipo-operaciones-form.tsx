import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';
import { useHttpClient } from '../../shared/http-client';
import { Toggle } from '../../elements/toggle';

// construccion del objecto yup de validacion del cuestionario
let obligado = {};
const validacion = Yup.object().shape(obligado);

const initialValues = {};

export const EquipoOperacionesForm = ({
    item,
    close,
    doDelete
}: {
    item?: any;
    close: () => void;
    doDelete?: (item: any) => void;
}) => {
    const { t } = useTranslation();
    const { api, state } = useHttpClient();
    const [data, setData] = useState<any | null>(null);
    const [operaciones, setOperaciones] = useState<any | null>([]);
    const [operacionesEquipo, setOperacionesEquipo] = useState<any | null>([]);
    const [modos] = useState<any | null>([
        {
            id: 'APARATO',
            name: t('equpos.modo.aparato')
        },
        {
            id: 'ZONA',
            name: t('equpos.modo.zona')
        }
    ]);

    useEffect(() => {
        api(`/operaciones/?limit=999999&tipo_equipo=${item.tipo_equipo.id}`, 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            const datos = { ...item };
            datos.modo = item.modo
                ? modos.find((m: any) => m.id === item.modo)
                : {};
            setOperacionesEquipo([...item.operaciones]);
            setData(datos);
        }
    }, [item]);

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('operaciones')) {
                setOperaciones(state.data.results);
            }

            // if (state.path.includes('equipos')) {
            //     close();
            // }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    const updateOperaciones = (
        operacion: number,
        estado: { [key: string]: boolean | object }
    ) => {
        let newOperaciones = [...operacionesEquipo];
        const { toggle } = estado;

        if (typeof toggle === 'boolean') {
            const estoy = newOperaciones.find((o: any) => o.id === operacion);

            if (estoy) {
                // esta en las operacion del equipo
                if (!toggle) {
                    // pero viene con toggle a false, hay que eliminarla
                    newOperaciones = newOperaciones.filter(
                        (o: any) => o.id !== operacion
                    );
                    actualizaOperaciones(newOperaciones);
                }
            } else {
                // no esta en las opraciones del equipo
                if (toggle) {
                    // pero viene con toggle a true, hay que añadirlo
                    newOperaciones = [...newOperaciones, { id: operacion }];
                    actualizaOperaciones(newOperaciones);
                }
            }
        }
    };

    const actualizaOperaciones = (newOperaciones: any[]) => {
        // set is array de operaciones del equipo
        const newOperacionesId = newOperaciones.map((o: any) => o.id);
        // enviar a BE
        api(`/equipos/${item.id}/`, 'PATCH', { operaciones: newOperacionesId });
        // actualiza el state
        setOperacionesEquipo(newOperaciones);
    };

    return (
        <div>
            {operaciones.map((o: any) => {

                return (
                    <Toggle
                        value={operacionesEquipo.find(
                            (oi: any) => oi.id === o.id
                        )}
                        onChange={(res) => updateOperaciones(o.id, res)}
                        label={o.name}
                    />
                );
            })}
        </div>
    );
};
