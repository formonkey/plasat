import * as Yup from 'yup';

import {useEffect, useState} from 'react';

import {CalendarSmall} from '../../../assets/icons/CalndarSmall';
import {DateTimePicker} from '../../elements/date-time-picker';
import {EquiposPlanificarForm} from './equipos-planificar-form';
import {FieldError} from '../../elements/field-error/field-error';
import {FormFooter} from '../../elements/form-footer';
import {Formik} from 'formik';
import {Input} from '../../elements/input';
import {Select} from '../../elements/select';
import {SelectAsync} from '../../elements/select-async';
import {Toggle} from '../../elements/toggle';
import dayjs from 'dayjs';
import {toast} from 'react-toastify';
import {useHttpClient} from '../../shared/http-client';
import {useTranslation} from 'react-i18next';
import {useNavigate} from "react-router-dom";

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    // numero: Yup.string().required('obligatorio'),
    tipo_intervencion: Yup.number().required('obligatorio').nullable(),
    cliente: Yup.object().required('obligatorio').nullable(),
    instalacion: Yup.number().required('obligatorio').nullable(),
    fecha_arranque: Yup.date().required('obligatorio').nullable(),
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    facturar: false,
    cliente: null,
    periodicidad: {},
    instalacion: null,
    intervenciones: 1,
    fecha_arranque: null,
    equipos_intervencion: [],
};

export const PlanificarForm = ({
                                   item,
                                   close,
                                   doDelete
                               }: {
    item?: any;
    close: () => void;
    doDelete?: (item: any) => void;
}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {api, state, options} = useHttpClient();
    const [data, setData] = useState<any | null>(null);
    const [tiposIntervencion, setTiposIntervencion] = useState<any | null>([]);
    const [tipoIntervencion, setTipoIntervencion] = useState<any | null>({});
    const [periodicidades, setPeriodicidades] = useState<any | null>([]);
    const [instalaciones, setInstalaciones] = useState<any | null>([]);
    const [listaFechas, setListaFechas] = useState<any | null>([]);
    const [equiposIntervencion, setEquiposIntervencion] = useState<any | null>(
        []
    );

    useEffect(() => {
        api('/tipos-intervencion/?limit=9999', 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        after.cliente = after.cliente ? after.cliente.id : null;
        delete after.fecha_arranque;

        return after;
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            // api(`/intervenciones/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            if (listaFechas.length > 0) {
                let idx = 1;
                const fechas = [];
                for (const fecha of listaFechas) {
                    if (dayjs(fecha).format('HH') === '00') {
                        fechas.push(dayjs(fecha).format('YYYY-MM-DDT07:mm:ss'));
                    } else {
                        fechas.push(dayjs(fecha).format('YYYY-MM-DDTHH:mm:ss'));
                    }
                    idx++;
                }

                enviaremos.fechas = fechas;
                enviaremos.equipo_instalacion = equiposIntervencion;

                delete enviaremos.equipos_intervencion;
                delete enviaremos.periodicidad;
                delete enviaremos.intervenciones;
                delete enviaremos.numero;

                api('/intervenciones/recursivas/', 'POST', enviaremos);
            }
        }
    };

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('tipos-intervencion')) {
                const preventiva = state.data.results.find(
                    (x: any) => x.is_preventivo
                );
                if (preventiva) {
                    setTipoIntervencion(preventiva);
                    setTiposIntervencion(state.data.results);
                    api('/periodicidades/?limit=9999', 'GET');
                } else {
                    toast.error(t("intervencion.form.no-preventiva"));
                    navigate("tipos-intervencion");
                    close();
                }
            }

            if (state.path.includes('periodicidades')) {
                setPeriodicidades(state.data.results);
            }

            if (state.path.includes('instalaciones')) {
                setInstalaciones(state.data.results);
            }

            if (state.path.includes('recursivas')) {
                close();
            }
        }

        if (state.error) {
            console.log("ERROR ::: ", state.error);
            if ("error" in state.error.detail) {
                toast.error(t(state.error.detail.error));
            } else {
                toast.error(t(state.error.detail.detail));
            }
        }
    }, [state]);


    useEffect(() => {
        console.log('equiposIntervencion', equiposIntervencion);
    }, [equiposIntervencion]);

    const calcula = (values: any) => {
        if (values.fecha_arranque && values.periodicidad) {
            const periodo = periodicidades.find(
                (x: any) => x.id === values.periodicidad
            );

            if (periodo) {
                let fechas = [];

                if (periodo.numero_meses === 0) {
                    for (let i = 0; i < +values.intervenciones; i++) {
                        const fecha = dayjs(values.fecha_arranque)
                            .add(i, 'week')
                            .format('YYYY-MM-DD, HH:mm');
                        fechas.push(fecha);
                    }
                } else {
                    for (let i = 0; i < +values.intervenciones; i++) {
                        const fecha = dayjs(values.fecha_arranque)
                            .add(i * periodo.numero_meses, 'month')
                            .format('YYYY-MM-DD, HH:mm');
                        fechas.push(fecha);
                    }
                }
                setListaFechas(fechas);
            }
        }
    };

    return (
        <div>
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
                      touched,
                      setFieldValue,
                      handleSubmit,
                      isSubmitting
                  }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/*<pre>{JSON.stringify(values, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                        <div className="grid grid-cols-2 gap-2 justify-between items-center w-full">


                            <Select
                                name="tipo_intervencion"
                                label={t('intervencion.form.tipo_intervencion')}
                                placeholder="common.placeholder.select-value"
                                items={tiposIntervencion}
                                value={tipoIntervencion}
                                disabled
                                onChange={(value) => {
                                    setFieldValue(
                                        'tipo_intervencion',
                                        value.tipo_intervencion
                                    );
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2 justify-between items-center w-full mb-4">
                            <div className="flex flex-col">
                                <DateTimePicker
                                    type="time"
                                    value={values.fecha_arranque}
                                    name={'fecha_arranque'}
                                    label={t(
                                        'intervencion.form.fecha_arranque'
                                    )}
                                    onChange={(value) => {
                                        setFieldValue(
                                            'fecha_arranque',
                                            value.fecha_arranque
                                        );
                                        calcula({
                                            ...values,
                                            fecha_arranque: value.fecha_arranque
                                        });
                                    }}
                                />
                                <FieldError touched={touched} errors={errors} field={"fecha_arranque"}/>

                                <Select
                                    name="periodicidad"
                                    label={t('intervencion.form.periodicidad')}
                                    placeholder="common.placeholder.select-value"
                                    items={periodicidades}
                                    value={values.periodicidad}
                                    onChange={(value) => {
                                        setFieldValue(
                                            'periodicidad',
                                            value.periodicidad
                                        );
                                        calcula({
                                            ...values,
                                            periodicidad: value.periodicidad
                                        });
                                    }}
                                />

                                <Input
                                    name="intervenciones"
                                    label={t(
                                        'intervencion.form.intervenciones'
                                    )}
                                    type="number"
                                    placeholder={t(
                                        'intervencion.form.intervenciones'
                                    )}
                                    value={values.intervenciones}
                                    onChange={(value) => {
                                        setFieldValue(
                                            'intervenciones',
                                            value.intervenciones
                                        );
                                        calcula({
                                            ...values,
                                            intervenciones: value.intervenciones
                                        });
                                    }}
                                />
                            </div>

                            <div className="flex flex-col bg-gray-light w-full h-full p-2 rounded-[4px]">
                                <div
                                    className={
                                        'text-xs text-gray-darker mb-4 flex justify-start space-x-2'
                                    }
                                >
                                    <CalendarSmall/>
                                    <div>
                                        {t('intervencion.form.programadas')}
                                    </div>
                                </div>
                                <ul>
                                    {listaFechas.map(
                                        (fecha: string, index: number) => (
                                            <li
                                                key={index}
                                                className={
                                                    'text-xs text-gray-darker ml-4 mb-1'
                                                }
                                            >
                                                {dayjs(fecha).format("DD/MM/YYYY")}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>

                        <Toggle
                            value={values.facturar}
                            onChange={(value) => {
                                setFieldValue('facturar', value.toggle)
                            }
                            }
                            label={t('intervencion.form.facturar')}
                        />

                        <div className="grid grid-cols-2 gap-2 justify-between items-center w-full">
                            <div>
                                <SelectAsync
                                    name={'cliente'}
                                    label={'intervencion.form.cliente'}
                                    placeholder="common.placeholder.select-value"
                                    items={(inputValue: string) => {
                                        return options(
                                            `/clientes/?limit=9999&name=${inputValue}&activo=true`
                                        );
                                    }}
                                    value={values.cliente}
                                    onChange={(value) => {
                                        setFieldValue('cliente', value || {});
                                        if (value) {
                                            api(
                                                `/instalaciones/?limit=999999&cliente=${value.id}`,
                                                'GET'
                                            );
                                        }
                                    }}
                                />
                                <FieldError touched={touched} errors={errors} field={"cliente"}/>
                            </div>

                            <Select
                                name="instalacion"
                                label={t('intervencion.form.instalacion')}
                                placeholder="common.placeholder.select-value"
                                items={instalaciones}
                                value={values.instalacion}
                                disabled={!values.cliente}
                                onChange={(value) =>
                                    setFieldValue(
                                        'instalacion',
                                        value.instalacion
                                    )
                                }
                            />
                        </div>

                        <div className="w-full bg-gray-light p-2 mb-4 text-gray-dark text-sm rounded-[4px]">
                            {t('intervencion.form.equipos')}
                        </div>

                        <EquiposPlanificarForm
                            item={values}
                            doChange={(values: number[]) =>
                                setEquiposIntervencion(values)
                            }
                        />

                        <div className={"py-16"}/>

                        <FormFooter
                            item={item}
                            doDelete={doDelete}
                            doSubmit={handleSubmit}
                            close={close}
                        />
                    </form>
                )}
            </Formik>
        </div>
    );
};
