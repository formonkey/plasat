import {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {Select} from '../../elements/select';
import {FormFooter} from '../../elements/form-footer';
import {Toggle} from '../../elements/toggle';

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    precio_hora: Yup.number().nullable().when('password', (val) => {
        if (val || val === null) {
            return Yup.number().nullable().moreThan(0, "valor mayor que 0");
        } else {
            return Yup.string().nullable().notRequired();
        }
    }),
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    horas_estimadas: 0,
    precio_hora: null,
    horas_reales: 0,
    operario: null
};

export const OperacionesEquipoForm = ({
                                          item,
                                          close,
                                          doDelete
                                      }: {
    item?: any;
    close: (replicar: boolean, operario?: number) => void;
    doDelete?: (item: any) => void;
}) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [data, setData] = useState<any | null>(null);
    const [operarios, setOperarios] = useState<any | null>([]);
    const [replicar, setReplicar] = useState<boolean>(false);

    useEffect(() => {
        api(`/operarios/?is_active=true`, 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        after.operario =
            typeof values.operario === 'object'
                ? values.operario?.id ?? null
                : values.operario;
        after.precio_hora = after.precio_hora === '' ? null : after.precio_hora;

        delete after.id_operacion;
        delete after.id_equipo_intervencion;
        delete after.included;
        delete after.name;
        delete after.operaciones_equipo;

        return {...after};
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            api(`/operaciones-equipo/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            // api('/paises/', 'POST', enviaremos);
        }
    };

    useEffect(() => {

        if (state.data) {
            if (state.path.includes('operarios')) {
                setOperarios(state.data.results);
            }

            if (state.path.includes('operaciones-equipo')) {
                close(replicar, state.data.operario);
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    return (
        <div>
            <div className="flex flex-col mb-4">
                <div className={'font-bold text-xl'}>{data?.name}</div>
            </div>

            <Formik
                enableReinitialize={true}
                initialValues={data || initialValues}
                validationSchema={validacion}
                validateOnBlur={true}
                onSubmit={onSubmit}
            >
                {({
                      values,
                      errors,
                      setFieldValue,
                      handleSubmit,
                      isSubmitting
                  }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/*<pre>{JSON.stringify(item, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                        <Input
                            value={values.horas_estimadas}
                            label={t('intervencion.form.horas_estimadas')}
                            type="number"
                            name="horas_estimadas"
                            placeholder={t('intervencion.form.horas_estimadas')}
                            onChange={(value) =>
                                setFieldValue(
                                    'horas_estimadas',
                                    value.horas_estimadas
                                )
                            }
                        />

                        <Input
                            value={values.precio_hora}
                            label={t('intervencion.form.precio_hora')}
                            type="number"
                            name="precio_hora"
                            placeholder={t('intervencion.form.precio_hora')}
                            onChange={(value) =>
                                setFieldValue('precio_hora', value.precio_hora)
                            }
                            extraHolder={'€ / h'}
                        />

                        <Input
                            value={values.horas_reales}
                            label={t('intervencion.form.horas_reales')}
                            type="number"
                            name="horas_reales"
                            placeholder={t('intervencion.form.horas_reales')}
                            onChange={(value) =>
                                setFieldValue(
                                    'horas_reales',
                                    value.horas_reales
                                )
                            }
                        />

                        <Select
                            value={values.operario ?? {}}
                            label={t('intervencion.form.operario')}
                            placeholder="common.placeholder.select-value"
                            items={operarios}
                            name="operario"
                            onChange={(value) =>
                                setFieldValue('operario', value.operario)
                            }
                        />

                        <Toggle
                            value={replicar}
                            onChange={(value) => {
                                setReplicar(value.toggle);
                            }}
                            label={t('intervencion.form.replicar-operario')}
                        />

                        <FormFooter
                            item={item}
                            doDelete={doDelete}
                            doSubmit={handleSubmit}
                            close={() => close(false)}
                        />
                    </form>
                )}
            </Formik>
        </div>
    );
};
